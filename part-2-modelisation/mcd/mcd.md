# MCD — Modèle Conceptuel de Données

## Description textuelle

### Entités et attributs

```
TYPE_OUVRAGE
├── #id_type          (identifiant)
├── libelle           (ex: Roman, Essai, BD)
└── description

EDITEUR
├── #id_editeur       (identifiant)
├── nom
├── siret             (14 chiffres, unique)
├── adresse
├── telephone
└── email

AUTEUR
├── #id_auteur        (identifiant)
├── nom
├── prenom
├── email             (unique)
├── iban              (pour virement des redevances)
├── date_naissance
└── nationalite

LIVRE
├── #id_livre         (identifiant)
├── isbn              (13 chiffres, unique)
├── titre
├── date_publication
├── prix_public_ttc
└── nb_pages

VENTE_MENSUELLE
├── #id_vente         (identifiant)
├── mois              (1-12)
├── annee
├── exemplaires_vendus
└── chiffre_affaires

REDEVANCE
├── #id_redevance     (identifiant)
├── mois              (1-12)
├── annee
├── montant_calcule
└── date_calcul
```

### Associations et cardinalités

```
(TYPE_OUVRAGE) 1,1 -----< CLASSIFIE >----- 0,n (LIVRE)
                         un livre a un seul type, un type classe 0..n livres

(EDITEUR)      1,1 -----< PUBLIE   >----- 0,n (LIVRE)
                         un livre a un éditeur, un éditeur publie 0..n livres

(AUTEUR)       1,n -----< CONTRAT  >----- 1,n (LIVRE)
                         un livre a au moins 1 auteur,
                         un auteur a au moins 1 livre sous contrat
                         Attributs : pourcentage_contribution, taux_redevance,
                                     date_signature

(LIVRE)        1,1 -----< GENERE   >----- 0,n (VENTE_MENSUELLE)
                         chaque vente mensuelle est rattachée à un livre

(AUTEUR)       1,1 -----< PERCOIT  >----- 0,n (REDEVANCE)
(LIVRE)        1,1 -----< PERCOIT  >----- 0,n (REDEVANCE)
                         chaque redevance est liée à un couple (auteur, livre)
                         ternaire dégénérée : REDEVANCE dépend de (auteur, livre, mois, année)
```

## Contraintes d'intégrité

| Contrainte                             | Description                                            |
|----------------------------------------|--------------------------------------------------------|
| **CI-1** Pourcentage contribution      | 0 ≤ pourcentage_contribution ≤ 100                     |
| **CI-2** Taux redevance                | 0 ≤ taux_redevance ≤ 100                               |
| **CI-3** Somme contributions = 100 %   | Pour chaque livre, Σ pourcentage_contribution = 100    |
| **CI-4** Mois valide                   | 1 ≤ mois ≤ 12                                          |
| **CI-5** Année réaliste                | annee ≥ année de publication du livre                  |
| **CI-6** Unicité vente mensuelle       | (id_livre, mois, annee) unique dans VENTE_MENSUELLE    |
| **CI-7** Unicité redevance             | (id_auteur, id_livre, mois, annee) unique              |
| **CI-8** Montants ≥ 0                  | chiffre_affaires, montant_calcule, prix_public ≥ 0     |

## Schéma graphique

Le schéma visuel du MCD est fourni à côté de ce fichier sous le nom
`MCD.svg` (généré avec Mocodo).

Structure visuelle attendue :

```
  ┌──────────────┐      ┌──────────────┐        ┌──────────────┐
  │ TYPE_OUVRAGE │─1,1──│  CLASSIFIE   │──0,n───│    LIVRE     │
  └──────────────┘      └──────────────┘        └──────┬───────┘
                                                       │ 1,1
  ┌──────────────┐      ┌──────────────┐               │
  │   EDITEUR    │─1,1──│   PUBLIE     │──0,n──────────┤
  └──────────────┘      └──────────────┘               │
                                                       │ 1,n
  ┌──────────────┐      ┌──────────────┐               │
  │   AUTEUR     │─1,n──│   CONTRAT    │──1,n──────────┤
  │              │      │ %contrib     │               │
  │              │      │ %redevance   │               │
  └──────┬───────┘      └──────────────┘               │
         │ 1,1                                         │ 1,1
         │              ┌──────────────┐               │
         └──────────────│   PERCOIT    │───────────────┤
                        │(ternaire)    │               │
                        └──────┬───────┘               │
                               │ 0,n                   │
                        ┌──────┴───────┐               │
                        │  REDEVANCE   │               │
                        └──────────────┘               │
                                                       │
                        ┌──────────────┐               │
                        │VENTE_MENSUEL │──0,n──────────┘
                        └──────────────┘
```
