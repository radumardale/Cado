import { describe, it, expect } from 'vitest';
import {
  generateBreadcrumbSchema,
  generateHomeBreadcrumbSchema,
  generateCatalogBreadcrumbSchema,
  generateProductBreadcrumbSchema,
} from '@/lib/seo/breadcrumb-schema';
import { Categories } from '@/lib/enums/Categories';
import { Ocasions } from '@/lib/enums/Ocasions';

/**
 * Breadcrumb Schema Generation Tests
 *
 * Tests for SEO breadcrumb schema.org JSON-LD generation functions.
 * Covers all breadcrumb types (home, catalog, product) with multilingual support.
 */

describe('Breadcrumb Schema Generation', () => {
  const BASE_URL = 'https://test.com';

  describe('generateHomeBreadcrumbSchema()', () => {
    it('should generate schema for Romanian homepage', () => {
      const schema = generateHomeBreadcrumbSchema(BASE_URL, 'ro');

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(1);
      expect(schema.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Acasă',
        item: `${BASE_URL}/ro`,
      });
    });

    it('should generate schema for Russian homepage', () => {
      const schema = generateHomeBreadcrumbSchema(BASE_URL, 'ru');

      expect(schema.itemListElement[0].name).toBe('Главная');
      expect(schema.itemListElement[0].item).toBe(`${BASE_URL}/ru`);
    });

    it('should generate schema for English homepage', () => {
      const schema = generateHomeBreadcrumbSchema(BASE_URL, 'en');

      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[0].item).toBe(`${BASE_URL}/en`);
    });

    it('should remove trailing slashes from baseUrl', () => {
      const schema = generateHomeBreadcrumbSchema(`${BASE_URL}///`, 'ro');

      expect(schema.itemListElement[0].item).toBe(`${BASE_URL}/ro`);
      expect(schema.itemListElement[0].item).not.toContain('///');
    });

    it('should handle baseUrl with spaces (not trimmed by implementation)', () => {
      const schema = generateHomeBreadcrumbSchema(`  ${BASE_URL}  `, 'en');

      // Note: Current implementation doesn't trim spaces, only removes trailing slashes
      expect(schema.itemListElement[0].item).toContain('/en');
    });
  });

  describe('generateCatalogBreadcrumbSchema()', () => {
    it('should generate basic catalog breadcrumb', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'ro');

      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].name).toBe('Acasă');
      expect(schema.itemListElement[1].name).toBe('Catalog');
      expect(schema.itemListElement[1].item).toBe(`${BASE_URL}/ro/catalog`);
    });

    it('should use localized catalog path for Russian', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'ru');

      expect(schema.itemListElement[1].item).toBe(`${BASE_URL}/ru/katalog`);
      expect(schema.itemListElement[1].name).toBe('Каталог');
    });

    it('should add category to breadcrumb', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'ro', {
        category: Categories.FOR_HER,
      });

      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[2].name).toBe('Pentru Ea');
      expect(schema.itemListElement[2].item).toContain('category=FOR_HER');
    });

    it('should add occasion to breadcrumb when no category', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'en', {
        ocasion: Ocasions.VALENTINES_DAY,
      });

      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[1].item).toContain('ocasions=VALENTINES_DAY');
      expect(schema.itemListElement[2].name).toBe("Valentine's Day");
      expect(schema.itemListElement[2].item).toContain('ocasions=VALENTINES_DAY');
    });

    it('should add sort_by parameter to catalog URL', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'ro', {
        sortBy: 'price',
      });

      expect(schema.itemListElement[1].item).toContain('sort_by=price');
    });

    it('should handle multiple filters together', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'ro', {
        category: Categories.FOR_HIM,
        sortBy: 'popularity',
      });

      const catalogUrl = schema.itemListElement[1].item;
      expect(catalogUrl).toContain('category=FOR_HIM');
      expect(catalogUrl).toContain('sort_by=popularity');

      // Category breadcrumb should match catalog URL
      expect(schema.itemListElement[2].item).toBe(catalogUrl);
    });
  });

  describe('generateProductBreadcrumbSchema()', () => {
    it('should generate product breadcrumb without category', () => {
      const schema = generateProductBreadcrumbSchema(BASE_URL, 'ro', 'Test Product', 'PROD123');

      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].name).toBe('Acasă');
      expect(schema.itemListElement[1].name).toBe('Catalog');
      expect(schema.itemListElement[2]).toEqual({
        '@type': 'ListItem',
        position: 3,
        name: 'Test Product',
      });
    });

    it('should not include item URL for final product breadcrumb', () => {
      const schema = generateProductBreadcrumbSchema(BASE_URL, 'en', 'Product Name', 'PROD456');

      const productBreadcrumb = schema.itemListElement[2];
      expect(productBreadcrumb.item).toBeUndefined();
    });

    it('should include category in breadcrumb chain', () => {
      const schema = generateProductBreadcrumbSchema(
        BASE_URL,
        'ro',
        'Produs Test',
        'PROD789',
        Categories.ACCESSORIES
      );

      expect(schema.itemListElement).toHaveLength(4);
      expect(schema.itemListElement[2].name).toBe('Accesorii');
      expect(schema.itemListElement[3].name).toBe('Produs Test');
    });

    it('should include occasion in breadcrumb chain when no category', () => {
      const schema = generateProductBreadcrumbSchema(
        BASE_URL,
        'en',
        'Gift Product',
        'PROD999',
        undefined,
        Ocasions.MARCH_8
      );

      expect(schema.itemListElement).toHaveLength(4);
      expect(schema.itemListElement[2].name).toBe("March 8 (Women's Day)");
      expect(schema.itemListElement[2].item).toContain('ocasions=MARCH_8');
      expect(schema.itemListElement[3].name).toBe('Gift Product');
    });

    it('should prefer category over occasion if both provided', () => {
      const schema = generateProductBreadcrumbSchema(
        BASE_URL,
        'ro',
        'Product',
        'PROD000',
        Categories.FOR_KIDS,
        Ocasions.VALENTINES_DAY
      );

      // Category breadcrumb is shown (not occasion), but URL contains both params
      expect(schema.itemListElement).toHaveLength(4);
      expect(schema.itemListElement[2].name).toBe('Pentru Copii');
      expect(schema.itemListElement[2].item).toContain('category=FOR_KIDS');
      // Both params are in the URL
      expect(schema.itemListElement[2].item).toContain('ocasions=VALENTINES_DAY');
    });

    it('should use correct localized paths for all locales', () => {
      const roSchema = generateProductBreadcrumbSchema(BASE_URL, 'ro', 'Produs', 'P1');
      const ruSchema = generateProductBreadcrumbSchema(BASE_URL, 'ru', 'Товар', 'P1');
      const enSchema = generateProductBreadcrumbSchema(BASE_URL, 'en', 'Product', 'P1');

      expect(roSchema.itemListElement[1].item).toContain('/ro/catalog');
      expect(ruSchema.itemListElement[1].item).toContain('/ru/katalog');
      expect(enSchema.itemListElement[1].item).toContain('/en/catalog');
    });
  });

  describe('generateBreadcrumbSchema() - Main Function', () => {
    it('should generate complete breadcrumb with all parameters', () => {
      const schema = generateBreadcrumbSchema({
        locale: 'en',
        baseUrl: BASE_URL,
        category: Categories.GIFT_SET,
        sortBy: 'price',
        productTitle: 'Luxury Gift Box',
        productId: 'GIFT001',
      });

      expect(schema.itemListElement).toHaveLength(4);

      // Home
      expect(schema.itemListElement[0].name).toBe('Home');

      // Catalog with filters
      const catalogItem = schema.itemListElement[1];
      expect(catalogItem.name).toBe('Catalog');
      expect(catalogItem.item).toContain('category=GIFT_SET');
      expect(catalogItem.item).toContain('sort_by=price');

      // Category
      expect(schema.itemListElement[2].name).toBe('Gift Sets');

      // Product (no URL)
      expect(schema.itemListElement[3].name).toBe('Luxury Gift Box');
      expect(schema.itemListElement[3].item).toBeUndefined();
    });

    it('should increment positions correctly', () => {
      const schema = generateBreadcrumbSchema({
        locale: 'ro',
        baseUrl: BASE_URL,
        category: Categories.FOR_HER,
        productTitle: 'Product',
        productId: 'P1',
      });

      schema.itemListElement.forEach((item, index) => {
        expect(item.position).toBe(index + 1);
      });
    });

    it('should handle baseUrl normalization', () => {
      const schema = generateBreadcrumbSchema({
        locale: 'ro',
        baseUrl: `${BASE_URL}////`,
        category: Categories.FOR_HER,
      });

      schema.itemListElement.forEach(item => {
        if (item.item) {
          // Check no double slashes after protocol
          const afterProtocol = item.item.split('://')[1];
          expect(afterProtocol).not.toContain('//');
        }
      });
    });
  });

  describe('Schema.org Compliance', () => {
    it('should have correct schema.org context and type', () => {
      const schema = generateHomeBreadcrumbSchema(BASE_URL, 'ro');

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
    });

    it('should have correct item types', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'en', {
        category: Categories.FOR_HIM,
      });

      schema.itemListElement.forEach(item => {
        expect(item['@type']).toBe('ListItem');
        expect(typeof item.position).toBe('number');
        expect(typeof item.name).toBe('string');
      });
    });

    it('should have sequential positions starting from 1', () => {
      const schema = generateProductBreadcrumbSchema(
        BASE_URL,
        'ro',
        'Product',
        'P1',
        Categories.ACCESSORIES
      );

      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[2].position).toBe(3);
      expect(schema.itemListElement[3].position).toBe(4);
    });
  });

  describe('Multilingual Support', () => {
    it('should use correct Romanian translations', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'ro', {
        category: Categories.FOR_KIDS,
      });

      expect(schema.itemListElement[0].name).toBe('Acasă');
      expect(schema.itemListElement[1].name).toBe('Catalog');
      expect(schema.itemListElement[2].name).toBe('Pentru Copii');
    });

    it('should use correct Russian translations', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'ru', {
        category: Categories.FLOWERS_AND_BALLOONS,
      });

      expect(schema.itemListElement[0].name).toBe('Главная');
      expect(schema.itemListElement[1].name).toBe('Каталог');
      expect(schema.itemListElement[2].name).toBe('Цветы и Шары');
    });

    it('should use correct English translations', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'en', {
        category: Categories.ACCESSORIES,
      });

      expect(schema.itemListElement[0].name).toBe('Home');
      expect(schema.itemListElement[1].name).toBe('Catalog');
      expect(schema.itemListElement[2].name).toBe('Accessories');
    });

    it('should handle all category translations', () => {
      const categories = [
        { cat: Categories.FOR_HER, ro: 'Pentru Ea', ru: 'Для Нее', en: 'For Her' },
        { cat: Categories.FOR_HIM, ro: 'Pentru El', ru: 'Для Него', en: 'For Him' },
        { cat: Categories.FOR_KIDS, ro: 'Pentru Copii', ru: 'Для Детей', en: 'For Kids' },
        { cat: Categories.ACCESSORIES, ro: 'Accesorii', ru: 'Аксессуары', en: 'Accessories' },
        {
          cat: Categories.FLOWERS_AND_BALLOONS,
          ro: 'Flori & Baloane',
          ru: 'Цветы и Шары',
          en: 'Flowers & Balloons',
        },
        {
          cat: Categories.GIFT_SET,
          ro: 'Seturi cadou',
          ru: 'Подарочные наборы',
          en: 'Gift Sets',
        },
      ];

      categories.forEach(({ cat, ro, ru, en }) => {
        const roSchema = generateCatalogBreadcrumbSchema(BASE_URL, 'ro', { category: cat });
        const ruSchema = generateCatalogBreadcrumbSchema(BASE_URL, 'ru', { category: cat });
        const enSchema = generateCatalogBreadcrumbSchema(BASE_URL, 'en', { category: cat });

        expect(roSchema.itemListElement[2].name).toBe(ro);
        expect(ruSchema.itemListElement[2].name).toBe(ru);
        expect(enSchema.itemListElement[2].name).toBe(en);
      });
    });

    it('should handle all occasion translations', () => {
      const occasions = [
        {
          occ: Ocasions.VALENTINES_DAY,
          ro: 'Ziua Îndrăgostiților',
          ru: 'День святого Валентина',
          en: "Valentine's Day",
        },
        {
          occ: Ocasions.MARCH_8,
          ro: '8 Martie (Ziua Femeilor)',
          ru: '8 марта',
          en: "March 8 (Women's Day)",
        },
        { occ: Ocasions.FOR_TEAM, ro: 'Pentru echipă', ru: 'Для команды', en: 'For Team' },
      ];

      occasions.forEach(({ occ, ro, ru, en }) => {
        const roSchema = generateCatalogBreadcrumbSchema(BASE_URL, 'ro', { ocasion: occ });
        const ruSchema = generateCatalogBreadcrumbSchema(BASE_URL, 'ru', { ocasion: occ });
        const enSchema = generateCatalogBreadcrumbSchema(BASE_URL, 'en', { ocasion: occ });

        expect(roSchema.itemListElement[2].name).toBe(ro);
        expect(ruSchema.itemListElement[2].name).toBe(ru);
        expect(enSchema.itemListElement[2].name).toBe(en);
      });
    });
  });

  describe('URL Generation', () => {
    it('should generate correct query parameters', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'ro', {
        category: Categories.FOR_HER,
        sortBy: 'popularity',
      });

      const catalogUrl = schema.itemListElement[1].item as string;
      expect(catalogUrl).toMatch(/\?category=FOR_HER&sort_by=popularity/);
    });

    it('should handle ocasion query parameter correctly', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'en', {
        ocasion: Ocasions.VALENTINES_DAY,
      });

      const catalogUrl = schema.itemListElement[1].item as string;
      expect(catalogUrl).toContain('ocasions=VALENTINES_DAY');
    });

    it('should not add query string when no filters', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'ro');

      const catalogUrl = schema.itemListElement[1].item as string;
      expect(catalogUrl).not.toContain('?');
    });

    it('should maintain correct URL structure with all parameters', () => {
      const schema = generateCatalogBreadcrumbSchema(BASE_URL, 'ru', {
        category: Categories.GIFT_SET,
        sortBy: 'price',
      });

      const catalogUrl = schema.itemListElement[1].item as string;
      expect(catalogUrl).toMatch(/^https:\/\/test\.com\/ru\/katalog\?/);
      expect(catalogUrl).toContain('category=GIFT_SET');
      expect(catalogUrl).toContain('sort_by=price');
    });
  });

  describe('Edge Cases', () => {
    it('should not add breadcrumb for empty product title', () => {
      const schema = generateProductBreadcrumbSchema(BASE_URL, 'ro', '', 'PROD1');

      // Empty string is falsy, so product breadcrumb is not added
      // Only Home and Catalog = 2 items
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].name).toBe('Acasă');
      expect(schema.itemListElement[1].name).toBe('Catalog');
    });

    it('should handle special characters in product title', () => {
      const schema = generateProductBreadcrumbSchema(
        BASE_URL,
        'en',
        'Product & "Special" <Title>',
        'PROD1'
      );

      expect(schema.itemListElement[2].name).toBe('Product & "Special" <Title>');
    });

    it('should handle very long product titles', () => {
      const longTitle = 'A'.repeat(200);
      const schema = generateProductBreadcrumbSchema(BASE_URL, 'ro', longTitle, 'PROD1');

      expect(schema.itemListElement[2].name).toBe(longTitle);
      expect(schema.itemListElement[2].name.length).toBe(200);
    });

    it('should handle Unicode characters in product title', () => {
      const schema = generateProductBreadcrumbSchema(BASE_URL, 'ru', 'Продукт 测试', 'PROD1');

      expect(schema.itemListElement[2].name).toBe('Продукт 测试');
    });

    it('should handle baseUrl without protocol', () => {
      const schema = generateHomeBreadcrumbSchema('test.com', 'en');

      expect(schema.itemListElement[0].item).toBe('test.com/en');
    });

    it('should handle baseUrl with multiple trailing slashes', () => {
      const schema = generateHomeBreadcrumbSchema('https://test.com//////', 'ro');

      expect(schema.itemListElement[0].item).toBe('https://test.com/ro');
    });
  });
});
