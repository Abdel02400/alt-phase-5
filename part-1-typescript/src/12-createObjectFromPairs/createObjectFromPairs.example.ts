import { createObjectFromPairs } from './createObjectFromPairs';

/**
 * Cas d'usage : Création d'un catalogue de produits
 */
export function run(): void {
  const productPairs: Array<[string, number]> = [
    ['pommes', 2.5],
    ['bananes', 1.8],
    ['oranges', 2.2],
  ];

  console.log(createObjectFromPairs(productPairs));
  // { pommes: 2.5, bananes: 1.8, oranges: 2.2 }
}
