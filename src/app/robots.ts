import type { MetadataRoute } from 'next';

function getBaseUrl(): string {
  // First check for BASE_URL environment variable
  if (process.env.BASE_URL && process.env.BASE_URL !== '/') {
    return process.env.BASE_URL;
  }

  // Fallback to production or development URL
  return process.env.NODE_ENV === 'production' ? 'https://cado.md' : 'http://localhost:3000';
}

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = getBaseUrl();
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
        disallow: ['/admin/', '/api/', '/auth/', '/checkout/', '/confirmation/', '/payment-error/'],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/checkout/', '/confirmation/', '/payment-error/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
