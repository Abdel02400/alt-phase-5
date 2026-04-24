/**
 * Runner global : exécute tous les exemples des 18 exercices dans l'ordre.
 *
 * Chaque dossier `src/NN-nomFonction/` expose un fichier `<nom>.example.ts`
 * qui exporte une fonction `run(): void` affichant la démo correspondante
 * au cas d'usage de l'énoncé.
 */

import { run as runGetValues }              from '@/01-getValues/getValues.example';
import { run as runTransformValues }        from '@/02-transformValues/transformValues.example';
import { run as runMergeObjects }           from '@/03-mergeObjects/mergeObjects.example';
import { run as runFilterObject }           from '@/04-filterObject/filterObject.example';
import { run as runFlatToNested }           from '@/05-flatToNested/flatToNested.example';
import { run as runFindKeysByValue }        from '@/06-findKeysByValue/findKeysByValue.example';
import { run as runCreateObjectFromArrays } from '@/07-createObjectFromArrays/createObjectFromArrays.example';
import { run as runCountValues }            from '@/08-countValues/countValues.example';
import { run as runExtractProperties }      from '@/09-extractProperties/extractProperties.example';
import { run as runSortObjectByValue }      from '@/10-sortObjectByValue/sortObjectByValue.example';
import { run as runFindMaxValue }           from '@/11-findMaxValue/findMaxValue.example';
import { run as runCreateObjectFromPairs }  from '@/12-createObjectFromPairs/createObjectFromPairs.example';
import { run as runFindValueInObject }      from '@/13-findValueInObject/findValueInObject.example';
import { run as runGroupByProperty }        from '@/14-groupByProperty/groupByProperty.example';
import { run as runValidateObject }         from '@/15-validateObject/validateObject.example';
import { run as runCompareDifferences }     from '@/16-compareDifferences/compareDifferences.example';
import { run as runObjectToUrlParams }      from '@/17-objectToUrlParams/objectToUrlParams.example';
import { run as runGetObjectStats }         from '@/18-getObjectStats/getObjectStats.example';

type Example = { title: string; run: () => void };

const examples: Example[] = [
  { title: '1. getValues',              run: runGetValues },
  { title: '2. transformValues',        run: runTransformValues },
  { title: '3. mergeObjects',           run: runMergeObjects },
  { title: '4. filterObject',           run: runFilterObject },
  { title: '5. flatToNested',           run: runFlatToNested },
  { title: '6. findKeysByValue',        run: runFindKeysByValue },
  { title: '7. createObjectFromArrays', run: runCreateObjectFromArrays },
  { title: '8. countValues',            run: runCountValues },
  { title: '9. extractProperties',      run: runExtractProperties },
  { title: '10. sortObjectByValue',     run: runSortObjectByValue },
  { title: '11. findMaxValue',          run: runFindMaxValue },
  { title: '12. createObjectFromPairs', run: runCreateObjectFromPairs },
  { title: '13. findValueInObject',     run: runFindValueInObject },
  { title: '14. groupByProperty',       run: runGroupByProperty },
  { title: '15. validateObject',        run: runValidateObject },
  { title: '16. compareDifferences',    run: runCompareDifferences },
  { title: '17. objectToUrlParams',     run: runObjectToUrlParams },
  { title: '18. getObjectStats',        run: runGetObjectStats },
];

function main(): void {
  for (const { title, run } of examples) {
    console.log(`\n=== ${title} ===`);
    run();
  }
}

main();
