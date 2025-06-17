import {defineRouting} from 'next-intl/routing';
 
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
      ru: '/каталог'
    },
    '/about-us': {
      en: '/about-us',
      ro: '/despre-noi',
      ru: '/о-компании'
    },
    '/blogs': {
      en: '/blogs',
      ro: '/noutati',
      ru: '/новости'
    },
    '/blog/[id]': {
      en: '/blog/[id]',
      ro: '/articol/[id]',
      ru: '/статья/[id]'
    },
    '/terms': {
      en: '/terms',
      ro: '/termeni-si-conditii',
      ru: '/условия'
    },
    '/contacts': {
      en: '/contacts',
      ro: '/contacte',
      ru: '/контакты'
    },
    '/confirmation/[id]': {
      en: '/confirmation/[id]',
      ro: '/confirmation/[id]',
      ru: '/подтверждение/[id]'
    },
    '/catalog/product/[id]': {
      en: '/catalog/product/[id]',
      ro: '/catalog/produs/[id]',
      ru: '/каталог/товар/[id]'
    },
    '/checkout': {
      en: '/checkout',
      ro: '/achitare',
      ru: '/оплата'
    },
    '/login': {
      en: '/login',
      ro: '/login',
      ru: '/вход'
    },
    '/payment-error/[id]': {
      en: '/payment-error/[id]',
      ro: '/eroare-plata/[id]',
      ru: '/ошибка-оплаты/[id]'
    },
    '/admin/orders': {
      ru: '/админ/заказы',
      ro: '/admin/comenzi',
      en: '/admin/orders'
    },
    '/admin/orders/[id]': {
      ru: '/админ/заказы/[id]',
      ro: '/admin/comenzi/[id]',
      en: '/admin/orders/[id]'
    },
    '/admin/orders/new': {
      ru: '/админ/заказы/новый',
      ro: '/admin/comenzi/nou',
      en: '/admin/orders/new'
    },
    '/admin/products': {
      ru: '/админ/товары',
      ro: '/admin/produse',
      en: '/admin/products'
    },
    '/admin/products/[id]': {
      ru: '/админ/товары/[id]',
      ro: '/admin/produse/[id]',
      en: '/admin/products/[id]'
    },
    '/admin/products/new': {
      ru: '/админ/товары/новый',
      ro: '/admin/produse/nou',
      en: '/admin/products/new'
    },
    '/admin/client-data': {
      ru: '/админ/данные-клиентов',
      ro: '/admin/date-clienti',
      en: '/admin/client-data'
    },
    '/admin/home': {
      ru: '/админ/главная',
      ro: '/admin/acasa',
      en: '/admin/home'
    },
    '/admin/blog': {
      ru: '/админ/блог',
      ro: '/admin/blog',
      en: '/admin/blog'
    },
    '/admin/blog/[id]': {
      ru: '/админ/блог/[id]',
      ro: '/admin/blog/[id]',
      en: '/admin/blog/[id]'
    },
    '/admin/blog/new': {
      ru: '/админ/блог/новый',
      ro: '/admin/blog/nou',
      en: '/admin/blog/new'
    },
    '/admin/catalog-sezon': {
      ru: '/админ/каталог-сезон',
      ro: '/admin/catalog-sezon',
      en: '/admin/catalog-sezon'
    },
    '/admin/contact-details': {
      ru: '/админ/контакты',
      ro: '/admin/contacte',
      en: '/admin/contact-details'
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
| "/admin/client-data"
| "/admin/home"
| "/admin/blog"
| "/admin/blog/new"
| "/admin/catalog-sezon"
| "/admin/contact-details";