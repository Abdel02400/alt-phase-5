/**
 * Fusionne deux objets en additionnant les valeurs des clés communes.
 * Les clés présentes dans un seul objet sont simplement copiées.
 */
export function mergeObjects(
  a: Record<string, number>,
  b: Record<string, number>,
): Record<string, number> {
  const result: Record<string, number> = { ...a };
  for (const key of Object.keys(b)) {
    result[key] = (result[key] ?? 0) + b[key];
  }
  return result;
}
