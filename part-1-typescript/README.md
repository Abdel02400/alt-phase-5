# Partie 1 — TypeScript : Object 2

Implémentation des **18 fonctions** de manipulation d'objets demandées par l'exercice.

## Stack

- **TypeScript 5** en mode strict
- **Jest + ts-jest** pour les tests unitaires
- **ts-node** pour l'exécution directe des exemples

## Architecture

Un dossier par exercice — chacun contient la fonction, ses tests et son exemple :

```
part-1-typescript/
├── src/
│   ├── 01-getValues/
│   │   ├── getValues.ts          # La fonction
│   │   ├── getValues.test.ts     # Les tests Jest
│   │   └── getValues.example.ts  # Le cas d'usage de l'énoncé
│   ├── 02-transformValues/
│   │   └── ...
│   ├── ... (18 dossiers)
│   └── run-all-examples.ts       # Runner qui enchaîne tous les exemples
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Commandes

```bash
cd part-1-typescript
npm install

# Exécute TOUS les exemples des 18 exercices en séquence
npm start

# Lance TOUS les tests Jest (auto-découverte dans src/**/*.test.ts)
npm test

# Mode watch pour les tests
npm run test:watch

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

## Convention par exercice

Chaque dossier `NN-nomFonction/` contient :

- **`nomFonction.ts`** — exporte la fonction, fortement typée.
- **`nomFonction.test.ts`** — tests Jest (cas nominal + cas limites).
- **`nomFonction.example.ts`** — exporte `run(): void` qui reproduit le cas
  d'usage de l'énoncé. Enregistré dans `run-all-examples.ts`.

## Alias TypeScript

Un alias `@/*` pointe vers `src/*` (configuré dans `tsconfig.json`, supporté par
ts-node via `tsconfig-paths` et par Jest via `moduleNameMapper`).

Imports recommandés :

```ts
// Depuis le runner global ou un autre exercice :
import { run as runGetValues } from '@/01-getValues/getValues.example';
import { getValues } from '@/01-getValues/getValues';

// À l'intérieur d'un exercice (même dossier), garder le chemin relatif :
import { getValues } from './getValues';
```
