/**
 * Groupe un tableau d'objets en fonction d'une de leurs propriétés.
 * La clé du Record est la valeur de la propriété coercée en string
 * (compatible avec les propriétés numériques ou booléennes).
 */
export function groupByProperty<T, K extends keyof T>(
  items: readonly T[],
  property: K,
): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of items) {
    const key = String(item[property]);
    if (!result[key]) result[key] = [];
    result[key].push(item);
  }
  return result;
}
