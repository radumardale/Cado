/**
 * Strips diacritics and lowercases text, for search normalization.
 */
export function stripDiacritics(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
