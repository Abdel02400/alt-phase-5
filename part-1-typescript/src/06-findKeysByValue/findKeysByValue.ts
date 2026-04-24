/**
 * Retourne la liste des clés d'un objet dont la valeur est strictement
 * égale à la cible (comparaison ===).
 */
export function findKeysByValue<T>(
  obj: Record<string, T>,
  target: T,
): string[] {
  return Object.keys(obj).filter((key) => obj[key] === target);
}
