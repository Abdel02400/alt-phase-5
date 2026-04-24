/**
 * Runner global : exécute tous les exemples des 18 exercices dans l'ordre.
 *
 * Chaque dossier `src/NN-nomFonction/` expose un fichier `<nom>.example.ts`
 * qui exporte une fonction `run(): void` affichant la démo correspondante
 * au cas d'usage de l'énoncé.
 *
 * Pour ajouter un exemple : l'importer ci-dessous et l'ajouter à la liste.
 */

import { run as runGetValues }        from '@/01-getValues/getValues.example';
import { run as runTransformValues }  from '@/02-transformValues/transformValues.example';
import { run as runMergeObjects }     from '@/03-mergeObjects/mergeObjects.example';
import { run as runFilterObject }     from '@/04-filterObject/filterObject.example';
import { run as runFlatToNested }     from '@/05-flatToNested/flatToNested.example';

type Example = { title: string; run: () => void };

const examples: Example[] = [
  { title: '1. getValues',        run: runGetValues },
  { title: '2. transformValues',  run: runTransformValues },
  { title: '3. mergeObjects',     run: runMergeObjects },
  { title: '4. filterObject',     run: runFilterObject },
  { title: '5. flatToNested',     run: runFlatToNested },
];

function main(): void {
  if (examples.length === 0) {
    console.log('Aucun exemple enregistré pour le moment.');
    return;
  }

  for (const { title, run } of examples) {
    console.log(`\n=== ${title} ===`);
    run();
  }
}

main();
