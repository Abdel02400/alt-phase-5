/**
 * Résumé statistique d'un objet de valeurs numériques.
 */
export interface ObjectStats {
  basic: {
    min: number;
    max: number;
    average: number;
    total: number;
  };
  advanced: {
    median: number;
    variance: number;
    standardDeviation: number;
  };
}

/**
 * Calcule min, max, moyenne, total, médiane, variance et écart-type
 * pour les valeurs d'un objet.
 *
 * Sur un objet vide, propagation naturelle des valeurs JS :
 * total = 0, min = +Infinity, max = -Infinity, les autres -> NaN.
 * À l'appelant de tester le cas limite s'il le souhaite.
 */
export function getObjectStats(obj: Record<string, number>): ObjectStats {
  const values = Object.values(obj);

  const total = values.reduce((acc, v) => acc + v, 0);
  const average = total / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

  const variance =
    values.reduce((acc, v) => acc + (v - average) ** 2, 0) / values.length;
  const standardDeviation = Math.round(Math.sqrt(variance) * 100) / 100;

  return {
    basic: { min, max, average, total },
    advanced: { median, variance, standardDeviation },
  };
}
