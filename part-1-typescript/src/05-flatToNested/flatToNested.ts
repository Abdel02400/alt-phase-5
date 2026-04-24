/**
 * Objet imbriqué générique : chaque clé peut contenir une valeur ou un sous-objet.
 */
export type NestedObject = { [key: string]: unknown };

/**
 * Convertit un objet plat en objet imbriqué en utilisant le point
 * comme séparateur de chemin (ex: "app.name" -> { app: { name: ... } }).
 *
 * Si un segment intermédiaire n'existe pas ou n'est pas un objet, il est créé.
 */
export function flatToNested(flat: Record<string, unknown>): NestedObject {
  const result: NestedObject = {};

  for (const key of Object.keys(flat)) {
    const parts = key.split('.');
    let current: NestedObject = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof current[part] !== 'object' || current[part] === null) {
        current[part] = {};
      }
      current = current[part] as NestedObject;
    }

    current[parts[parts.length - 1]] = flat[key];
  }

  return result;
}
