import { describe, it, expect } from 'vitest';
import { getAllProductsRequestSchema } from '@/lib/validation/product/getAllProductsRequest';
import { getProductRequestSchema } from '@/lib/validation/product/getProductsByFilter';
import { getAdminProductsRequestSchema } from '@/lib/validation/product/getAdminProducts';
import { searchTagsRequestSchema } from '@/lib/validation/product/searchTagsRequest';
import { getRecProductsRequestSchema } from '@/lib/validation/product/getRecProductsRequest';
import { Categories } from '@/lib/enums/Categories';
import { Ocasions } from '@/lib/enums/Ocasions';
import { ProductContent } from '@/lib/enums/ProductContent';
import SortBy from '@/lib/enums/SortBy';
import { expectValidData, expectInvalidData } from '../shared/test-helpers';

/**
 * Product Filter Schema Tests
 *
 * Tests for product filtering and search validation schemas:
 * - getAllProductsRequestSchema: Complex filtering with pagination
 * - getProductRequestSchema: Filter by ocasion, categories, content
 * - getAdminProductsRequestSchema: Admin product listing
 * - searchTagsRequestSchema: Search product tags
 * - getRecProductsRequestSchema: Get recommended products
 */

describe('getAllProductsRequestSchema - Complete Product Filtering', () => {
  describe('Valid Input - Default Values', () => {
    it('should accept minimal data with defaults', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
      });
    });

    it('should apply default limit of 10', () => {
      const result = getAllProductsRequestSchema.parse({
        title: null,
        category: null,
        price: null,
      });
      expect(result.limit).toBe(10);
    });

    it('should apply default sortBy RECOMMENDED', () => {
      const result = getAllProductsRequestSchema.parse({
        title: null,
        category: null,
        price: null,
      });
      expect(result.sortBy).toBe(SortBy.RECOMMENDED);
    });
  });

  describe('Valid Input - Title Search', () => {
    it('should accept valid title search', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: 'Gift',
        category: null,
        price: null,
      });
    });

    it('should accept null title', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
      });
    });

    it('should accept title with 2 characters', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: 'ab',
        category: null,
        price: null,
      });
    });

    it('should accept long title search', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: 'a'.repeat(100),
        category: null,
        price: null,
      });
    });
  });

  describe('Valid Input - Pagination', () => {
    it('should accept custom limit', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        limit: 20,
        category: null,
        price: null,
      });
    });

    it('should accept cursor for pagination', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        cursor: 10,
        category: null,
        price: null,
      });
    });

    it('should accept null cursor', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        cursor: null,
        category: null,
        price: null,
      });
    });

    it('should accept undefined cursor', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        cursor: undefined,
        category: null,
        price: null,
      });
    });
  });

  describe('Valid Input - Category Filter', () => {
    it('should accept single category', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: Categories.GIFT_SET,
        price: null,
      });
    });

    it('should accept null category', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
      });
    });

    Object.values(Categories).forEach(category => {
      it(`should accept category: ${category}`, () => {
        expectValidData(getAllProductsRequestSchema, {
          title: null,
          category,
          price: null,
        });
      });
    });
  });

  describe('Valid Input - Ocasions Filter', () => {
    it('should accept empty ocasions array', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
        ocasions: [],
      });
    });

    it('should accept single ocasion', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
        ocasions: [Ocasions.VALENTINES_DAY],
      });
    });

    it('should accept multiple ocasions', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
        ocasions: [Ocasions.VALENTINES_DAY, Ocasions.CHRISTMAS_NEW_YEAR, Ocasions.EASTER],
      });
    });

    it('should accept undefined ocasions', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
        ocasions: undefined,
      });
    });
  });

  describe('Valid Input - Product Content Filter', () => {
    it('should accept empty product content array', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
        productContent: [],
      });
    });

    it('should accept single product content', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
        productContent: [ProductContent.COFFEE_TEA],
      });
    });

    it('should accept multiple product content types', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
        productContent: [
          ProductContent.COFFEE_TEA,
          ProductContent.CHOCOLATE_BISCUITS_CANDY,
          ProductContent.NUTS_DRY_FRUITS_SPICES,
        ],
      });
    });
  });

  describe('Valid Input - Price Range', () => {
    it('should accept price range', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: { min: 10, max: 100 },
      });
    });

    it('should accept zero min price', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: { min: 0, max: 100 },
      });
    });

    it('should accept same min and max', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: { min: 50, max: 50 },
      });
    });

    it('should accept null price', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
      });
    });

    it('should accept undefined price', () => {
      expectValidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: undefined,
      });
    });
  });

  describe('Valid Input - Sort By', () => {
    Object.values(SortBy).forEach(sortOption => {
      it(`should accept sortBy: ${sortOption}`, () => {
        expectValidData(getAllProductsRequestSchema, {
          title: null,
          category: null,
          price: null,
          sortBy: sortOption,
        });
      });
    });
  });

  describe('Invalid Input - Title', () => {
    it('should reject title with 1 character', () => {
      expectInvalidData(getAllProductsRequestSchema, {
        title: 'a',
        category: null,
        price: null,
      });
    });

    it('should reject empty title string', () => {
      expectInvalidData(getAllProductsRequestSchema, {
        title: '',
        category: null,
        price: null,
      });
    });
  });

  describe('Invalid Input - Limit', () => {
    it('should reject limit of 0', () => {
      expectInvalidData(getAllProductsRequestSchema, {
        title: null,
        limit: 0,
        category: null,
        price: null,
      });
    });

    it('should reject limit above 100', () => {
      expectInvalidData(getAllProductsRequestSchema, {
        title: null,
        limit: 101,
        category: null,
        price: null,
      });
    });

    it('should reject negative limit', () => {
      expectInvalidData(getAllProductsRequestSchema, {
        title: null,
        limit: -1,
        category: null,
        price: null,
      });
    });
  });

  describe('Invalid Input - Price', () => {
    it('should reject negative min price', () => {
      expectInvalidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: { min: -10, max: 100 },
      });
    });

    it('should reject negative max price', () => {
      expectInvalidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: { min: 0, max: -100 },
      });
    });
  });

  describe('Invalid Input - Invalid Enums', () => {
    it('should reject invalid category', () => {
      expectInvalidData(getAllProductsRequestSchema, {
        title: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: 'INVALID_CATEGORY' as any,
        price: null,
      });
    });

    it('should reject invalid sortBy', () => {
      expectInvalidData(getAllProductsRequestSchema, {
        title: null,
        category: null,
        price: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sortBy: 'INVALID_SORT' as any,
      });
    });
  });
});

describe('getProductRequestSchema - Filter by Arrays', () => {
  describe('Valid Input', () => {
    it('should accept valid filter data', () => {
      expectValidData(getProductRequestSchema, {
        ocasion: [Ocasions.VALENTINES_DAY],
        categories: [Categories.GIFT_SET],
        ProductContent: [ProductContent.COFFEE_TEA],
      });
    });

    it('should accept empty arrays', () => {
      expectValidData(getProductRequestSchema, {
        ocasion: [],
        categories: [],
        ProductContent: [],
      });
    });

    it('should accept multiple values in each array', () => {
      expectValidData(getProductRequestSchema, {
        ocasion: [Ocasions.VALENTINES_DAY, Ocasions.CHRISTMAS_NEW_YEAR],
        categories: [Categories.GIFT_SET, Categories.FOR_HER],
        ProductContent: [ProductContent.COFFEE_TEA, ProductContent.CHOCOLATE_BISCUITS_CANDY],
      });
    });
  });

  describe('Invalid Input', () => {
    it('should reject missing ocasion', () => {
      expectInvalidData(getProductRequestSchema, {
        categories: [Categories.GIFT_SET],
        ProductContent: [ProductContent.COFFEE_TEA],
      });
    });

    it('should reject missing categories', () => {
      expectInvalidData(getProductRequestSchema, {
        ocasion: [Ocasions.VALENTINES_DAY],
        ProductContent: [ProductContent.COFFEE_TEA],
      });
    });

    it('should reject missing ProductContent', () => {
      expectInvalidData(getProductRequestSchema, {
        ocasion: [Ocasions.VALENTINES_DAY],
        categories: [Categories.GIFT_SET],
      });
    });

    it('should reject invalid ocasion enum', () => {
      expectInvalidData(getProductRequestSchema, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ocasion: ['INVALID' as any],
        categories: [Categories.GIFT_SET],
        ProductContent: [ProductContent.COFFEE_TEA],
      });
    });
  });
});

describe('getAdminProductsRequestSchema - Admin Listing', () => {
  describe('Valid Input', () => {
    it('should accept minimal data with defaults', () => {
      expectValidData(getAdminProductsRequestSchema, {
        title: null,
      });
    });

    it('should apply default limit', () => {
      const result = getAdminProductsRequestSchema.parse({ title: null });
      expect(result.limit).toBe(10);
    });

    it('should apply default sortBy', () => {
      const result = getAdminProductsRequestSchema.parse({ title: null });
      expect(result.sortBy).toBe(SortBy.RECOMMENDED);
    });

    it('should accept title search with custom limit', () => {
      expectValidData(getAdminProductsRequestSchema, {
        title: 'Product',
        limit: 50,
      });
    });

    it('should accept pagination with cursor', () => {
      expectValidData(getAdminProductsRequestSchema, {
        title: null,
        cursor: 25,
        limit: 25,
      });
    });
  });

  describe('Invalid Input', () => {
    it('should reject short title', () => {
      expectInvalidData(getAdminProductsRequestSchema, {
        title: 'a',
      });
    });

    it('should reject limit above 100', () => {
      expectInvalidData(getAdminProductsRequestSchema, {
        title: null,
        limit: 150,
      });
    });
  });
});

describe('searchTagsRequestSchema - Tag Search', () => {
  describe('Valid Input', () => {
    it('should accept valid title with min 2 chars', () => {
      expectValidData(searchTagsRequestSchema, {
        title: 'ab',
      });
    });

    it('should accept title search', () => {
      expectValidData(searchTagsRequestSchema, {
        title: 'chocolate',
      });
    });

    it('should accept long title', () => {
      expectValidData(searchTagsRequestSchema, {
        title: 'a'.repeat(200),
      });
    });

    it('should accept title with special characters', () => {
      expectValidData(searchTagsRequestSchema, {
        title: 'gift-set #1',
      });
    });
  });

  describe('Invalid Input', () => {
    it('should reject title with 1 character', () => {
      expectInvalidData(searchTagsRequestSchema, {
        title: 'a',
      });
    });

    it('should reject empty title', () => {
      expectInvalidData(searchTagsRequestSchema, {
        title: '',
      });
    });

    it('should reject missing title', () => {
      expectInvalidData(searchTagsRequestSchema, {});
    });
  });
});

describe('getRecProductsRequestSchema - Recommendations', () => {
  describe('Valid Input', () => {
    it('should accept valid category and productId', () => {
      expectValidData(getRecProductsRequestSchema, {
        category: Categories.GIFT_SET,
        productId: 'product123',
      });
    });

    it('should accept different categories', () => {
      Object.values(Categories).forEach(category => {
        expectValidData(getRecProductsRequestSchema, {
          category,
          productId: 'test-id',
        });
      });
    });

    it('should accept empty productId', () => {
      expectValidData(getRecProductsRequestSchema, {
        category: Categories.FOR_HER,
        productId: '',
      });
    });
  });

  describe('Invalid Input', () => {
    it('should reject missing category', () => {
      expectInvalidData(getRecProductsRequestSchema, {
        productId: 'product123',
      });
    });

    it('should reject missing productId', () => {
      expectInvalidData(getRecProductsRequestSchema, {
        category: Categories.GIFT_SET,
      });
    });

    it('should reject invalid category', () => {
      expectInvalidData(getRecProductsRequestSchema, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: 'INVALID' as any,
        productId: 'product123',
      });
    });

    it('should reject non-string productId', () => {
      expectInvalidData(getRecProductsRequestSchema, {
        category: Categories.GIFT_SET,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        productId: 123 as any,
      });
    });
  });
});
