/**
 * Récupère toutes les valeurs d'un objet.
 */
export function getValues<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][];
}