# Exercice 4 — Stack ELK (Elasticsearch + Logstash + Kibana + Filebeat)

## Problèmes identifiés dans la configuration d'origine

### 1. Elasticsearch crash OOM → "max virtual memory areas vm.max_map_count is too low"
**Symptôme** :
```
ERROR: [1] bootstrap checks failed
[1]: max virtual memory areas vm.max_map_count [65530] is too low,
     increase to at least [262144]
```
**Cause** : ES requiert `vm.max_map_count=262144` sur l'hôte Linux.
**Correction** (hôte, une seule fois) :
```bash
sudo sysctl -w vm.max_map_count=262144
# Permanent :
echo "vm.max_map_count=262144" | sudo tee /etc/sysctl.d/elasticsearch.conf
```
Sur Docker Desktop (Mac/Windows) la valeur est déjà suffisante.

### 2. Heap Java de 512 Mo trop petit
**Cause** : `ES_JAVA_OPTS=-Xms512m -Xmx512m` insuffisant pour 8.11 en single-node
— l'indexation échoue en circuit breaker dès quelques milliers de docs.
**Correction** : `-Xms1g -Xmx1g` + `mem_limit: 2g` sur le conteneur (règle : heap =
½ mémoire du conteneur).

### 3. `bootstrap.memory_lock` absent → ES swap et ralentit
**Correction** : ajout de `bootstrap.memory_lock=true` + `ulimits.memlock: -1`
pour autoriser le mlock.

### 4. `ulimits.nofile` absent → trop peu de file descriptors
**Correction** : `nofile: 65536` (valeur recommandée par Elastic).

### 5. Logstash démarre avant que ES soit prêt
**Cause** : `depends_on` sans condition. Logstash tente d'envoyer vers un ES encore
en init, crash, retry loop.
**Correction** : healthcheck sur ES + `condition: service_healthy` sur Logstash,
Kibana et Filebeat.

### 6. Kibana démarre avant ES → "Unable to retrieve version information"
**Correction** : même condition `service_healthy` sur ES.

### 7. Filebeat : permissions sur `filebeat.yml`
**Symptôme** :
```
Exiting: error loading config file: config file ("filebeat.yml") must be owned
by the user identifier (uid=0) or root
```
**Cause** : Filebeat refuse tout fichier de config lisible par d'autres utilisateurs
(sécurité). Sur un mount Docker ça arrive fréquemment.
**Correction** : `command: ["--strict.perms=false"]` et `user: root`.

### 8. Filebeat input `type: log` déprécié
**Correction** : remplacé par `type: filestream` (moderne en 8.x) + ajout du type
`container` pour collecter les logs Docker via `add_docker_metadata`.

### 9. `xpack.monitoring.elasticsearch.hosts` dans `logstash.yml` → warning 8.x
**Cause** : le collector `xpack.monitoring` est déprécié.
**Correction** : `xpack.monitoring.enabled: false`. Le monitoring passe par
Metricbeat en 8.x.

### 10. Pas de healthcheck sur Logstash et Kibana
**Correction** : ajouté sur `:9600/` et `/api/status`.

### 11. Pipeline Logstash sans filter + index mal formé
**Cause** : `index => "%{[@metadata][beat]}-%{[@metadata][version]}-..."` génère
un nom d'index illisible.
**Correction** : index `logs-<beat>-YYYY.MM.dd` + filter basique.

### 12. Sécurité entièrement désactivée
**Note** : OK pour un environnement de dev. En prod, activer `xpack.security` avec
certificats générés par `elasticsearch-certutil`.

## Prérequis hôte

### Linux
```bash
sudo sysctl -w vm.max_map_count=262144
```

### Docker Desktop (Mac/Windows)
Aucune action : la VM a déjà la bonne valeur.

## Lancement

```bash
docker compose up -d

# Suivre le démarrage (prend ~2 min la première fois)
docker compose logs -f elasticsearch

# Vérifier les healthchecks
docker compose ps
```

## Vérification

```bash
# Cluster health
curl http://localhost:9200/_cluster/health | jq

# Kibana
open http://localhost:5601

# Voir les index créés
curl http://localhost:9200/_cat/indices?v
```

Dans Kibana : **Discover** → créer une index pattern `logs-*` pour voir les logs.

## Test d'ingestion

```bash
# Envoyer un event JSON via le port TCP de logstash
echo '{"message":"test log","service":"demo"}' | nc localhost 5000
```

Puis dans Kibana Discover, l'événement doit apparaître sous quelques secondes.

## Bonnes pratiques appliquées

- [x] Mémoire ES calibrée (heap + mem_limit)
- [x] `memlock` + `nofile` configurés
- [x] Healthchecks sur les 3 services critiques
- [x] `depends_on: service_healthy` pour l'ordre de démarrage
- [x] Filebeat avec `filestream` (non déprécié)
- [x] Volumes en `:ro` pour la config
- [x] Réseau `elk` dédié
