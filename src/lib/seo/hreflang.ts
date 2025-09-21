import { routing } from '@/i18n/routing';

type Locale = 'ro' | 'ru' | 'en';

interface HreflangLink {
  locale: string;
  url: string;
}

function getBaseUrl(): string {
  if (process.env.BASE_URL && process.env.BASE_URL !== '/') {
    // Remove trailing slash(es) and trim whitespace
    return process.env.BASE_URL.trim().replace(/\/+$/, '');
  }
  return process.env.NODE_ENV === 'production' ? 'https://cado.md' : 'http://localhost:3000';
}

export function generateHreflangLinks(
  pathname: string,
  currentLocale: Locale,
  params?: Record<string, string>
): HreflangLink[] {
  const baseUrl = getBaseUrl();
  const links: HreflangLink[] = [];

  // The pathname is already clean (e.g., '/catalog/product/[id]')
  // No need to remove locale as it's not included
  const pathWithoutLocale = pathname;

  const routeKey = Object.keys(routing.pathnames).find(key => {
    // For exact root path matching
    if (key === '/' && pathWithoutLocale === '/') {
      return true;
    }

    // Skip root path for other routes
    if (key === '/' && pathWithoutLocale !== '/') {
      return false;
    }

    // For exact match (including dynamic segments as literal strings)
    if (pathWithoutLocale === key) {
      return true;
    }

    // For parameterized routes with actual param values
    if (key.includes('[') && params) {
      // Replace placeholders with actual values
      let pattern = key;
      Object.entries(params).forEach(([paramKey, value]) => {
        pattern = pattern.replace(`[${paramKey}]`, value);
      });

      if (pathWithoutLocale === pattern) {
        return true;
      }
    }

    return false;
  });

  if (routeKey && routing.pathnames[routeKey as keyof typeof routing.pathnames]) {
    const routeConfig = routing.pathnames[routeKey as keyof typeof routing.pathnames];

    if (typeof routeConfig === 'string') {
      routing.locales.forEach(locale => {
        links.push({
          locale,
          url: `${baseUrl}/${locale}${routeConfig}`,
        });
      });
    } else {
      routing.locales.forEach(locale => {
        let localizedPath = routeConfig[locale as Locale] as string;

        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            localizedPath = localizedPath.replace(`[${key}]`, value);
          });
        }

        links.push({
          locale,
          url: `${baseUrl}/${locale}${localizedPath}`,
        });
      });
    }
  } else {
    routing.locales.forEach(locale => {
      let localizedPath = pathWithoutLocale;

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          localizedPath = localizedPath.replace(`[${key}]`, value);
        });
      }

      links.push({
        locale,
        url: `${baseUrl}/${locale}${localizedPath}`,
      });
    });
  }

  const defaultUrl = links.find(link => link.locale === 'ro')?.url || links[0].url;
  links.push({
    locale: 'x-default',
    url: defaultUrl,
  });

  return links;
}

export function generateHreflangLinksWithQuery(
  pathname: string,
  currentLocale: Locale,
  params?: Record<string, string>,
  searchParams?: URLSearchParams
): HreflangLink[] {
  const links = generateHreflangLinks(pathname, currentLocale, params);

  if (searchParams && searchParams.toString()) {
    return links.map(link => ({
      ...link,
      url: `${link.url}?${searchParams.toString()}`,
    }));
  }

  return links;
}
