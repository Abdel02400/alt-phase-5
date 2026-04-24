/**
 * Filtre un objet en ne gardant que les entrées pour lesquelles
 * le prédicat renvoie `true`. Le prédicat reçoit la valeur et la clé.
 */
export function filterObject<T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean,
): Record<string, T> {
  const result: Record<string, T> = {};
  for (const key of Object.keys(obj)) {
    if (predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
