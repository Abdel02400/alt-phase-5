/**
 * Représente une différence détectée entre deux objets pour une clé donnée.
 */
export type DiffEntry =
  | { type: 'added'; new: unknown }
  | { type: 'removed'; old: unknown }
  | { type: 'modified'; old: unknown; new: unknown };

/**
 * Compare deux objets (shallow) et retourne les différences par clé.
 * - 'added'    : clé absente de oldObj, présente dans newObj
 * - 'removed'  : clé présente dans oldObj, absente de newObj
 * - 'modified' : valeurs différentes (comparaison ===)
 * Les clés dont la valeur est identique ne sont pas présentes dans le résultat.
 */
export function compareDifferences(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>,
): Record<string, DiffEntry> {
  const diff: Record<string, DiffEntry> = {};
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  for (const key of allKeys) {
    const hasOld = key in oldObj;
    const hasNew = key in newObj;

    if (hasOld && !hasNew) {
      diff[key] = { type: 'removed', old: oldObj[key] };
    } else if (!hasOld && hasNew) {
      diff[key] = { type: 'added', new: newObj[key] };
    } else if (oldObj[key] !== newObj[key]) {
      diff[key] = { type: 'modified', old: oldObj[key], new: newObj[key] };
    }
  }
  return diff;
}
