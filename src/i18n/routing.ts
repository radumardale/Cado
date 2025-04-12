import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ro', 'ru'],
 
  // Used when no locale matches
  defaultLocale: 'ro',

  pathnames: {
    '/': '/',
    '/catalog': {
      ru: '/catalog',
      ro: '/catalog'
    },
    '/about-us': {
      ru: '/about-us',
      ro: '/despre-noi',
    },
    '/blogs': {
      ru: "/blog",
      ro: '/noutati'
    },
    '/blog/[id]': {
      ru: "/blog/[id]",
      ro: "/noutate/[id]"
    },
    '/terms': {
      ru: "/terms",
      ro: "/termeni-si-conditii"
    },
    '/contacts': {
      ru: "/contacts",
      ro: "/contacte"
    },
  '/catalog/product/[id]': {
      ru: '/catalog/product/[id]',
      ro: '/catalog/produs/[id]',
    },
    "/checkout": {
      ru: "/checkout",
      ro: "/achitare"
    }
  }
});

export type Pathnames = "/" | "/catalog" | "/about-us" | "/blogs" | "/terms" | "/contacts";