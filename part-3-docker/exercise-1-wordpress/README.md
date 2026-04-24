# Exercice 1 — WordPress + MySQL + phpMyAdmin

## Problèmes identifiés dans la configuration d'origine

### 1. MySQL 8 ne peut pas démarrer sans mot de passe root
**Symptôme** : MySQL crash au boot avec
```
[ERROR] [Entrypoint]: Database is uninitialized and password option is not specified
You need to specify one of the following as an environment variable:
    - MYSQL_ROOT_PASSWORD
    - MYSQL_ALLOW_EMPTY_PASSWORD
    - MYSQL_RANDOM_ROOT_PASSWORD
```
**Cause** : la variable `MYSQL_ROOT_PASSWORD` (ou une de ses alternatives) est obligatoire.
**Correction** : ajout de `MYSQL_ROOT_PASSWORD` via `.env`.

### 2. WordPress démarre avant que MySQL soit prêt
**Symptôme** : WordPress affiche *"Error establishing a database connection"* au premier boot.
**Cause** : `depends_on` sans condition n'attend que le démarrage du conteneur, pas la
disponibilité réelle du service MySQL (qui met 15-30 s à s'initialiser).
**Correction** : `healthcheck` sur MySQL + `depends_on.condition: service_healthy` sur
WordPress et phpMyAdmin.

### 3. Sécurité : mots de passe en clair dans le fichier versionné
**Correction** : variables déplacées dans `.env` (exclu du git), avec un `.env.example`
livré en documentation.

### 4. Port MySQL exposé sans raison sur l'hôte
**Risque** : la base est joignable depuis internet si l'hôte est public.
**Correction** : plus de `ports: 3306:3306`. phpMyAdmin sur le réseau interne suffit
pour l'administration.

### 5. phpMyAdmin sur un compte non-root avec les droits limités
**Cause** : l'original forçait `PMA_USER` et `PMA_PASSWORD` → connexion en wordpress
sans accès global. Impossible d'administrer d'autres bases ou de voir les users.
**Correction** : suppression de `PMA_USER`/`PMA_PASSWORD` → phpMyAdmin présente
un écran de login, chacun se connecte avec les droits qu'il veut (root inclus).

### 6. Pas de réseau isolé
**Correction** : deux réseaux `backend` (db) et `frontend` (accès externe) pour limiter
la surface d'attaque.

### 7. Image `phpmyadmin/phpmyadmin` sans tag de version
**Correction** : tag `:latest` explicite (à verrouiller en prod sur une version précise).

## Bonnes pratiques appliquées

- [x] Variables sensibles dans `.env`
- [x] Réseaux Docker isolés (backend / frontend)
- [x] Healthcheck sur MySQL
- [x] `depends_on` avec condition `service_healthy`
- [x] Volumes nommés (persistance après `docker compose down`)
- [x] `restart: unless-stopped` sur tous les services
- [x] Pas de port DB exposé sur l'hôte

## Lancement

```bash
cp .env.example .env
# Éditer .env et changer les mots de passe

docker compose up -d

# Suivre les logs
docker compose logs -f

# Vérifier l'état
docker compose ps
```

## Vérification

- WordPress    : http://localhost:8080 (assistant d'installation)
- phpMyAdmin   : http://localhost:8081 (login : wordpress / `$MYSQL_PASSWORD`)

## Arrêt

```bash
docker compose down          # Arrête sans supprimer les volumes
docker compose down -v       # Arrête ET supprime les volumes (reset total)
```
