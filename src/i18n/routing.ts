import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ro', 'ru', 'en'],

  // Used when no locale matches
  defaultLocale: 'ro',

  pathnames: {
    '/': '/',
    '/catalog': {
      en: '/catalog',
      ro: '/catalog',
      ru: '/katalog',
    },
    '/about-us': {
      en: '/about-us',
      ro: '/despre-noi',
      ru: '/o-kompanii',
    },
    '/blogs': {
      en: '/blogs',
      ro: '/noutati',
      ru: '/novosti',
    },
    '/blog/[id]': {
      en: '/blog/[id]',
      ro: '/articol/[id]',
      ru: '/statya/[id]',
    },
    '/terms': {
      en: '/terms',
      ro: '/termeni-si-conditii',
      ru: '/usloviya',
    },
    '/contacts': {
      en: '/contacts',
      ro: '/contacte',
      ru: '/kontakty',
    },
    '/confirmation/[id]': {
      en: '/confirmation/[id]',
      ro: '/confirmation/[id]',
      ru: '/podtverzhdenie/[id]',
    },
    '/catalog/product/[id]': {
      en: '/catalog/product/[id]',
      ro: '/catalog/produs/[id]',
      ru: '/katalog/tovar/[id]',
    },
    '/checkout': {
      en: '/checkout',
      ro: '/achitare',
      ru: '/oplata',
    },
    '/login': {
      en: '/login',
      ro: '/login',
      ru: '/vhod',
    },
    '/payment-error/[id]': {
      en: '/payment-error/[id]',
      ro: '/eroare-plata/[id]',
      ru: '/oshibka-oplaty/[id]',
    },
    '/admin/orders': {
      ru: '/admin/zakazy',
      ro: '/admin/comenzi',
      en: '/admin/orders',
    },
    '/admin/orders/[id]': {
      ru: '/admin/zakazy/[id]',
      ro: '/admin/comenzi/[id]',
      en: '/admin/orders/[id]',
    },
    '/admin/orders/new': {
      ru: '/admin/zakazy/novyy',
      ro: '/admin/comenzi/nou',
      en: '/admin/orders/new',
    },
    '/admin/products': {
      ru: '/admin/tovary',
      ro: '/admin/produse',
      en: '/admin/products',
    },
    '/admin/products/[id]': {
      ru: '/admin/tovary/[id]',
      ro: '/admin/produse/[id]',
      en: '/admin/products/[id]',
    },
    '/admin/products/new': {
      ru: '/admin/tovary/novyy',
      ro: '/admin/produse/nou',
      en: '/admin/products/new',
    },
    '/admin/client-data': {
      ru: '/admin/dannye-klientov',
      ro: '/admin/date-clienti',
      en: '/admin/client-data',
    },
    '/admin/home': {
      ru: '/admin/glavnaya',
      ro: '/admin/acasa',
      en: '/admin/home',
    },
    '/admin/blog': {
      ru: '/admin/blog',
      ro: '/admin/blog',
      en: '/admin/blog',
    },
    '/admin/blog/[id]': {
      ru: '/admin/blog/[id]',
      ro: '/admin/blog/[id]',
      en: '/admin/blog/[id]',
    },
    '/admin/blog/new': {
      ru: '/admin/blog/novyy',
      ro: '/admin/blog/nou',
      en: '/admin/blog/new',
    },
    '/admin/catalog-sezon': {
      ru: '/admin/katalog-sezon',
      ro: '/admin/catalog-sezon',
      en: '/admin/catalog-sezon',
    },
    '/admin/contact-details': {
      ru: '/admin/kontakty',
      ro: '/admin/contacte',
      en: '/admin/contact-details',
    },
  },
});

export type Pathnames =
  | '/'
  | '/catalog'
  | '/about-us'
  | '/blogs'
  | '/terms'
  | '/contacts'
  | '/catalog'
  | '/checkout'
  | '/login'
  | '/admin/orders'
  | '/admin/products'
  | '/admin/products/new'
  | '/admin/client-data'
  | '/admin/home'
  | '/admin/blog'
  | '/admin/blog/new'
  | '/admin/catalog-sezon'
  | '/admin/contact-details';
