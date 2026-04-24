# Exercice 3 — Mattermost + PostgreSQL

## Problèmes identifiés dans la configuration d'origine

### 1. Chaîne de connexion PostgreSQL incomplète → "Database connection failed"
**Symptôme** : logs Mattermost :
```
[ERROR] Failed to ping DB, retrying...
pq: SSL is not enabled on the server
```
**Cause** : `postgres://user:pass@host/db` sans paramètres. Mattermost tente une
connexion TLS par défaut, PostgreSQL (image officielle) ne la propose pas en local.
**Correction** : ajouter `?sslmode=disable&connect_timeout=10`. La nouvelle DSN est :
```
postgres://mattermost:****@postgres:5432/mattermost?sslmode=disable&connect_timeout=10
```

### 2. Mattermost démarre avant PostgreSQL
**Cause** : `depends_on` sans condition. Mattermost tente la connexion, ne voit pas la
DB, crash-loop.
**Correction** : `healthcheck` `pg_isready` sur postgres + `condition: service_healthy`.

### 3. Mots de passe en dur dans le compose
**Correction** : `.env` pour `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`,
`MM_SITE_URL`.

### 4. Volume `/mattermost/config` manquant
**Symptôme** : toute modification de config dans l'UI est perdue au redémarrage
(Mattermost 6+ stocke sa config dans `/mattermost/config/config.json` en local par défaut).
**Correction** : ajout d'un volume nommé `mattermost_config`.

### 5. Dossier `bleve-indexes` non persistant
**Cause** : l'index de recherche full-text est reconstruit à chaque redémarrage,
très long sur une instance peuplée.
**Correction** : volume `mattermost_bleve:/mattermost/bleve-indexes`.

### 6. Image taguée `:latest`
**Correction** : version pinnée `9.11` (LTS au moment de l'écriture). En prod :
suivre les notes de release avant chaque bump.

### 7. `MM_SERVICESETTINGS_SITEURL` codé en dur
**Problème** : impossible de distinguer dev / staging / prod sans éditer le compose.
**Correction** : déplacé dans `.env`.

### 8. Pas de healthcheck Mattermost
**Correction** : ajout d'un check sur l'endpoint officiel `/api/v4/system/ping`.

### 9. Pas de réseau isolé
**Correction** : `backend` (DB) + `frontend` (port 8065 exposé).

## Bonnes pratiques appliquées

- [x] Variables via `.env`
- [x] DSN PostgreSQL explicite avec `sslmode=disable`
- [x] Healthcheck des deux services
- [x] `depends_on: service_healthy`
- [x] Volumes complets (data, logs, config, plugins, bleve)
- [x] Réseaux isolés
- [x] Image pinnée sur version LTS
- [x] Mode développeur désactivé en prod

## Lancement

```bash
cp .env.example .env
# Éditer les mots de passe

docker compose up -d
docker compose logs -f mattermost

# Ping l'API
curl http://localhost:8065/api/v4/system/ping
```

## Première connexion

1. Ouvrir http://localhost:8065
2. Créer le compte administrateur système (premier compte = sysadmin)
3. Créer la première équipe

## Diagnostic en cas de "Database connection failed"

```bash
# Vérifier que postgres accepte les connexions
docker compose exec postgres pg_isready -U mattermost

# Tester la chaîne de connexion manuellement
docker compose exec postgres psql -U mattermost -d mattermost -c "SELECT 1;"

# Voir les vraies erreurs côté Mattermost
docker compose logs mattermost | grep -i error
```
