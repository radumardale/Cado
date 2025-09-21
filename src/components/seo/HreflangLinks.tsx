import { generateHreflangLinks } from '@/lib/seo/hreflang';

interface HreflangLinksProps {
  pathname: string;
  locale: 'ro' | 'ru' | 'en';
  params?: Record<string, string>;
}

export function generateHreflangMetadata({ pathname, locale, params }: HreflangLinksProps) {
  const hreflangLinks = generateHreflangLinks(pathname, locale, params);

  const languages: Record<string, string> = {};

  hreflangLinks.forEach(link => {
    if (link.locale !== 'x-default') {
      languages[link.locale] = link.url;
    }
  });

  const canonical = hreflangLinks.find(link => link.locale === locale)?.url;
  const xDefault = hreflangLinks.find(link => link.locale === 'x-default')?.url;

  return {
    alternates: {
      canonical,
      languages: {
        ...languages,
        'x-default': xDefault
      }
    }
  };
}