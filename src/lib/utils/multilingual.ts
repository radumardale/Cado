/**
 * Utility functions for working with multilingual types.
 * Provides runtime validation and helper functions for MultilingualString.
 */

/**
 * Type guard to check if a value is a valid MultilingualString.
 * Validates that all three required language fields are present and are strings.
 *
 * @param value - The value to check
 * @returns True if value is a valid MultilingualString
 *
 * @example
 * ```ts
 * const data = { ro: 'Bună', ru: 'Привет', en: 'Hello' };
 * if (isMultilingualString(data)) {
 *   // TypeScript now knows data has ro, ru, en fields
 *   console.log(data.ro);
 * }
 * ```
 */
export function isMultilingualString(value: unknown): value is MultilingualString {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return typeof obj.ro === 'string' && typeof obj.ru === 'string' && typeof obj.en === 'string';
}

/**
 * Type guard to check if a value is a valid OptionalMultilingualString.
 * Validates that the object has the correct structure with optional string fields.
 *
 * @param value - The value to check
 * @returns True if value is a valid OptionalMultilingualString
 *
 * @example
 * ```ts
 * const data = { ro: 'Text', en: undefined };
 * if (isOptionalMultilingualString(data)) {
 *   // TypeScript knows this is OptionalMultilingualString
 *   console.log(data.ro ?? 'fallback');
 * }
 * ```
 */
export function isOptionalMultilingualString(value: unknown): value is OptionalMultilingualString {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    (obj.ro === undefined || typeof obj.ro === 'string') &&
    (obj.ru === undefined || typeof obj.ru === 'string') &&
    (obj.en === undefined || typeof obj.en === 'string')
  );
}

/**
 * Helper function to create a MultilingualString with the same text in all languages.
 * Useful for testing or default values.
 *
 * @param text - The text to use for all languages
 * @returns A MultilingualString with the same text in all languages
 *
 * @example
 * ```ts
 * const greeting = createMultilingualString('Hello');
 * // Returns: { ro: 'Hello', ru: 'Hello', en: 'Hello' }
 * ```
 */
export function createMultilingualString(text: string): MultilingualString {
  return {
    ro: text,
    ru: text,
    en: text,
  };
}

/**
 * Helper function to create an empty MultilingualString.
 * All language fields are set to empty strings.
 *
 * @returns An empty MultilingualString
 *
 * @example
 * ```ts
 * const emptyText = createEmptyMultilingualString();
 * // Returns: { ro: '', ru: '', en: '' }
 * ```
 */
export function createEmptyMultilingualString(): MultilingualString {
  return {
    ro: '',
    ru: '',
    en: '',
  };
}

/**
 * Get the text for a specific locale from a MultilingualString.
 * Type-safe accessor with fallback support.
 *
 * @param multilingualString - The multilingual string object
 * @param locale - The locale code ('ro' | 'ru' | 'en')
 * @param fallbackLocale - Optional fallback locale if requested locale is empty
 * @returns The text in the requested locale, or fallback locale, or empty string
 *
 * @example
 * ```ts
 * const text = { ro: 'Salut', ru: '', en: 'Hello' };
 * getLocalizedText(text, 'ru', 'en'); // Returns: 'Hello' (fallback)
 * getLocalizedText(text, 'ro'); // Returns: 'Salut'
 * ```
 */
export function getLocalizedText(
  multilingualString: MultilingualString,
  locale: LocaleCode,
  fallbackLocale?: LocaleCode
): string {
  const text = multilingualString[locale];

  if (text && text.trim() !== '') {
    return text;
  }

  if (fallbackLocale) {
    const fallbackText = multilingualString[fallbackLocale];
    if (fallbackText && fallbackText.trim() !== '') {
      return fallbackText;
    }
  }

  return '';
}

/**
 * Check if a MultilingualString has text in all languages.
 * Useful for validation to ensure content is complete.
 *
 * @param multilingualString - The multilingual string to check
 * @returns True if all language fields have non-empty text
 *
 * @example
 * ```ts
 * const complete = { ro: 'Text', ru: 'Текст', en: 'Text' };
 * const incomplete = { ro: 'Text', ru: '', en: 'Text' };
 * isComplete(complete); // true
 * isComplete(incomplete); // false
 * ```
 */
export function isComplete(multilingualString: MultilingualString): boolean {
  return (
    multilingualString.ro.trim() !== '' &&
    multilingualString.ru.trim() !== '' &&
    multilingualString.en.trim() !== ''
  );
}

/**
 * Map a function over all language fields in a MultilingualString.
 * Useful for transformations like normalization or formatting.
 *
 * @param multilingualString - The multilingual string to transform
 * @param fn - The transformation function to apply to each language
 * @returns A new MultilingualString with transformed text
 *
 * @example
 * ```ts
 * const text = { ro: 'HELLO', ru: 'ПРИВЕТ', en: 'HELLO' };
 * const lower = mapMultilingualString(text, s => s.toLowerCase());
 * // Returns: { ro: 'hello', ru: 'привет', en: 'hello' }
 * ```
 */
export function mapMultilingualString(
  multilingualString: MultilingualString,
  fn: (text: string, locale: LocaleCode) => string
): MultilingualString {
  return {
    ro: fn(multilingualString.ro, 'ro'),
    ru: fn(multilingualString.ru, 'ru'),
    en: fn(multilingualString.en, 'en'),
  };
}
