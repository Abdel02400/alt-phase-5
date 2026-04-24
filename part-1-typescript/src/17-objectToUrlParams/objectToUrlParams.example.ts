import { objectToUrlParams } from './objectToUrlParams';

/**
 * Cas d'usage : Construction d'une URL de recherche
 */
export function run(): void {
  const searchParams = {
    query: 'ordinateur portable',
    maxPrice: 1000,
    brand: 'Dell',
    inStock: true,
  };

  console.log(objectToUrlParams(searchParams));
  // query=ordinateur%20portable&maxPrice=1000&brand=Dell&inStock=true
}
