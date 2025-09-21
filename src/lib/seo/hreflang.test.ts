import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateHreflangLinks, generateHreflangLinksWithQuery } from './hreflang';

// Mock the routing module
vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['ro', 'ru', 'en'],
    defaultLocale: 'ro',
    pathnames: {
      '/': '/',
      '/catalog': {
        en: '/catalog',
        ro: '/catalog',
        ru: '/katalog'
      },
      '/about-us': {
        en: '/about-us',
        ro: '/despre-noi',
        ru: '/o-kompanii'
      },
      '/blogs': {
        en: '/blogs',
        ro: '/noutati',
        ru: '/novosti'
      },
      '/blog/[id]': {
        en: '/blog/[id]',
        ro: '/articol/[id]',
        ru: '/statya/[id]'
      },
      '/catalog/product/[id]': {
        en: '/catalog/product/[id]',
        ro: '/catalog/produs/[id]',
        ru: '/katalog/tovar/[id]'
      },
      '/confirmation/[id]': {
        en: '/confirmation/[id]',
        ro: '/confirmation/[id]',
        ru: '/podtverzhdenie/[id]'
      },
      '/terms': {
        en: '/terms',
        ro: '/termeni-si-conditii',
        ru: '/usloviya'
      },
      '/contacts': {
        en: '/contacts',
        ro: '/contacte',
        ru: '/kontakty'
      }
    }
  }
}));

describe('hreflang.ts', () => {
  // Store original env values
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset env for each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe('getBaseUrl()', () => {
    test('should return BASE_URL when set and not "/"', () => {
      process.env.BASE_URL = 'https://example.com';
      process.env.NODE_ENV = 'test';

      const links = generateHreflangLinks('/', 'ro');
      expect(links[0].url).toContain('https://example.com');
    });

    test('should ignore BASE_URL when it is "/"', () => {
      process.env.BASE_URL = '/';
      process.env.NODE_ENV = 'development';

      const links = generateHreflangLinks('/', 'ro');
      expect(links[0].url).toContain('http://localhost:3000');
    });

    test('should return production URL when NODE_ENV is production', () => {
      delete process.env.BASE_URL;
      process.env.NODE_ENV = 'production';

      const links = generateHreflangLinks('/', 'ro');
      expect(links[0].url).toContain('https://cado.md');
    });

    test('should return localhost URL when NODE_ENV is not production', () => {
      delete process.env.BASE_URL;
      process.env.NODE_ENV = 'development';

      const links = generateHreflangLinks('/', 'ro');
      expect(links[0].url).toContain('http://localhost:3000');
    });

    test('should handle undefined environment variables', () => {
      delete process.env.BASE_URL;
      delete process.env.NODE_ENV;

      const links = generateHreflangLinks('/', 'ro');
      expect(links[0].url).toContain('http://localhost:3000');
    });
  });

  describe('generateHreflangLinks()', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
      process.env.BASE_URL = 'https://test.com';
    });

    describe('Root Path', () => {
      test('should generate correct links for root path', () => {
        const links = generateHreflangLinks('/', 'ro');

        expect(links).toHaveLength(4); // 3 locales + x-default
        expect(links).toEqual([
          { locale: 'ro', url: 'https://test.com/ro/' },
          { locale: 'ru', url: 'https://test.com/ru/' },
          { locale: 'en', url: 'https://test.com/en/' },
          { locale: 'x-default', url: 'https://test.com/ro/' }
        ]);
      });

      test('should set x-default to Romanian version', () => {
        const links = generateHreflangLinks('/', 'en');
        const xDefault = links.find(link => link.locale === 'x-default');
        const roLink = links.find(link => link.locale === 'ro');

        expect(xDefault?.url).toBe(roLink?.url);
      });
    });

    describe('Static Routes', () => {
      test('should handle routes with single string config correctly', () => {
        const links = generateHreflangLinks('/', 'ro');

        expect(links).toEqual([
          { locale: 'ro', url: 'https://test.com/ro/' },
          { locale: 'ru', url: 'https://test.com/ru/' },
          { locale: 'en', url: 'https://test.com/en/' },
          { locale: 'x-default', url: 'https://test.com/ro/' }
        ]);
      });
    });

    describe('Localized Routes', () => {
      test.each([
        {
          pathname: '/catalog',
          expected: {
            ro: 'https://test.com/ro/catalog',
            ru: 'https://test.com/ru/katalog',
            en: 'https://test.com/en/catalog'
          }
        },
        {
          pathname: '/about-us',
          expected: {
            ro: 'https://test.com/ro/despre-noi',
            ru: 'https://test.com/ru/o-kompanii',
            en: 'https://test.com/en/about-us'
          }
        },
        {
          pathname: '/blogs',
          expected: {
            ro: 'https://test.com/ro/noutati',
            ru: 'https://test.com/ru/novosti',
            en: 'https://test.com/en/blogs'
          }
        },
        {
          pathname: '/contacts',
          expected: {
            ro: 'https://test.com/ro/contacte',
            ru: 'https://test.com/ru/kontakty',
            en: 'https://test.com/en/contacts'
          }
        },
        {
          pathname: '/terms',
          expected: {
            ro: 'https://test.com/ro/termeni-si-conditii',
            ru: 'https://test.com/ru/usloviya',
            en: 'https://test.com/en/terms'
          }
        }
      ])('should generate correct localized paths for $pathname', ({ pathname, expected }) => {
        const links = generateHreflangLinks(pathname, 'ro');

        const roLink = links.find(l => l.locale === 'ro');
        const ruLink = links.find(l => l.locale === 'ru');
        const enLink = links.find(l => l.locale === 'en');

        expect(roLink?.url).toBe(expected.ro);
        expect(ruLink?.url).toBe(expected.ru);
        expect(enLink?.url).toBe(expected.en);
      });
    });

    describe('Dynamic Routes', () => {
      test('should handle dynamic route without params (literal [id] in path)', () => {
        const links = generateHreflangLinks('/blog/[id]', 'ro');

        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/articol/[id]' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/statya/[id]' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/blog/[id]' });
      });

      test('should replace placeholders when params provided', () => {
        const links = generateHreflangLinks('/blog/[id]', 'ro', { id: 'my-article' });

        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/articol/my-article' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/statya/my-article' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/blog/my-article' });
      });

      test('should handle /catalog/product/[id] with params correctly', () => {
        const links = generateHreflangLinks('/catalog/product/[id]', 'ro', { id: 'test-product-123' });

        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/catalog/produs/test-product-123' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/katalog/tovar/test-product-123' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/catalog/product/test-product-123' });
      });

      test('should handle /confirmation/[id] with same path for some locales', () => {
        const links = generateHreflangLinks('/confirmation/[id]', 'ro', { id: 'order-456' });

        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/confirmation/order-456' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/podtverzhdenie/order-456' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/confirmation/order-456' });
      });

      test('should handle dynamic route with special characters in params', () => {
        const links = generateHreflangLinks('/blog/[id]', 'ro', { id: 'article-with-special_chars-123' });

        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/articol/article-with-special_chars-123' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/statya/article-with-special_chars-123' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/blog/article-with-special_chars-123' });
      });

      test('should handle extra params (not used in route)', () => {
        const links = generateHreflangLinks('/blog/[id]', 'ro', {
          id: 'my-article',
          category: 'tech',
          unused: 'param'
        });

        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/articol/my-article' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/statya/my-article' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/blog/my-article' });
      });
    });

    describe('Fallback Behavior', () => {
      test('should handle non-existent routes by using pathname as-is', () => {
        const links = generateHreflangLinks('/unknown/path', 'ro');

        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/unknown/path' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/unknown/path' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/unknown/path' });
      });

      test('should handle non-existent dynamic routes with params', () => {
        const links = generateHreflangLinks('/unknown/[type]/[id]', 'ro', {
          type: 'category',
          id: '123'
        });

        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/unknown/category/123' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/unknown/category/123' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/unknown/category/123' });
      });
    });

    describe('Edge Cases', () => {
      test('should handle empty pathname', () => {
        const links = generateHreflangLinks('', 'ro');

        expect(links).toHaveLength(4);
        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en' });
      });

      test('should handle pathname with trailing slash', () => {
        const links = generateHreflangLinks('/catalog/', 'ro');

        // Even though input has trailing slash, it should not match the route
        // and fallback to using pathname as-is
        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/catalog/' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/catalog/' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/catalog/' });
      });

      test('should handle missing params for dynamic routes', () => {
        const links = generateHreflangLinks('/blog/[id]', 'ro');

        // Without params, [id] should remain literal
        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/articol/[id]' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/statya/[id]' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/blog/[id]' });
      });

      test('should handle very long pathnames', () => {
        const longPath = '/very/long/nested/path/that/does/not/exist/in/routing/config';
        const links = generateHreflangLinks(longPath, 'ro');

        expect(links).toContainEqual({ locale: 'ro', url: `https://test.com/ro${longPath}` });
        expect(links).toContainEqual({ locale: 'ru', url: `https://test.com/ru${longPath}` });
        expect(links).toContainEqual({ locale: 'en', url: `https://test.com/en${longPath}` });
      });

      test('should handle params with empty string values', () => {
        const links = generateHreflangLinks('/blog/[id]', 'ro', { id: '' });

        // Empty params should still replace the placeholder
        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/articol/' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/statya/' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/blog/' });
      });

      test('should handle params with URL-unsafe characters', () => {
        const links = generateHreflangLinks('/blog/[id]', 'ro', { id: 'article?with&special=chars' });

        // Note: The function doesn't URL-encode params, that's the caller's responsibility
        expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/articol/article?with&special=chars' });
        expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/statya/article?with&special=chars' });
        expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/blog/article?with&special=chars' });
      });
    });

    describe('Locale Handling', () => {
      test('should work with any locale as currentLocale parameter', () => {
        const linksFromRo = generateHreflangLinks('/catalog', 'ro');
        const linksFromRu = generateHreflangLinks('/catalog', 'ru');
        const linksFromEn = generateHreflangLinks('/catalog', 'en');

        // The output should be the same regardless of currentLocale
        expect(linksFromRo).toEqual(linksFromRu);
        expect(linksFromRu).toEqual(linksFromEn);
      });

      test('should always include all configured locales', () => {
        const links = generateHreflangLinks('/catalog', 'ro');
        const locales = links.map(l => l.locale);

        expect(locales).toContain('ro');
        expect(locales).toContain('ru');
        expect(locales).toContain('en');
        expect(locales).toContain('x-default');
      });

      test('should always use Romanian as x-default', () => {
        const testPaths = ['/', '/catalog', '/blog/[id]', '/unknown'];

        testPaths.forEach(path => {
          const links = generateHreflangLinks(path, 'en');
          const xDefault = links.find(l => l.locale === 'x-default');
          const roLink = links.find(l => l.locale === 'ro');

          expect(xDefault?.url).toBe(roLink?.url);
        });
      });
    });
  });

  describe('generateHreflangLinksWithQuery()', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
      process.env.BASE_URL = 'https://test.com';
    });

    test('should return same links when no searchParams provided', () => {
      const linksWithoutQuery = generateHreflangLinks('/catalog', 'ro');
      const linksWithQuery = generateHreflangLinksWithQuery('/catalog', 'ro');

      expect(linksWithQuery).toEqual(linksWithoutQuery);
    });

    test('should append query string to all URLs when searchParams provided', () => {
      const searchParams = new URLSearchParams({ category: 'tech', sort: 'price' });
      const links = generateHreflangLinksWithQuery('/catalog', 'ro', undefined, searchParams);

      expect(links).toContainEqual({ locale: 'ro', url: 'https://test.com/ro/catalog?category=tech&sort=price' });
      expect(links).toContainEqual({ locale: 'ru', url: 'https://test.com/ru/katalog?category=tech&sort=price' });
      expect(links).toContainEqual({ locale: 'en', url: 'https://test.com/en/catalog?category=tech&sort=price' });
      expect(links).toContainEqual({ locale: 'x-default', url: 'https://test.com/ro/catalog?category=tech&sort=price' });
    });

    test('should handle empty URLSearchParams', () => {
      const searchParams = new URLSearchParams();
      const linksWithEmptyParams = generateHreflangLinksWithQuery('/catalog', 'ro', undefined, searchParams);
      const linksWithoutParams = generateHreflangLinks('/catalog', 'ro');

      expect(linksWithEmptyParams).toEqual(linksWithoutParams);
    });

    test('should preserve complex query parameters', () => {
      const searchParams = new URLSearchParams({
        'filter[color]': 'red',
        'filter[size]': 'large',
        'page': '2',
        'q': 'search term'
      });
      const links = generateHreflangLinksWithQuery('/catalog', 'ro', undefined, searchParams);

      const queryString = searchParams.toString();
      links.forEach(link => {
        if (link.locale !== 'x-default') {
          expect(link.url).toContain(`?${queryString}`);
        }
      });
    });

    test('should handle special characters in query params', () => {
      const searchParams = new URLSearchParams({
        q: 'search with spaces & special',
        'filter[]': 'value'
      });
      const links = generateHreflangLinksWithQuery('/catalog', 'ro', undefined, searchParams);

      // URLSearchParams automatically encodes special characters
      const encodedQuery = searchParams.toString();
      expect(links[0].url).toContain(`?${encodedQuery}`);
    });

    test('should combine dynamic params and query params correctly', () => {
      const searchParams = new URLSearchParams({ sort: 'newest', category: 'tech' });
      const links = generateHreflangLinksWithQuery(
        '/blog/[id]',
        'ro',
        { id: 'my-article' },
        searchParams
      );

      expect(links).toContainEqual({
        locale: 'ro',
        url: 'https://test.com/ro/articol/my-article?sort=newest&category=tech'
      });
      expect(links).toContainEqual({
        locale: 'ru',
        url: 'https://test.com/ru/statya/my-article?sort=newest&category=tech'
      });
      expect(links).toContainEqual({
        locale: 'en',
        url: 'https://test.com/en/blog/my-article?sort=newest&category=tech'
      });
    });

    test('should handle undefined searchParams parameter', () => {
      const links = generateHreflangLinksWithQuery('/catalog', 'ro', undefined, undefined);
      const baseLinks = generateHreflangLinks('/catalog', 'ro');

      expect(links).toEqual(baseLinks);
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      delete process.env.BASE_URL;
    });

    test('should handle complex real-world scenario', () => {
      const searchParams = new URLSearchParams({
        category: 'electronics',
        'filter[price]': '100-500',
        sort: 'popularity',
        page: '3'
      });

      const links = generateHreflangLinksWithQuery(
        '/catalog/product/[id]',
        'en',
        { id: 'iphone-15-pro-max' },
        searchParams
      );

      expect(links).toHaveLength(4);
      expect(links).toContainEqual({
        locale: 'ro',
        url: 'https://cado.md/ro/catalog/produs/iphone-15-pro-max?category=electronics&filter%5Bprice%5D=100-500&sort=popularity&page=3'
      });
      expect(links).toContainEqual({
        locale: 'ru',
        url: 'https://cado.md/ru/katalog/tovar/iphone-15-pro-max?category=electronics&filter%5Bprice%5D=100-500&sort=popularity&page=3'
      });
      expect(links).toContainEqual({
        locale: 'en',
        url: 'https://cado.md/en/catalog/product/iphone-15-pro-max?category=electronics&filter%5Bprice%5D=100-500&sort=popularity&page=3'
      });
    });

    test('should maintain consistency across all scenarios', () => {
      const testCases = [
        { path: '/', params: undefined },
        { path: '/catalog', params: undefined },
        { path: '/blog/[id]', params: { id: 'test' } },
        { path: '/unknown/path', params: undefined }
      ];

      testCases.forEach(({ path, params }) => {
        const links = generateHreflangLinks(path, 'ro', params);

        // Should always have 4 links
        expect(links).toHaveLength(4);

        // Should always have these locales
        const locales = links.map(l => l.locale).sort();
        expect(locales).toEqual(['en', 'ro', 'ru', 'x-default']);

        // x-default should always point to Romanian
        const xDefault = links.find(l => l.locale === 'x-default');
        const romanian = links.find(l => l.locale === 'ro');
        expect(xDefault?.url).toBe(romanian?.url);

        // All URLs should start with the base URL
        links.forEach(link => {
          expect(link.url).toMatch(/^https:\/\/cado\.md\//);
        });
      });
    });

    test('should perform well with large parameter sets', () => {
      const largeParams: Record<string, string> = {};
      for (let i = 0; i < 100; i++) {
        largeParams[`param${i}`] = `value${i}`;
      }

      const startTime = performance.now();
      const links = generateHreflangLinks('/blog/[id]', 'ro', { id: 'test', ...largeParams });
      const endTime = performance.now();

      // Should complete in reasonable time (< 50ms)
      expect(endTime - startTime).toBeLessThan(50);

      // Should still generate correct links
      expect(links).toHaveLength(4);
      expect(links).toContainEqual({ locale: 'ro', url: 'https://cado.md/ro/articol/test' });
    });
  });
});