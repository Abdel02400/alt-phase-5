/**
 * Transforme les valeurs d'un objet en appliquant une fonction sur chacune.
 * La fonction reçoit la valeur et la clé, et peut renvoyer un type différent.
 */
export function transformValues<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => U,
): Record<string, U> {
  const result: Record<string, U> = {};
  for (const key of Object.keys(obj)) {
    result[key] = fn(obj[key], key);
  }
  return result;
}
