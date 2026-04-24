/**
 * Récupère toutes les valeurs d'un objet.
 */
export function getValues<V>(obj: Record<string, V>): V[] {
  return Object.values(obj);
}
