import { getValues } from './getValues';

/**
 * Cas d'usage : Récupération des scores d'un joueur
 */
export function run(): void {
  const scores = {
    level1: 100,
    level2: 85,
    level3: 95,
  };

  console.log(getValues(scores)); // [100, 85, 95]
}
