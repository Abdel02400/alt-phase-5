import { mergeObjects } from './mergeObjects';

/**
 * Cas d'usage : Fusion des ventes mensuelles de deux magasins
 */
export function run(): void {
  const store1Sales = { january: 1000, february: 1200, march: 900 };
  const store2Sales = { january: 800, february: 950, march: 1100 };

  console.log(mergeObjects(store1Sales, store2Sales));
  // { january: 1800, february: 2150, march: 2000 }
}
