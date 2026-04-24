/**
 * Sérialise un objet en query string URL-encodée (RFC 3986 : espaces en %20).
 * Préfère encodeURIComponent à URLSearchParams pour obtenir %20 et non +.
 */
export function objectToUrlParams(
  obj: Record<string, string | number | boolean>,
): string {
  return Object.keys(obj)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(obj[key]))}`,
    )
    .join('&');
}
