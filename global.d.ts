import { routing } from '@/i18n/routing';
import { formats } from '@/i18n/request';
import messages from './messages/en.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}

declare global {
  /**
   * Core multilingual type for required text in all supported languages.
   * Used throughout the application for product info, category names, etc.
   */
  type MultilingualString = {
    ro: string;
    ru: string;
    en: string;
  };

  /**
   * Optional multilingual type for text that may not be required in all languages.
   * Used for optional product details like material, color descriptions, etc.
   */
  type OptionalMultilingualString = {
    ro?: string;
    ru?: string;
    en?: string;
  };

  /**
   * Type-safe locale code for dynamic locale access.
   * Ensures only valid locale codes are used when accessing multilingual data.
   */
  type LocaleCode = 'ro' | 'ru' | 'en';

  /**
   * Common response type for server actions and tRPC procedures.
   * Standardizes success/error handling across the application.
   */
  interface ActionResponse<T = unknown> {
    success: boolean;
    error?: string;
    data?: T;
  }
}

export {};
