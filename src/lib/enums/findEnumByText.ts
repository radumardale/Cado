import { stripDiacritics } from '@/lib/utils/text';

/**
 * Matches free-text input against an enum's translated titles (ro/ru/en),
 * falling back to fuzzy substring matching when there's no exact match.
 */
export function findEnumByText<T extends string>(
  input: string,
  allValues: T[],
  translations: Record<T, { title: MultilingualString }>
): T[] {
  if (!input?.trim()) return allValues;

  const normalizedInput = stripDiacritics(input.trim());
  const matches: T[] = [];

  const enumValue = normalizedInput.toUpperCase().replace(/ /g, '_') as T;
  if (allValues.includes(enumValue)) {
    matches.push(enumValue);
  }

  const entries = Object.entries(translations) as [T, { title: MultilingualString }][];

  for (const [key, { title }] of entries) {
    for (const language of ['ro', 'ru', 'en'] as const) {
      if (title[language].toLowerCase() === normalizedInput && !matches.includes(key)) {
        matches.push(key);
      }
    }
  }

  if (matches.length === 0) {
    for (const [key, { title }] of entries) {
      for (const language of ['ro', 'ru', 'en'] as const) {
        const translatedTitle = title[language].toLowerCase();
        if (
          (translatedTitle.includes(normalizedInput) ||
            normalizedInput.includes(translatedTitle)) &&
          !matches.includes(key)
        ) {
          matches.push(key);
        }
      }
    }
  }

  return matches;
}
