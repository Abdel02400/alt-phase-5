/**
 * Extrait un sous-ensemble des propriétés d'un objet (équivalent au Pick
 * de Lodash).
 *
 * Le type de retour est `Partial<Pick<T, K>>` : la fonction ignore les
 * clés absentes de l'objet (via `key in obj`), donc certaines propriétés
 * peuvent manquer dans le résultat — Partial l'exprime correctement.
 */
export function extractProperties<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Partial<Pick<T, K>> {
  const result: Partial<Pick<T, K>> = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
