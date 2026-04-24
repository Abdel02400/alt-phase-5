import { createObjectFromArrays } from './createObjectFromArrays';

/**
 * Cas d'usage : Création d'un objet de scores à partir de noms de joueurs
 *               et leurs points
 */
export function run(): void {
  const playerNames = ['Alice', 'Bob', 'Charlie'];
  const scores = [100, 85, 90];

  console.log(createObjectFromArrays(playerNames, scores));
  // { Alice: 100, Bob: 85, Charlie: 90 }
}
