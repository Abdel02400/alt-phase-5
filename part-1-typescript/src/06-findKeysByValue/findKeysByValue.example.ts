import { findKeysByValue } from './findKeysByValue';

/**
 * Cas d'usage : Recherche des produits en rupture de stock
 */
export function run(): void {
  const productStock = {
    laptop: 0,
    mouse: 5,
    keyboard: 0,
    monitor: 3,
  };

  console.log(findKeysByValue(productStock, 0));
  // ["laptop", "keyboard"]
}
