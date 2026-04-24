# Partie 1 — TypeScript : Object 2

Implémentation des **18 fonctions** de manipulation d'objets demandées par l'exercice.

## Stack

- **TypeScript 5** en mode strict
- **Jest + ts-jest** pour les tests unitaires
- **ts-node** pour l'exécution directe de la démo

## Structure

```
part-1-typescript/
├── src/
│   ├── object-functions.ts   # Les 18 fonctions typées
│   └── index.ts              # Démo exécutant tous les cas d'usage
├── tests/
│   └── object-functions.test.ts  # Tests unitaires Jest
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Installation et exécution

```bash
cd part-1-typescript
npm install

# Lance la démo (reproduit les cas de l'énoncé)
npm start

# Lance la suite de tests
npm test

# Build TypeScript → JavaScript
npm run build
```

## Les 18 fonctions à implémenter

| #  | Nom                      | Description                                            |
|----|--------------------------|--------------------------------------------------------|
| 1  | `getValues`              | Récupère toutes les valeurs d'un objet                 |
| 2  | `transformValues`        | Applique une fonction sur chaque valeur                |
| 3  | `mergeObjects`           | Fusionne deux objets en sommant les valeurs            |
| 4  | `filterObject`           | Filtre un objet selon un prédicat                      |
| 5  | `flatToNested`           | Convertit `{ "a.b": 1 }` en `{ a: { b: 1 } }`          |
| 6  | `findKeysByValue`        | Retourne les clés ayant une valeur cible               |
| 7  | `createObjectFromArrays` | Construit un objet depuis deux tableaux alignés        |
| 8  | `countValues`            | Compte les occurrences des valeurs                     |
| 9  | `extractProperties`      | Pick type-safe de certaines propriétés                 |
| 10 | `sortObjectByValue`      | Trie les entrées par valeur (asc/desc)                 |
| 11 | `findMaxValue`           | Valeur maximale parmi les nombres                      |
| 12 | `createObjectFromPairs`  | Depuis un tableau de paires `[clé, valeur]`            |
| 13 | `findValueInObject`      | Recherche récursive, retourne le chemin                |
| 14 | `groupByProperty`        | Groupe un tableau d'objets par propriété               |
| 15 | `validateObject`         | Valide un objet contre un schéma de types              |
| 16 | `compareDifferences`     | Diff entre deux objets (added / removed / modified)    |
| 17 | `objectToUrlParams`      | Sérialise en query string URL-encodée                  |
| 18 | `getObjectStats`         | Min, max, moyenne, médiane, variance, écart-type       |
