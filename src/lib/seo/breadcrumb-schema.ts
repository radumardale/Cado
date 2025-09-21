import { Categories, categoryTranslations } from '@/lib/enums/Categories';
import { Ocasions, ocasionTranslations } from '@/lib/enums/Ocasions';

export interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

export interface BreadcrumbListSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

export interface BreadcrumbConfig {
  locale: string;
  baseUrl: string;
  category?: Categories;
  ocasion?: Ocasions;
  productTitle?: string;
  productId?: string;
  sortBy?: string;
}

/**
 * Generates BreadcrumbList JSON-LD schema for different page types
 */
export function generateBreadcrumbSchema(config: BreadcrumbConfig): BreadcrumbListSchema {
  const { locale, category, ocasion, productTitle, productId, sortBy } = config;
  // Normalize baseUrl by removing trailing slashes to prevent double slashes in URLs
  const baseUrl = config.baseUrl.replace(/\/+$/, '');

  const breadcrumbItems: BreadcrumbItem[] = [];
  let position = 1;

  // Home page
  breadcrumbItems.push({
    '@type': 'ListItem',
    position: position++,
    name: getLocalizedText('home', locale),
    item: `${baseUrl}/${locale}`,
  });

  // Catalog page
  const catalogPath = getLocalizedPath('catalog', locale);
  let catalogUrl = `${baseUrl}/${locale}${catalogPath}`;

  // Add query parameters if they exist
  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  if (ocasion) queryParams.append('ocasions', ocasion);
  if (sortBy) queryParams.append('sort_by', sortBy);

  if (queryParams.toString()) {
    catalogUrl += `?${queryParams.toString()}`;
  }

  breadcrumbItems.push({
    '@type': 'ListItem',
    position: position++,
    name: getLocalizedText('catalog', locale),
    item: catalogUrl,
  });

  // Category or Ocasion breadcrumb
  if (category) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: position++,
      name: categoryTranslations[category]?.title[locale as 'ro' | 'ru' | 'en'] || category,
      item: catalogUrl,
    });
  } else if (ocasion) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: position++,
      name: ocasionTranslations[ocasion]?.title[locale as 'ro' | 'ru' | 'en'] || ocasion,
      item: catalogUrl,
    });
  }

  // Product page (final item without URL)
  if (productTitle && productId) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: position++,
      name: productTitle,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };
}

/**
 * Get localized path for different page types
 */
function getLocalizedPath(page: string, locale: string): string {
  const pathMappings: Record<string, Record<string, string>> = {
    catalog: {
      en: '/catalog',
      ro: '/catalog',
      ru: '/katalog',
    },
  };

  return pathMappings[page]?.[locale] || `/${page}`;
}

/**
 * Get localized text for common navigation items
 */
function getLocalizedText(key: string, locale: string): string {
  const translations: Record<string, Record<string, string>> = {
    home: {
      en: 'Home',
      ro: 'Acasă',
      ru: 'Главная',
    },
    catalog: {
      en: 'Catalog',
      ro: 'Catalog',
      ru: 'Каталог',
    },
  };

  return translations[key]?.[locale] || key;
}

/**
 * Generate breadcrumb schema for homepage
 */
export function generateHomeBreadcrumbSchema(
  baseUrl: string,
  locale: string
): BreadcrumbListSchema {
  // Normalize baseUrl by removing trailing slashes
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: getLocalizedText('home', locale),
        item: `${normalizedBaseUrl}/${locale}`,
      },
    ],
  };
}

/**
 * Generate breadcrumb schema for catalog pages
 */
export function generateCatalogBreadcrumbSchema(
  baseUrl: string,
  locale: string,
  filters?: {
    category?: Categories;
    ocasion?: Ocasions;
    sortBy?: string;
  }
): BreadcrumbListSchema {
  return generateBreadcrumbSchema({
    locale,
    baseUrl,
    category: filters?.category,
    ocasion: filters?.ocasion,
    sortBy: filters?.sortBy,
  });
}

/**
 * Generate breadcrumb schema for product pages
 */
export function generateProductBreadcrumbSchema(
  baseUrl: string,
  locale: string,
  productTitle: string,
  productId: string,
  category?: Categories,
  ocasion?: Ocasions
): BreadcrumbListSchema {
  return generateBreadcrumbSchema({
    locale,
    baseUrl,
    category,
    ocasion,
    productTitle,
    productId,
  });
}
