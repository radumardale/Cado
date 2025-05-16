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
    '/confirmation/[id]': {
      ru: "/confirmation/[id]",
      ro: "/confirmation/[id]"
    },
  '/catalog/product/[id]': {
      ru: '/catalog/product/[id]',
      ro: '/catalog/produs/[id]',
    },
    "/checkout": {
      ru: "/checkout",
      ro: "/achitare"
    },
    '/login': {
      ru: '/login',
      ro: '/login'
    },
    '/admin/orders': {
      ru: '/admin/orders',
      ro: '/admin/orders'
    },
    '/admin/orders/[id]': {
      ru: '/admin/orders/[id]',
      ro: '/admin/orders/[id]'
    },
    '/admin/orders/new': {
      ru: '/admin/orders/new',
      ro: '/admin/orders/new'
    },
    '/admin/products': {
      ru: '/admin/products',
      ro: '/admin/products'
    },
    '/admin/products/[id]': {
      ru: '/admin/products/[id]',
      ro: '/admin/products/[id]'
    },
    '/admin/products/new': {
      ru: '/admin/products/new',
      ro: '/admin/products/new'
    },
    '/admin/clients': {
      ru: '/admin/clients',
      ro: '/admin/clients'
    },
    '/admin/home-page': {
      ru: '/admin/home-page',
      ro: '/admin/home-page'
    },
    '/admin/blog-page': {
      ru: '/admin/blog-page',
      ro: '/admin/blog-page'
    },
    '/admin/catalog-sezon': {
      ru: '/admin/catalog-sezon',
      ro: '/admin/catalog-sezon'
    },
    '/admin/contact-details': {
      ru: '/admin/contact-details',
      ro: '/admin/contact-details'
    },
  }
});

export type Pathnames = 
"/" 
| "/catalog" 
| "/about-us" 
| "/blogs" 
| "/terms" 
| "/contacts"
| "/catalog"
| "/checkout"
| "/login"
| "/admin/orders"
| "/admin/products"
| "/admin/products/new"
| "/admin/clients"
| "/admin/home-page"
| "/admin/blog-page"
| "/admin/catalog-sezon"
| "/admin/contact-details";