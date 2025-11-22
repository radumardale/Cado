import { describe, it } from 'vitest';
import { addProductRequestSchema } from '@/lib/validation/product/addProductRequest';
import { updateProductRequestSchema } from '@/lib/validation/product/updateProductRequest';
import { deleteProductRequestSchema } from '@/lib/validation/product/deleteProductRequest';
import { getProductRequestSchema } from '@/lib/validation/product/getProductRequest';
import { Categories } from '@/lib/enums/Categories';
import { Ocasions } from '@/lib/enums/Ocasions';
import { ProductContent } from '@/lib/enums/ProductContent';
import { StockState } from '@/lib/enums/StockState';
import {
  createMultilingualString,
  createMongoId,
  createInvalidMongoId,
  expectValidData,
  expectInvalidData,
  testMongoIdField,
} from '../shared/test-helpers';

/**
 * Product CRUD Schema Tests
 *
 * Tests for product CRUD validation schemas:
 * - addProductRequestSchema: Create new product
 * - updateProductRequestSchema: Update existing product
 * - deleteProductRequestSchema: Delete product
 * - getProductRequestSchema: Get single product
 */

// Helper to create valid product data
const createValidProductData = () => ({
  data: {
    title: createMultilingualString('Product Title'),
    description: createMultilingualString('Product Description'),
    long_description: createMultilingualString('Long Description'),
    image_description: createMultilingualString('Image Description'),
    set_description: createMultilingualString('Set Description'),
    price: 100,
    nr_of_items: 5,
    imagesChanged: true,
    categories: [Categories.GIFT_SET],
    ocasions: [Ocasions.WELCOME_KIT],
    product_content: [ProductContent.COFFEE_TEA],
    stock_availability: {
      stock: 10,
      state: StockState.IN_STOCK,
    },
    sale: {
      active: false,
      sale_price: 80,
    },
    imagesNumber: 3,
    optional_info: {
      weight: '500g',
      dimensions: '10x10x10cm',
      material: {
        ro: 'Ceramică',
        ru: 'Керамика',
        en: 'Ceramic',
      },
      color: {
        ro: 'Albastru',
        ru: 'Синий',
        en: 'Blue',
      },
    },
  },
});

describe('addProductRequestSchema - Create Product', () => {
  describe('Valid Input - Complete Product Data', () => {
    it('should accept valid product data with all fields', () => {
      expectValidData(addProductRequestSchema, createValidProductData());
    });

    it('should accept product data without optional set_description', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data.data as any).set_description;
      expectValidData(addProductRequestSchema, data);
    });

    it('should accept product data without optional sale', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data.data as any).sale;
      expectValidData(addProductRequestSchema, data);
    });

    it('should accept product data without optional imagesChanged', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data.data as any).imagesChanged;
      expectValidData(addProductRequestSchema, data);
    });

    it('should accept product with zero price', () => {
      const data = createValidProductData();
      data.data.price = 0;
      expectValidData(addProductRequestSchema, data);
    });

    it('should accept product with multiple categories', () => {
      const data = createValidProductData();
      data.data.categories = [Categories.GIFT_SET, Categories.FOR_HER, Categories.ACCESSORIES];
      expectValidData(addProductRequestSchema, data);
    });

    it('should accept product with multiple ocasions', () => {
      const data = createValidProductData();
      data.data.ocasions = [
        Ocasions.WELCOME_KIT,
        Ocasions.VALENTINES_DAY,
        Ocasions.CHRISTMAS_NEW_YEAR,
      ];
      expectValidData(addProductRequestSchema, data);
    });

    it('should accept product with multiple product content types', () => {
      const data = createValidProductData();
      data.data.product_content = [
        ProductContent.COFFEE_TEA,
        ProductContent.CHOCOLATE_BISCUITS_CANDY,
        ProductContent.NUTS_DRY_FRUITS_SPICES,
      ];
      expectValidData(addProductRequestSchema, data);
    });
  });

  describe('Valid Input - All Categories', () => {
    const allCategories = [
      Categories.FOR_HER,
      Categories.FOR_HIM,
      Categories.FOR_KIDS,
      Categories.ACCESSORIES,
      Categories.FLOWERS_AND_BALLOONS,
      Categories.GIFT_SET,
    ];

    allCategories.forEach(category => {
      it(`should accept category: ${category}`, () => {
        const data = createValidProductData();
        data.data.categories = [category];
        expectValidData(addProductRequestSchema, data);
      });
    });
  });

  describe('Valid Input - Price Variations', () => {
    it('should accept decimal price', () => {
      const data = createValidProductData();
      data.data.price = 99.99;
      expectValidData(addProductRequestSchema, data);
    });

    it('should accept very high price', () => {
      const data = createValidProductData();
      data.data.price = 999999.99;
      expectValidData(addProductRequestSchema, data);
    });
  });

  describe('Invalid Input - Negative Price', () => {
    it('should reject negative price', () => {
      const data = createValidProductData();
      data.data.price = -10;
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject negative sale price', () => {
      const data = createValidProductData();
      data.data.sale = {
        active: true,
        sale_price: -5,
      };
      expectInvalidData(addProductRequestSchema, data);
    });
  });

  describe('Invalid Input - Missing Required Fields', () => {
    it('should reject missing title', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data.data as any).title;
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject missing description', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data.data as any).description;
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject missing long_description', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data.data as any).long_description;
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject missing price', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data.data as any).price;
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject missing categories', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data.data as any).categories;
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject missing stock_availability', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data.data as any).stock_availability;
      expectInvalidData(addProductRequestSchema, data);
    });
  });

  describe('Invalid Input - Invalid Enum Values', () => {
    it('should reject invalid category', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.categories = ['INVALID_CATEGORY' as any];
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject invalid ocasion', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.ocasions = ['INVALID_OCASION' as any];
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject invalid product content', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.product_content = ['INVALID_CONTENT' as any];
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject invalid stock state', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.stock_availability.state = 'INVALID_STATE' as any;
      expectInvalidData(addProductRequestSchema, data);
    });
  });

  describe('Invalid Input - Wrong Types', () => {
    it('should reject string for price', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.price = '100' as any;
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject string for nr_of_items', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.nr_of_items = '5' as any;
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject string for imagesNumber', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.imagesNumber = '3' as any;
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject non-array for categories', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.categories = Categories.GIFT_SET as any;
      expectInvalidData(addProductRequestSchema, data);
    });
  });

  describe('Invalid Input - Multilingual Field Validation', () => {
    it('should reject title missing Romanian', () => {
      const data = createValidProductData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.title = { ru: 'Test', en: 'Test' } as any;
      expectInvalidData(addProductRequestSchema, data);
    });

    it('should reject description with empty string', () => {
      const data = createValidProductData();
      data.data.description = { ro: '', ru: '', en: '' };
      expectInvalidData(addProductRequestSchema, data);
    });
  });

  describe('Edge Cases', () => {
    it('should accept empty arrays for categories', () => {
      const data = createValidProductData();
      data.data.categories = [];
      expectValidData(addProductRequestSchema, data);
    });

    it('should accept zero stock', () => {
      const data = createValidProductData();
      data.data.stock_availability.stock = 0;
      expectValidData(addProductRequestSchema, data);
    });
  });
});

describe('updateProductRequestSchema - Update Product', () => {
  const createValidUpdateData = () => ({
    ...createValidProductData(),
    id: createMongoId(),
  });

  describe('Valid Input', () => {
    it('should accept valid update data with MongoDB ID', () => {
      expectValidData(updateProductRequestSchema, createValidUpdateData());
    });

    it('should accept update with all product fields changed', () => {
      const data = createValidUpdateData();
      data.data.price = 200;
      data.data.title = createMultilingualString('Updated Title');
      data.data.stock_availability.stock = 50;
      expectValidData(updateProductRequestSchema, data);
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(updateProductRequestSchema, createValidUpdateData(), 'id');
  });

  describe('Invalid Input - Missing ID', () => {
    it('should reject update data without ID', () => {
      const data = createValidProductData();
      expectInvalidData(updateProductRequestSchema, data);
    });

    it('should reject update data with invalid ID', () => {
      const data = createValidUpdateData();
      data.id = createInvalidMongoId();
      expectInvalidData(updateProductRequestSchema, data);
    });
  });

  describe('Invalid Input - All Product Validations Apply', () => {
    it('should reject negative price in update', () => {
      const data = createValidUpdateData();
      data.data.price = -50;
      expectInvalidData(updateProductRequestSchema, data);
    });

    it('should reject invalid category in update', () => {
      const data = createValidUpdateData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.categories = ['INVALID' as any];
      expectInvalidData(updateProductRequestSchema, data);
    });

    it('should reject missing required field in update', () => {
      const data = createValidUpdateData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data.data as any).title;
      expectInvalidData(updateProductRequestSchema, data);
    });
  });
});

describe('deleteProductRequestSchema - Delete Product', () => {
  describe('Valid Input', () => {
    it('should accept valid MongoDB ID', () => {
      expectValidData(deleteProductRequestSchema, {
        id: createMongoId(),
      });
    });

    it('should accept without ID (optional)', () => {
      expectValidData(deleteProductRequestSchema, {});
    });

    it('should accept with undefined ID', () => {
      expectValidData(deleteProductRequestSchema, {
        id: undefined,
      });
    });
  });

  describe('Invalid Input - Invalid ID Format', () => {
    it('should reject invalid MongoDB ID format', () => {
      expectInvalidData(deleteProductRequestSchema, {
        id: createInvalidMongoId(),
      });
    });

    it('should reject ID shorter than 24 characters', () => {
      expectInvalidData(deleteProductRequestSchema, {
        id: '507f1f77bcf86cd7994390',
      });
    });

    it('should reject ID longer than 24 characters', () => {
      expectInvalidData(deleteProductRequestSchema, {
        id: '507f1f77bcf86cd79943901111',
      });
    });

    it('should reject non-string ID', () => {
      expectInvalidData(deleteProductRequestSchema, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: 123456789012345678901234 as any,
      });
    });

    it('should reject null ID', () => {
      expectInvalidData(deleteProductRequestSchema, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: null as any,
      });
    });
  });
});

describe('getProductRequestSchema - Get Single Product', () => {
  describe('Valid Input', () => {
    it('should accept valid MongoDB ID', () => {
      expectValidData(getProductRequestSchema, {
        id: createMongoId(),
      });
    });

    it('should accept different valid MongoDB IDs', () => {
      const validIds = [
        '507f1f77bcf86cd799439011',
        '5f9d88f9c9b7a1b7c8d8e8f8',
        'a'.repeat(24),
        '0'.repeat(24),
      ];

      validIds.forEach(id => {
        expectValidData(getProductRequestSchema, { id });
      });
    });
  });

  describe('Invalid Input - Missing ID', () => {
    it('should reject missing ID', () => {
      expectInvalidData(getProductRequestSchema, {});
    });

    it('should reject undefined ID', () => {
      expectInvalidData(getProductRequestSchema, {
        id: undefined,
      });
    });

    it('should reject null ID', () => {
      expectInvalidData(getProductRequestSchema, {
        id: null,
      });
    });
  });

  describe('Invalid Input - Invalid ID Format', () => {
    it('should reject invalid MongoDB ID format', () => {
      expectInvalidData(getProductRequestSchema, {
        id: createInvalidMongoId(),
      });
    });

    it('should reject empty string ID', () => {
      expectInvalidData(getProductRequestSchema, {
        id: '',
      });
    });

    it('should reject ID with special characters', () => {
      expectInvalidData(getProductRequestSchema, {
        id: '507f1f77-bcf8-6cd7-9943',
      });
    });

    it('should reject ID shorter than 24 characters', () => {
      expectInvalidData(getProductRequestSchema, {
        id: '507f1f77bcf86cd7994390',
      });
    });

    it('should reject ID longer than 24 characters', () => {
      expectInvalidData(getProductRequestSchema, {
        id: '507f1f77bcf86cd79943901111',
      });
    });

    it('should reject numeric ID', () => {
      expectInvalidData(getProductRequestSchema, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: 123456 as any,
      });
    });

    it('should reject boolean ID', () => {
      expectInvalidData(getProductRequestSchema, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: true as any,
      });
    });

    it('should reject object ID', () => {
      expectInvalidData(getProductRequestSchema, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: { _id: createMongoId() } as any,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should reject ID with whitespace', () => {
      expectInvalidData(getProductRequestSchema, {
        id: ' 507f1f77bcf86cd799439011',
      });
    });

    it('should reject ID with leading zeros beyond 24 chars', () => {
      expectInvalidData(getProductRequestSchema, {
        id: '0507f1f77bcf86cd799439011',
      });
    });

    it('should accept ID with all same characters', () => {
      expectValidData(getProductRequestSchema, {
        id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
      });
    });
  });
});
