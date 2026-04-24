# MLD — Modèle Logique de Données

Transformation du MCD vers un modèle relationnel (PostgreSQL).

## Règles de transformation appliquées

1. Chaque **entité** → une table. L'identifiant devient la **clé primaire**.
2. Association **(1,1 ↔ 0,n / 1,n)** → la clé primaire du côté « n » reçoit
   une **clé étrangère** vers le côté « 1 » (pas de table intermédiaire).
3. Association **(n,m)** (ici `CONTRAT`) → table associative avec clé
   composite (id_auteur, id_livre) + attributs propres à la relation.
4. Association **ternaire/à attributs multiples** (ici `REDEVANCE` et
   `VENTE_MENSUELLE` avec la dimension temporelle) → table dédiée.

## Schéma relationnel (notation soulignée)

```
type_ouvrage(id_type, libelle, description)

editeur(id_editeur, nom, siret, adresse, telephone, email)

auteur(id_auteur, nom, prenom, email, iban, date_naissance, nationalite)

livre(id_livre, isbn, titre, date_publication, prix_public_ttc, nb_pages,
      #id_type, #id_editeur)

contrat(#id_auteur, #id_livre, pourcentage_contribution, taux_redevance,
        date_signature)

vente_mensuelle(id_vente, #id_livre, mois, annee, exemplaires_vendus,
                chiffre_affaires)

redevance(id_redevance, #id_auteur, #id_livre, mois, annee, montant_calcule,
          date_calcul)
```

> Convention : `id_x` souligné = clé primaire, `#id_x` = clé étrangère.

## Détail des clés étrangères

| Table             | Colonne       | → Référence         | Action ON DELETE |
|-------------------|---------------|---------------------|------------------|
| `livre`           | `id_type`     | `type_ouvrage(id)`  | RESTRICT         |
| `livre`           | `id_editeur`  | `editeur(id)`       | RESTRICT         |
| `contrat`         | `id_auteur`   | `auteur(id)`        | RESTRICT         |
| `contrat`         | `id_livre`    | `livre(id)`         | CASCADE          |
| `vente_mensuelle` | `id_livre`    | `livre(id)`         | CASCADE          |
| `redevance`       | `id_auteur`   | `auteur(id)`        | RESTRICT         |
| `redevance`       | `id_livre`    | `livre(id)`         | CASCADE          |

**Justification des actions `ON DELETE`** :
- `RESTRICT` sur les auteurs et éditeurs : on ne supprime pas un auteur tant
  qu'il a des contrats ou redevances (risque comptable/légal).
- `CASCADE` sur le livre : si un livre est retiré du catalogue, ses ventes et
  contrats associés n'ont plus de sens métier isolés.

## Contraintes `CHECK`

| Table             | Contrainte                                      |
|-------------------|-------------------------------------------------|
| `contrat`         | `pourcentage_contribution BETWEEN 0 AND 100`    |
| `contrat`         | `taux_redevance BETWEEN 0 AND 100`              |
| `vente_mensuelle` | `mois BETWEEN 1 AND 12`                         |
| `vente_mensuelle` | `exemplaires_vendus >= 0`                       |
| `vente_mensuelle` | `chiffre_affaires >= 0`                         |
| `redevance`       | `mois BETWEEN 1 AND 12`                         |
| `redevance`       | `montant_calcule >= 0`                          |
| `livre`           | `prix_public_ttc >= 0`                          |

## Contraintes d'unicité

| Table             | Colonnes uniques                                |
|-------------------|-------------------------------------------------|
| `editeur`         | `siret`                                         |
| `auteur`          | `email`                                         |
| `livre`           | `isbn`                                          |
| `vente_mensuelle` | `(id_livre, mois, annee)`                       |
| `redevance`       | `(id_auteur, id_livre, mois, annee)`            |

## Index secondaires recommandés

Au-delà des index créés automatiquement sur les PK et UNIQUE :

- `livre(id_editeur)` et `livre(id_type)` — accélère les jointures éditeur/type
- `vente_mensuelle(annee, mois)` — reporting mensuel tous livres confondus
- `redevance(id_auteur, annee)` — vue auteur : ses redevances annuelles
- `contrat(id_auteur)` — vue auteur : liste de ses livres
