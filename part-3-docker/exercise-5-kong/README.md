# Exercice 5 — Architecture Microservices avec Kong API Gateway

## Problèmes identifiés dans la configuration d'origine

### 1. Migration Kong lancée avant que la base soit prête
**Symptôme** : `kong-migration` crash :
```
kong: [error] connection refused to kong-database:5432
```
**Cause** : `depends_on: kong-database` sans condition. La migration démarre dès
que le conteneur existe, pas quand PostgreSQL est prêt.
**Correction** : healthcheck `pg_isready` sur la DB + `condition: service_healthy`.

### 2. Kong démarre avant la fin des migrations → "relation does not exist"
**Cause** : aucun lien explicite entre `kong` et `kong-migration`. Les deux
démarrent en parallèle, Kong cherche des tables qui n'existent pas encore.
**Correction** : `depends_on.kong-migration.condition: service_completed_successfully`.

### 3. Kong retourne 502 Bad Gateway → aucun service n'est enregistré
**Cause critique, et c'est la racine du "rien ne communique"** : le compose
d'origine ne déclare **jamais** les services et routes dans Kong. Kong est un
proxy vide ; il n'a aucune idée de l'existence de `user-service`, `product-service`
et `order-service`.
**Correction** : ajout du conteneur `kong-bootstrap` qui, une fois Kong healthy,
appelle l'Admin API (`POST /services`, `POST /services/xxx/routes`) pour
enregistrer les 3 microservices.

### 4. Microservices et Kong sur des réseaux différents
**Cause** : sans déclaration explicite de network, Docker place chaque service sur
le réseau par défaut du projet, mais **la résolution DNS ne fonctionne que dans un
réseau Docker custom**. Kong ne peut pas joindre `user-service`.
**Correction** : réseau `kong-net` unique explicitement déclaré sur tous les services.

### 5. Ports des microservices inutilement exposés à l'hôte
**Cause** : `ports: 3001:80`, `3002:80`, `3003:80` contournent le gateway.
**Risque** : les clients peuvent taper les services directement, le gateway perd
son rôle (auth, rate-limit, logs centralisés).
**Correction** : plus aucun port publié pour les microservices. Seul Kong expose
8000 (proxy) et 8001 (admin).

### 6. Admin API Kong accessible depuis toute interface
**Risque** : l'Admin API permet de reconfigurer tout Kong sans auth par défaut.
**Correction partielle** : `KONG_ADMIN_LISTEN: 0.0.0.0:8001`. Sur la section
`ports:` on mappe `8001:8001` — à restreindre via firewall en prod, ou ajouter un
plugin `key-auth` sur l'Admin API.

### 7. Pas de healthcheck sur les microservices ni sur Kong
**Correction** : healthcheck sur `/health` (nginx) pour chaque service + `kong health`
pour le gateway. Nécessaire pour que `kong-bootstrap` ne démarre que quand Kong est prêt.

### 8. `restart` non défini → les services ne redémarrent pas après crash
**Correction** : `restart: unless-stopped` partout, sauf pour les jobs one-shot
(`kong-migration` et `kong-bootstrap` qui doivent sortir proprement).

### 9. Mots de passe Kong DB en dur
**Correction** : `.env` + `${KONG_PG_PASSWORD}`.

### 10. Redis présent mais sans usage
**Note** : le compose original déclare Redis mais aucun plugin Kong ne l'utilise.
On le garde pour d'éventuels plugins (`rate-limiting` avec policy Redis,
`response-ratelimiting`, etc.) mais son port 6379 n'est plus exposé.

## Architecture finale

```
           Client
             │
             ▼
      ┌──────────────┐
      │  Kong :8000  │  (proxy public)
      └──────┬───────┘
             │ (kong-net)
     ┌───────┼───────┐
     ▼       ▼       ▼
  user-svc  prod-svc order-svc   (port 80 interne, pas exposé)
     │       │       │
     └───────┴───────┘
             │
     kong-database (PostgreSQL)
             │
           redis   (prêt pour rate-limiting)
```

## Lancement

```bash
cp .env.example .env
# Éditer les mots de passe

docker compose up -d

# Suivre le démarrage (migration + bootstrap)
docker compose logs -f kong-migration kong kong-bootstrap

# Vérifier l'état
docker compose ps
```

## Vérification

```bash
# Admin API : lister les services enregistrés
curl http://localhost:8001/services | jq '.data[].name'
# Attendu : "user-service", "product-service", "order-service"

# Test des routes via le proxy
curl http://localhost:8000/api/users
# {"users":["john","jane","bob"]}

curl http://localhost:8000/api/products
# {"products":["laptop","phone","tablet"]}

curl http://localhost:8000/api/orders
# {"orders":["order-1","order-2","order-3"]}
```

## Ajouter un plugin (exemple : rate-limiting)

```bash
# 100 requêtes/minute sur user-service
curl -X POST http://localhost:8001/services/user-service/plugins \
  -d "name=rate-limiting" \
  -d "config.minute=100" \
  -d "config.policy=local"
```

## Bonnes pratiques appliquées

- [x] Migration DB déclenchée et attendue avant le proxy
- [x] Services et routes déclarés automatiquement (bootstrap reproductible)
- [x] Réseau Docker unique pour la résolution DNS
- [x] Microservices non exposés directement (gateway seul point d'entrée)
- [x] Healthchecks partout
- [x] Secrets via `.env`
- [x] Jobs one-shot avec `restart: "no"` et `service_completed_successfully`
- [x] Images pinnées

## Pour aller plus loin

- Passer en **mode déclaratif (DB-less)** avec `kong.yml` versionné, pour ne plus
  dépendre de l'Admin API au boot.
- Activer **key-auth** ou **JWT** sur les routes publiques.
- Centraliser les logs vers la stack ELK de l'exercice 4 via le plugin `http-log`.
