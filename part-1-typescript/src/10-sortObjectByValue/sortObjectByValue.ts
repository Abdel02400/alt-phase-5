/**
 * Trie les entrées d'un objet par valeur (ordre ascendant par défaut).
 * La contrainte `T extends number | string` correspond aux types naturellement
 * ordonnables via les opérateurs < et >.
 */
export function sortObjectByValue<T extends number | string>(
  obj: Record<string, T>,
  direction: 'asc' | 'desc' = 'asc',
): Record<string, T> {
  const sign = direction === 'asc' ? 1 : -1;

  const entries = Object.entries(obj).sort(([, a], [, b]) => {
    if (a < b) return -sign;
    if (a > b) return sign;
    return 0;
  });

  const result: Record<string, T> = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}
