/**
 * Runner global : exécute tous les exemples des 18 exercices dans l'ordre.
 *
 * Chaque dossier `src/NN-nomFonction/` expose un fichier `<nom>.example.ts`
 * qui exporte une fonction `run(): void` affichant la démo correspondante
 * au cas d'usage de l'énoncé.
 *
 * Pour ajouter un exemple : l'importer ci-dessous et l'ajouter à la liste.
 */

type Example = { title: string; run: () => void };

const examples: Example[] = [
  // Les exemples seront ajoutés ici au fur et à mesure des exercices.
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
