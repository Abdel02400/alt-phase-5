/**
 * Retourne la valeur maximale parmi les valeurs numériques d'un objet.
 * Sur un objet vide, Math.max(...[]) renvoie -Infinity (comportement JS natif).
 */
export function findMaxValue(obj: Record<string, number>): number {
  return Math.max(...Object.values(obj));
}
