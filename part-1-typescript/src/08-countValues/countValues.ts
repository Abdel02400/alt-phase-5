/**
 * Compte le nombre d'occurrences de chaque valeur dans un objet.
 * Contrainte T extends string | number : seules les valeurs sérialisables
 * comme clé d'objet sont acceptées (évite les collisions sur [object Object]).
 */
export function countValues<T extends string | number>(
  obj: Record<string, T>,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const value of Object.values(obj)) {
    const k = String(value);
    result[k] = (result[k] ?? 0) + 1;
  }
  return result;
}
