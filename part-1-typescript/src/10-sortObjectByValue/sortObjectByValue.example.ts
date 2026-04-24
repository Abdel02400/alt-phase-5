import { sortObjectByValue } from './sortObjectByValue';

/**
 * Cas d'usage : Tri des scores de joueurs
 */
export function run(): void {
  const playerScores = {
    Alice: 85,
    Bob: 92,
    Charlie: 78,
    David: 95,
  };

  console.log(sortObjectByValue(playerScores));
  // { Charlie: 78, Alice: 85, Bob: 92, David: 95 }
}
