import { filterObject } from './filterObject';

/**
 * Cas d'usage : Filtrage des produits en rupture de stock
 */
export function run(): void {
  const inventory = {
    laptop: 0,
    smartphone: 5,
    tablet: 0,
    headphones: 8,
  };

  console.log(filterObject(inventory, (stock) => stock === 0));
  // { laptop: 0, tablet: 0 }
}
