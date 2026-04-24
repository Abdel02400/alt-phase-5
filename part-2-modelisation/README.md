# Partie 2 — Modélisation MERISE : Système de redevances d'édition

## Contexte

Groupe d'édition souhaitant un système pour **calculer et suivre les redevances
versées aux auteurs**, avec 3 vues métier :

- **Administrateur** : gestion des auteurs, livres et éditeurs
- **Comptable** : calcul des redevances mensuelles
- **Auteur** : consultation de ses participations et droits

## Structure des livrables

```
part-2-modelisation/
├── README.md              # Ce fichier — vue d'ensemble
├── mcd/
│   ├── mcd.md             # Description textuelle du MCD
│   └── MCD.svg            # Schéma graphique (généré avec Mocodo)
├── mld.md                 # Modèle logique de données (tables + FK)
└── schema.sql             # Script SQL complet (DDL + données)
```

## Phase 1 — Analyse conceptuelle

### Entités retenues

| Entité          | Rôle                                                          |
|-----------------|---------------------------------------------------------------|
| `AUTEUR`        | Personne percevant des redevances                             |
| `EDITEUR`       | Maison d'édition publiant les livres                          |
| `LIVRE`         | Ouvrage commercialisé                                         |
| `TYPE_OUVRAGE`  | Catégorie (Roman, Essai, BD, Beau livre…) — extensible        |
| `VENTE_MENSUELLE` | Agrégat mensuel des ventes d'un livre                       |
| `REDEVANCE`     | Montant calculé pour un auteur sur un livre un mois donné     |

### Associations

| Association   | Entre                       | Cardinalités                  | Attributs                       |
|---------------|-----------------------------|-------------------------------|---------------------------------|
| `CLASSIFIE`   | TYPE_OUVRAGE ↔ LIVRE        | (0,n) — (1,1)                 | —                               |
| `PUBLIE`      | EDITEUR ↔ LIVRE             | (0,n) — (1,1)                 | —                               |
| `CONTRAT`     | AUTEUR ↔ LIVRE              | (0,n) — (1,n)                 | `pourcentage_contribution`, `taux_redevance`, `date_signature` |
| `GENERE`      | LIVRE ↔ VENTE_MENSUELLE     | (1,1) — (0,n)                 | —                               |
| `PERCOIT`     | AUTEUR + LIVRE ↔ REDEVANCE  | (1,1) + (1,1) — (0,n)         | —                               |

### Règles de gestion principales

1. Un **livre** a exactement **1 éditeur** et **1 type d'ouvrage**.
2. Un livre a **au moins 1 auteur** (co-écriture possible).
3. Chaque couple (auteur, livre) fait l'objet d'un **contrat** avec :
   - `pourcentage_contribution` ∈ [0, 100] — part de co-écriture
   - `taux_redevance` ∈ [0, 100] — pourcentage du CA reversé
4. Les ventes sont **agrégées mensuellement** par livre (1 ligne par livre / mois).
5. La **redevance** d'un auteur sur un livre pour un mois donné est calculée par :
   ```
   montant = CA_mensuel × (pourcentage_contribution / 100) × (taux_redevance / 100)
   ```

## Phase 2 — Transformation en MLD

Voir [mld.md](./mld.md) pour le détail complet des tables et contraintes.

## Phase 3 — Implémentation

Voir [schema.sql](./schema.sql) — script PostgreSQL exécutable avec :
- Création des tables
- Contraintes `CHECK` (pourcentages 0–100, mois 1–12…)
- Index sur les colonnes de jointure
- 3 lignes d'exemple par table

Pour exécuter :
```bash
psql -U postgres -f schema.sql
```

## Choix de modélisation

- **`TYPE_OUVRAGE` en table dédiée** plutôt qu'un `ENUM` : anticipe
  l'ajout de nouveaux types (manga, livre audio…) sans migration de schéma.
- **`CONTRAT` comme table associative enrichie** : le pourcentage et le taux
  sont propres au couple (auteur, livre), pas à l'auteur seul.
- **`VENTE_MENSUELLE` en agrégat** plutôt qu'une table `VENTE_UNITAIRE` :
  le besoin métier est mensuel, pas unitaire. Simplifie le calcul de redevance
  et réduit le volume.
- **`REDEVANCE` matérialisée** (stockée et non recalculée à la volée) :
  historique fiable, audit possible, performance des états comptables.
- **Index** sur toutes les FK et sur les couples (livre, mois, année) pour
  accélérer les requêtes récurrentes du comptable.
