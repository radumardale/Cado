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
    '/blog': {
      ru: "/blog",
      ro: '/noutati'
    },
    '/terms': {
      ru: "/terms",
      ro: "/termeni-si-conditii"
    },
    '/contacts': {
      ru: "/contacts",
      ro: "/contacte"
    }
  }
});

export type Pathnames = "/" | "/catalog" | "/about-us" | "/blog" | "/terms" | "/contacts";