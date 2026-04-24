import { findMaxValue } from './findMaxValue';

/**
 * Cas d'usage : Recherche du meilleur score dans un jeu
 */
export function run(): void {
  const gameScores = {
    level1: 850,
    level2: 920,
    level3: 880,
    level4: 1020,
  };

  console.log(findMaxValue(gameScores)); // 1020
}
