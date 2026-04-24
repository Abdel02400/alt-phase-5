# Exercice 2 — Nextcloud + PostgreSQL + Redis

## Problèmes identifiés dans la configuration d'origine

### 1. Nextcloud démarre avant que PostgreSQL soit prêt → "Internal Server Error"
**Cause** : `depends_on` sans condition. Nextcloud lance l'installation, n'arrive
pas à se connecter, et les volumes restent dans un état partiel qui casse les boots
suivants.
**Correction** : `healthcheck` sur postgres + `condition: service_healthy`.

### 2. Redis déclaré mais pas configuré côté Nextcloud
**Cause** : l'original lance `redis:alpine` mais **ne passe aucune variable** à
Nextcloud. Conséquence : Nextcloud ignore Redis, tombe sur le lock de fichier par
défaut, et affiche des erreurs de verrouillage transactionnel sous charge.
**Correction** : variables `REDIS_HOST`, `REDIS_HOST_PORT`, `REDIS_HOST_PASSWORD`
ajoutées côté `nextcloud`.

### 3. Redis sans authentification
**Risque** : `redis:alpine` par défaut accepte toute connexion → si le port est
exposé ou si un conteneur compromis existe sur le réseau, lecture libre du cache.
**Correction** : `command: redis-server --requirepass ${REDIS_PASSWORD}` + mot de
passe propagé à Nextcloud.

### 4. Port PostgreSQL exposé (`5432:5432`) sans raison
**Correction** : retiré. La DB n'est joignable que via le réseau `backend`.

### 5. Port Redis exposé (`6379:6379`) sans raison
**Correction** : retiré. Même logique.

### 6. Un seul volume pour Nextcloud → sauvegardes impossibles
**Cause** : `nextcloud_data:/var/www/html` mélange code, config et données utilisateur.
Impossible de sauvegarder uniquement les fichiers utilisateurs ou la config.
**Correction** : volumes séparés
- `nextcloud_data`       → code de l'app
- `nextcloud_config`     → configuration
- `nextcloud_custom_apps`→ apps additionnelles
- `nextcloud_user_data`  → **fichiers utilisateurs** (à sauvegarder en priorité)

### 7. `TRUSTED_DOMAINS` non configuré → écran blanc en prod
**Correction** : `NEXTCLOUD_TRUSTED_DOMAINS: localhost` (à ajuster au domaine réel).

### 8. Pas d'installation automatique de l'admin
**Correction** : `NEXTCLOUD_ADMIN_USER` + `NEXTCLOUD_ADMIN_PASSWORD` → l'instance est
prête à l'emploi sans passer par le formulaire d'installation.

### 9. `nextcloud:latest` non fixé
**Correction** : tag `29-apache` explicite pour éviter les mises à jour majeures non
maîtrisées (Nextcloud casse régulièrement ses upgrades).

### 10. Pas de réseau isolé
**Correction** : `backend` (db + redis) et `frontend` (accès externe).

## Bonnes pratiques appliquées

- [x] `.env` pour tous les secrets
- [x] Redis authentifié
- [x] Healthchecks sur postgres, redis et nextcloud
- [x] Volumes séparés pour sauvegarde granulaire
- [x] Réseaux isolés
- [x] Images taguées sur version majeure
- [x] Admin bootstrappé

## Lancement

```bash
cp .env.example .env
# Éditer .env

docker compose up -d
docker compose logs -f nextcloud

# Attendre que le healthcheck passe (~30-60s)
docker compose ps
```

## Vérification

- Nextcloud : http://localhost:8080
- Login : `admin` / `$NC_ADMIN_PASSWORD`
- Dans **Paramètres → Administration → Vue d'ensemble**, vérifier l'absence d'avertissements.

## Sauvegarde (exemple)

```bash
# Dump PostgreSQL
docker compose exec postgres pg_dump -U nextcloud nextcloud > backup-$(date +%F).sql

# Données utilisateurs
docker run --rm -v alt-phase-5_nextcloud_user_data:/src -v $(pwd):/dst alpine \
  tar czf /dst/user-data-$(date +%F).tgz -C /src .
```
