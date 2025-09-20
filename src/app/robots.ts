import type { MetadataRoute } from 'next';

const BASE_URL = process.env.BASE_URL || (process.env.NODE_ENV === 'production'
  ? 'https://cado.md'
  : 'http://localhost:3000');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/paynet-callback/',
          '/auth/',
          '/login/',
          '/checkout/',
          '/confirmation/',
          '/payment-error/',
        ],
      },
      // Specific rules for search engines
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/checkout/',
          '/confirmation/',
          '/payment-error/',
        ],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/checkout/',
          '/confirmation/',
          '/payment-error/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}