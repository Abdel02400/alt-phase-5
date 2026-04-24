/**
 * Construit un objet depuis un tableau de paires [clé, valeur].
 * Simple délégation à Object.fromEntries, mais avec un typage plus strict :
 * la clé est contrainte à `string` (et non PropertyKey) et la valeur
 * conserve son type générique V.
 */
export function createObjectFromPairs<V>(
  pairs: ReadonlyArray<readonly [string, V]>,
): Record<string, V> {
  return Object.fromEntries(pairs);
}
