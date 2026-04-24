/**
 * Types primitifs acceptés dans un schéma de validation.
 */
export type SchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array';
export type Schema = Record<string, SchemaType>;

/**
 * Vérifie que chaque propriété du schéma est présente dans l'objet avec
 * le type attendu. Toutes les clés du schéma sont requises.
 * Les clés en trop dans l'objet sont ignorées.
 */
export function validateObject(
  obj: Record<string, unknown>,
  schema: Schema,
): boolean {
  for (const key of Object.keys(schema)) {
    const expected = schema[key];
    const value = obj[key];

    if (value === undefined) return false;

    if (expected === 'array') {
      if (!Array.isArray(value)) return false;
    } else if (expected === 'object') {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
      }
    } else if (typeof value !== expected) {
      return false;
    }
  }
  return true;
}
