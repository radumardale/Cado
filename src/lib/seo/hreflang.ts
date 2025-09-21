import { routing } from '@/i18n/routing';

type Locale = 'ro' | 'ru' | 'en';

interface HreflangLink {
  locale: string;
  url: string;
}

function getBaseUrl(): string {
  if (process.env.BASE_URL && process.env.BASE_URL !== '/') {
    return process.env.BASE_URL;
  }
  return process.env.NODE_ENV === 'production'
    ? 'https://cado.md'
    : 'http://localhost:3000';
}

export function generateHreflangLinks(
  pathname: string,
  currentLocale: Locale,
  params?: Record<string, string>
): HreflangLink[] {
  const baseUrl = getBaseUrl();
  const links: HreflangLink[] = [];

  const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, '');

  const routeKey = Object.keys(routing.pathnames).find(key => {
    const pattern = key.replace(/\[([^\]]+)\]/g, (_, param) => {
      return params?.[param] || `[${param}]`;
    });
    return pathWithoutLocale === pattern || pathWithoutLocale.startsWith(pattern.split('[')[0]);
  });

  if (routeKey && routing.pathnames[routeKey as keyof typeof routing.pathnames]) {
    const routeConfig = routing.pathnames[routeKey as keyof typeof routing.pathnames];

    if (typeof routeConfig === 'string') {
      routing.locales.forEach(locale => {
        links.push({
          locale,
          url: `${baseUrl}/${locale}${routeConfig}`
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
          url: `${baseUrl}/${locale}${localizedPath}`
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
        url: `${baseUrl}/${locale}${localizedPath}`
      });
    });
  }

  const defaultUrl = links.find(link => link.locale === 'ro')?.url || links[0].url;
  links.push({
    locale: 'x-default',
    url: defaultUrl
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
      url: `${link.url}?${searchParams.toString()}`
    }));
  }

  return links;
}