import { getObjectStats } from './getObjectStats';

/**
 * Cas d'usage : Analyse des ventes mensuelles
 */
export function run(): void {
  const monthlyRevenues = {
    january: 1000,
    february: 1200,
    march: 900,
    april: 1500,
  };

  console.log(getObjectStats(monthlyRevenues));
  // {
  //   basic:    { min: 900, max: 1500, average: 1150, total: 4600 },
  //   advanced: { median: 1100, variance: 52500, standardDeviation: 229.13 }
  // }
}
