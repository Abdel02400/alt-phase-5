/**
 * Construit un objet en zippant deux tableaux : l'un fournit les clés,
 * l'autre les valeurs. Si les longueurs diffèrent, la plus courte
 * détermine le nombre d'entrées (évite les `undefined` parasites).
 */
export function createObjectFromArrays<V>(
  keys: readonly string[],
  values: readonly V[],
): Record<string, V> {
  const result: Record<string, V> = {};
  const length = Math.min(keys.length, values.length);
  for (let i = 0; i < length; i++) {
    result[keys[i]] = values[i];
  }
  return result;
}
