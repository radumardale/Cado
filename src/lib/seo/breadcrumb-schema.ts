import { Categories } from '@/lib/enums/Categories';
import { Ocasions } from '@/lib/enums/Ocasions';

export interface BreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item?: string;
}

export interface BreadcrumbListSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
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
  const { locale, baseUrl, category, ocasion, productTitle, productId, sortBy } = config;

  const breadcrumbItems: BreadcrumbItem[] = [];
  let position = 1;

  // Home page
  breadcrumbItems.push({
    "@type": "ListItem",
    position: position++,
    name: getLocalizedText("home", locale),
    item: `${baseUrl}/${locale}`
  });

  // Catalog page
  const catalogPath = getLocalizedPath("catalog", locale);
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
    "@type": "ListItem",
    position: position++,
    name: getLocalizedText("catalog", locale),
    item: catalogUrl
  });

  // Category or Ocasion breadcrumb
  if (category) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: position++,
      name: getCategoryLocalizedName(category, locale),
      item: catalogUrl
    });
  } else if (ocasion) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: position++,
      name: getOcasionLocalizedName(ocasion, locale),
      item: catalogUrl
    });
  }

  // Product page (final item without URL)
  if (productTitle && productId) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: position++,
      name: productTitle
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems
  };
}

/**
 * Get localized path for different page types
 */
function getLocalizedPath(page: string, locale: string): string {
  const pathMappings: Record<string, Record<string, string>> = {
    catalog: {
      en: "/catalog",
      ro: "/catalog",
      ru: "/katalog"
    }
  };

  return pathMappings[page]?.[locale] || `/${page}`;
}

/**
 * Get localized text for common navigation items
 */
function getLocalizedText(key: string, locale: string): string {
  const translations: Record<string, Record<string, string>> = {
    home: {
      en: "Home",
      ro: "Acasă",
      ru: "Главная"
    },
    catalog: {
      en: "Catalog",
      ro: "Catalog",
      ru: "Каталог"
    }
  };

  return translations[key]?.[locale] || key;
}

/**
 * Get localized category name
 */
function getCategoryLocalizedName(category: Categories, locale: string): string {
  // Category translations mapping - using correct Categories enum values
  const categoryTranslations: Record<Categories, Record<string, string>> = {
    [Categories.FOR_HER]: {
      en: "For Her",
      ro: "Pentru Ea",
      ru: "Для Нее"
    },
    [Categories.FOR_HIM]: {
      en: "For Him",
      ro: "Pentru El",
      ru: "Для Него"
    },
    [Categories.FOR_KIDS]: {
      en: "For Kids",
      ro: "Pentru Copii",
      ru: "Для Детей"
    },
    [Categories.ACCESSORIES]: {
      en: "Accessories",
      ro: "Accesorii",
      ru: "Аксессуары"
    },
    [Categories.FLOWERS_AND_BALLOONS]: {
      en: "Flowers & Balloons",
      ro: "Flori & Baloane",
      ru: "Цветы и Шары"
    },
    [Categories.GIFT_SET]: {
      en: "Gift Sets",
      ro: "Seturi cadou",
      ru: "Подарочные наборы"
    }
  };

  return categoryTranslations[category]?.[locale] || category;
}

/**
 * Get localized ocasion name
 */
function getOcasionLocalizedName(ocasion: Ocasions, locale: string): string {
  // Ocasion translations mapping
  const ocasionTranslations: Record<Ocasions, Record<string, string>> = {
    [Ocasions.CASUAL]: {
      en: "Casual",
      ro: "Casual",
      ru: "Повседневный"
    },
    [Ocasions.ELEGANT]: {
      en: "Elegant",
      ro: "Elegant",
      ru: "Элегантный"
    },
    [Ocasions.SPORT]: {
      en: "Sport",
      ro: "Sport",
      ru: "Спорт"
    },
    [Ocasions.BUSINESS]: {
      en: "Business",
      ro: "Business",
      ru: "Деловой"
    }
  };

  return ocasionTranslations[ocasion]?.[locale] || ocasion;
}

/**
 * Generate breadcrumb schema for homepage
 */
export function generateHomeBreadcrumbSchema(baseUrl: string, locale: string): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: getLocalizedText("home", locale),
        item: `${baseUrl}/${locale}`
      }
    ]
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
    sortBy: filters?.sortBy
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
    productId
  });
}