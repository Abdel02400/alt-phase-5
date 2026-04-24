# Partie 3 — Docker Compose Debugging Challenge

## Vue d'ensemble

5 exercices de debugging de configurations Docker Compose défectueuses.
Chacun dans son propre dossier, avec :

- `docker-compose.yml` corrigé
- `.env.example` — variables sensibles externalisées
- `README.md` — analyse des erreurs et corrections apportées
- Fichiers de config des services (nginx.conf, logstash.yml, filebeat.yml…)

## Arborescence

```
part-3-docker/
├── exercise-1-wordpress/    WordPress + MySQL + phpMyAdmin
├── exercise-2-nextcloud/    Nextcloud + PostgreSQL + Redis
├── exercise-3-mattermost/   Mattermost + PostgreSQL
├── exercise-4-elk/          Elasticsearch + Logstash + Kibana + Filebeat
└── exercise-5-kong/         Kong Gateway + 3 microservices nginx
```

## Méthodologie appliquée

1. **Lecture des logs** (`docker compose logs <service>`) pour identifier le
   symptôme racine.
2. **Vérification de la documentation officielle** (Docker Hub + docs produit)
   pour comprendre les variables d'environnement requises.
3. **Corrections incrémentales** : un problème à la fois, test, commit mental.
4. **Validation complète** : tous les services healthy + parcours fonctionnel.

## Patterns de corrections récurrents

Les mêmes classes d'erreurs reviennent dans plusieurs exercices :

| Pattern                                    | Exercices concernés | Correction                              |
|--------------------------------------------|---------------------|-----------------------------------------|
| `depends_on` sans `condition`              | 1, 2, 3, 4, 5       | Healthcheck + `service_healthy`         |
| Mots de passe en clair dans le YAML        | 1, 2, 3, 5          | `.env` + `.env.example` versionné       |
| Ports DB/cache inutilement exposés         | 1, 2, 5             | Retrait, accès via réseau interne       |
| Pas de réseau Docker custom                | 1, 2, 3, 5          | `backend` / `frontend` / dédié          |
| Images taguées `:latest`                   | 1, 2, 3             | Version majeure fixée                   |
| Variables d'env mal passées à l'app        | 1, 2, 3             | Lecture attentive du README Docker Hub  |
| Pas de healthcheck sur le service principal| 1, 2, 3, 4, 5       | Endpoint HTTP ou outil CLI natif        |

## Checklist des bonnes pratiques (appliquée partout)

- [x] Variables sensibles externalisées dans `.env`
- [x] Réseaux Docker isolés (séparation back/front quand pertinent)
- [x] Healthchecks sur les services critiques
- [x] `depends_on` avec conditions explicites
- [x] Volumes nommés pour la persistance
- [x] `restart: unless-stopped` (sauf jobs one-shot)
- [x] Images pinnées sur version connue
- [x] Montages de config en `:ro` (read-only) quand possible
- [x] Documentation des erreurs dans chaque README

## Vérification rapide de tous les composes

```bash
for dir in exercise-*/; do
  echo "=== $dir ==="
  (cd "$dir" && docker compose --env-file .env.example config -q && echo "OK" || echo "ERROR")
done
```

## Note sur les tests réels

Les 5 fichiers passent `docker compose config -q` (validation syntaxique).
L'exécution complète de chaque stack demande des ressources non triviales
(surtout ELK : ~4 Go de RAM recommandés) et certaines nécessitent des ajustements
hôte (voir `exercise-4-elk/README.md` pour `vm.max_map_count`).
