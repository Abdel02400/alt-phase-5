/**
 * Vérifie qu'une valeur est un objet indexable (objet ou tableau non-null).
 * Permet à TypeScript de narrower vers `Record<string, unknown>`, ce qui
 * donne à `Object.entries` un retour propre `[string, unknown][]`.
 */
function isIndexable(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/**
 * Recherche récursive (DFS) d'une valeur dans un objet potentiellement
 * imbriqué. Retourne le chemin (suite de clés) pour atteindre la valeur,
 * ou null si elle n'est pas trouvée.
 */
export function findValueInObject(
  obj: unknown,
  target: unknown,
): string[] | null {
  function search(current: unknown, path: string[]): string[] | null {
    if (current === target) return path;
    if (!isIndexable(current)) return null;

    for (const [key, value] of Object.entries(current)) {
      const found = search(value, [...path, key]);
      if (found !== null) return found;
    }
    return null;
  }

  return search(obj, []);
}
