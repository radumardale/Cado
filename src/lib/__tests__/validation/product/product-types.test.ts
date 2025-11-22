import { describe, it } from 'vitest';
import { productInfoSchema } from '@/lib/validation/product/types/productInfo';
import { productSaleSchema } from '@/lib/validation/product/types/productSale';
import { stockAvailabilitySchema } from '@/lib/validation/product/types/stockAvailability';
import { optionalInfoSchema } from '@/lib/validation/product/types/optionalInfo';
import { StockState } from '@/lib/enums/StockState';
import {
  createMultilingualString,
  expectValidData,
  expectInvalidData,
  expectInvalidDataWithMessage,
  XSS_PAYLOADS,
  SQL_INJECTION_PAYLOADS,
} from '../shared/test-helpers';

/**
 * Product Type Schemas Tests
 *
 * Tests for the core reusable type schemas used across product validation:
 * - productInfoSchema: Multilingual strings (required)
 * - productSaleSchema: Sale pricing
 * - stockAvailabilitySchema: Stock state and quantity
 * - optionalInfoSchema: Optional product details
 */

describe('productInfoSchema - Multilingual String Validation', () => {
  const validData = createMultilingualString('Product');

  describe('Valid Input', () => {
    it('should accept valid multilingual data', () => {
      expectValidData(productInfoSchema, validData);
    });

    it('should accept multilingual data with special characters', () => {
      expectValidData(productInfoSchema, {
        ro: 'Produse Țăști Șămănă',
        ru: 'Продукты Тест',
        en: 'Products Test',
      });
    });

    it('should accept multilingual data with numbers and symbols', () => {
      expectValidData(productInfoSchema, {
        ro: 'Produse #1 - 50% reducere!',
        ru: 'Продукт №1 - скидка 50%!',
        en: 'Product #1 - 50% off!',
      });
    });

    it('should accept multilingual data with long text', () => {
      expectValidData(productInfoSchema, {
        ro: 'a'.repeat(1000),
        ru: 'б'.repeat(1000),
        en: 'c'.repeat(1000),
      });
    });
  });

  describe('Invalid Input - Missing Languages', () => {
    it('should reject missing Romanian', () => {
      expectInvalidData(productInfoSchema, {
        ru: 'Test RU',
        en: 'Test EN',
      });
    });

    it('should reject missing Russian', () => {
      expectInvalidData(productInfoSchema, {
        ro: 'Test RO',
        en: 'Test EN',
      });
    });

    it('should reject missing English', () => {
      expectInvalidData(productInfoSchema, {
        ro: 'Test RO',
        ru: 'Test RU',
      });
    });

    it('should reject missing all languages', () => {
      expectInvalidData(productInfoSchema, {});
    });
  });

  describe('Invalid Input - Empty Strings', () => {
    it('should reject empty Romanian string', () => {
      expectInvalidDataWithMessage(
        productInfoSchema,
        { ro: '', ru: 'Test RU', en: 'Test EN' },
        'Completați câmpul'
      );
    });

    it('should reject empty Russian string', () => {
      expectInvalidDataWithMessage(
        productInfoSchema,
        { ro: 'Test RO', ru: '', en: 'Test EN' },
        'Completați câmpul'
      );
    });

    it('should reject empty English string', () => {
      expectInvalidDataWithMessage(
        productInfoSchema,
        { ro: 'Test RO', ru: 'Test RU', en: '' },
        'Completați câmpul'
      );
    });

    it('should reject all empty strings', () => {
      expectInvalidData(productInfoSchema, {
        ro: '',
        ru: '',
        en: '',
      });
    });
  });

  describe('Invalid Input - Wrong Types', () => {
    it('should reject null values', () => {
      expectInvalidData(productInfoSchema, {
        ro: null,
        ru: null,
        en: null,
      });
    });

    it('should reject undefined values', () => {
      expectInvalidData(productInfoSchema, {
        ro: undefined,
        ru: undefined,
        en: undefined,
      });
    });

    it('should reject number values', () => {
      expectInvalidData(productInfoSchema, {
        ro: 123,
        ru: 456,
        en: 789,
      });
    });

    it('should reject boolean values', () => {
      expectInvalidData(productInfoSchema, {
        ro: true,
        ru: false,
        en: true,
      });
    });

    it('should reject object values', () => {
      expectInvalidData(productInfoSchema, {
        ro: { nested: 'object' },
        ru: { nested: 'object' },
        en: { nested: 'object' },
      });
    });
  });

  describe('Security - XSS and SQL Injection', () => {
    it('should accept XSS payloads (sanitization should happen at application layer)', () => {
      XSS_PAYLOADS.forEach(payload => {
        expectValidData(productInfoSchema, {
          ro: payload,
          ru: payload,
          en: payload,
        });
      });
    });

    it('should accept SQL injection payloads (sanitization should happen at application layer)', () => {
      SQL_INJECTION_PAYLOADS.forEach(payload => {
        expectValidData(productInfoSchema, {
          ro: payload,
          ru: payload,
          en: payload,
        });
      });
    });
  });
});

describe('productSaleSchema - Sale Price Validation', () => {
  const validData = {
    active: true,
    sale_price: 100,
  };

  describe('Valid Input', () => {
    it('should accept valid sale data with active true', () => {
      expectValidData(productSaleSchema, validData);
    });

    it('should accept sale data with active false', () => {
      expectValidData(productSaleSchema, {
        active: false,
        sale_price: 50,
      });
    });

    it('should accept zero price', () => {
      expectValidData(productSaleSchema, {
        active: true,
        sale_price: 0,
      });
    });

    it('should accept very high price', () => {
      expectValidData(productSaleSchema, {
        active: true,
        sale_price: 999999.99,
      });
    });

    it('should accept decimal prices', () => {
      expectValidData(productSaleSchema, {
        active: true,
        sale_price: 19.99,
      });
    });
  });

  describe('Invalid Input - Negative Price', () => {
    it('should reject negative price', () => {
      expectInvalidDataWithMessage(
        productSaleSchema,
        { active: true, sale_price: -10 },
        'Price cannot be below 0'
      );
    });

    it('should reject very small negative price', () => {
      expectInvalidDataWithMessage(
        productSaleSchema,
        { active: true, sale_price: -0.01 },
        'Price cannot be below 0'
      );
    });
  });

  describe('Invalid Input - Missing Fields', () => {
    it('should reject missing active field', () => {
      expectInvalidData(productSaleSchema, {
        sale_price: 100,
      });
    });

    it('should reject missing sale_price field', () => {
      expectInvalidData(productSaleSchema, {
        active: true,
      });
    });

    it('should reject missing both fields', () => {
      expectInvalidData(productSaleSchema, {});
    });
  });

  describe('Invalid Input - Wrong Types', () => {
    it('should reject string for active field', () => {
      expectInvalidData(productSaleSchema, {
        active: 'true',
        sale_price: 100,
      });
    });

    it('should reject number for active field', () => {
      expectInvalidData(productSaleSchema, {
        active: 1,
        sale_price: 100,
      });
    });

    it('should reject string for sale_price', () => {
      expectInvalidData(productSaleSchema, {
        active: true,
        sale_price: '100',
      });
    });

    it('should reject null for sale_price', () => {
      expectInvalidData(productSaleSchema, {
        active: true,
        sale_price: null,
      });
    });
  });
});

describe('stockAvailabilitySchema - Stock State Validation', () => {
  describe('Valid Input - All Stock States', () => {
    it('should accept IN_STOCK state', () => {
      expectValidData(stockAvailabilitySchema, {
        stock: 10,
        state: StockState.IN_STOCK,
      });
    });

    it('should accept ON_COMMAND state', () => {
      expectValidData(stockAvailabilitySchema, {
        stock: 0,
        state: StockState.ON_COMMAND,
      });
    });

    it('should accept NOT_IN_STOCK state', () => {
      expectValidData(stockAvailabilitySchema, {
        stock: 0,
        state: StockState.NOT_IN_STOCK,
      });
    });
  });

  describe('Valid Input - Stock Quantities', () => {
    it('should accept zero stock', () => {
      expectValidData(stockAvailabilitySchema, {
        stock: 0,
        state: StockState.NOT_IN_STOCK,
      });
    });

    it('should accept positive stock', () => {
      expectValidData(stockAvailabilitySchema, {
        stock: 100,
        state: StockState.IN_STOCK,
      });
    });

    it('should accept very large stock', () => {
      expectValidData(stockAvailabilitySchema, {
        stock: 999999,
        state: StockState.IN_STOCK,
      });
    });
  });

  describe('Invalid Input - Invalid Stock State', () => {
    it('should reject invalid state string', () => {
      expectInvalidData(stockAvailabilitySchema, {
        stock: 10,
        state: 'INVALID_STATE',
      });
    });

    it('should reject numeric state', () => {
      expectInvalidData(stockAvailabilitySchema, {
        stock: 10,
        state: 1,
      });
    });

    it('should reject null state', () => {
      expectInvalidData(stockAvailabilitySchema, {
        stock: 10,
        state: null,
      });
    });
  });

  describe('Invalid Input - Invalid Stock Quantity', () => {
    it('should reject string stock', () => {
      expectInvalidData(stockAvailabilitySchema, {
        stock: '10',
        state: StockState.IN_STOCK,
      });
    });

    it('should reject null stock', () => {
      expectInvalidData(stockAvailabilitySchema, {
        stock: null,
        state: StockState.IN_STOCK,
      });
    });

    it('should reject undefined stock', () => {
      expectInvalidData(stockAvailabilitySchema, {
        stock: undefined,
        state: StockState.IN_STOCK,
      });
    });
  });

  describe('Edge Cases - Accepted by Schema', () => {
    it('should accept negative stock (no min constraint in schema)', () => {
      expectValidData(stockAvailabilitySchema, {
        stock: -10,
        state: StockState.NOT_IN_STOCK,
      });
    });

    it('should accept decimal stock (no integer constraint in schema)', () => {
      expectValidData(stockAvailabilitySchema, {
        stock: 10.5,
        state: StockState.IN_STOCK,
      });
    });
  });

  describe('Invalid Input - Missing Fields', () => {
    it('should reject missing stock field', () => {
      expectInvalidData(stockAvailabilitySchema, {
        state: StockState.IN_STOCK,
      });
    });

    it('should reject missing state field', () => {
      expectInvalidData(stockAvailabilitySchema, {
        stock: 10,
      });
    });

    it('should reject missing both fields', () => {
      expectInvalidData(stockAvailabilitySchema, {});
    });
  });
});

describe('optionalInfoSchema - Optional Product Details', () => {
  const createValidOptionalInfo = () => ({
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
  });

  describe('Valid Input - All Fields', () => {
    it('should accept all optional fields filled', () => {
      expectValidData(optionalInfoSchema, createValidOptionalInfo());
    });

    it('should accept all fields empty/undefined', () => {
      expectValidData(optionalInfoSchema, {
        weight: undefined,
        dimensions: undefined,
        material: {
          ro: undefined,
          ru: undefined,
          en: undefined,
        },
        color: {
          ro: undefined,
          ru: undefined,
          en: undefined,
        },
      });
    });

    it('should accept partially filled multilingual fields', () => {
      expectValidData(optionalInfoSchema, {
        weight: '1kg',
        dimensions: '20x20x20cm',
        material: {
          ro: 'Sticlă',
          ru: undefined,
          en: 'Glass',
        },
        color: {
          ro: undefined,
          ru: 'Красный',
          en: undefined,
        },
      });
    });
  });

  describe('Valid Input - Partial Fields', () => {
    it('should accept only weight', () => {
      expectValidData(optionalInfoSchema, {
        weight: '250g',
        dimensions: undefined,
        material: { ro: undefined, ru: undefined, en: undefined },
        color: { ro: undefined, ru: undefined, en: undefined },
      });
    });

    it('should accept only dimensions', () => {
      expectValidData(optionalInfoSchema, {
        weight: undefined,
        dimensions: '5x5x5cm',
        material: { ro: undefined, ru: undefined, en: undefined },
        color: { ro: undefined, ru: undefined, en: undefined },
      });
    });

    it('should accept only material', () => {
      expectValidData(optionalInfoSchema, {
        weight: undefined,
        dimensions: undefined,
        material: {
          ro: 'Plastic',
          ru: 'Пластик',
          en: 'Plastic',
        },
        color: { ro: undefined, ru: undefined, en: undefined },
      });
    });

    it('should accept only color', () => {
      expectValidData(optionalInfoSchema, {
        weight: undefined,
        dimensions: undefined,
        material: { ro: undefined, ru: undefined, en: undefined },
        color: {
          ro: 'Verde',
          ru: 'Зелёный',
          en: 'Green',
        },
      });
    });
  });

  describe('Valid Input - Empty Strings', () => {
    it('should accept empty strings for weight and dimensions', () => {
      expectValidData(optionalInfoSchema, {
        weight: '',
        dimensions: '',
        material: { ro: undefined, ru: undefined, en: undefined },
        color: { ro: undefined, ru: undefined, en: undefined },
      });
    });

    it('should accept empty strings in multilingual fields', () => {
      expectValidData(optionalInfoSchema, {
        weight: undefined,
        dimensions: undefined,
        material: {
          ro: '',
          ru: '',
          en: '',
        },
        color: {
          ro: '',
          ru: '',
          en: '',
        },
      });
    });
  });

  describe('Invalid Input - Wrong Types', () => {
    it('should reject number for weight', () => {
      expectInvalidData(optionalInfoSchema, {
        weight: 500,
        dimensions: undefined,
        material: { ro: undefined, ru: undefined, en: undefined },
        color: { ro: undefined, ru: undefined, en: undefined },
      });
    });

    it('should reject number for dimensions', () => {
      expectInvalidData(optionalInfoSchema, {
        weight: undefined,
        dimensions: 100,
        material: { ro: undefined, ru: undefined, en: undefined },
        color: { ro: undefined, ru: undefined, en: undefined },
      });
    });

    it('should reject non-object for material', () => {
      expectInvalidData(optionalInfoSchema, {
        weight: undefined,
        dimensions: undefined,
        material: 'Ceramic',
        color: { ro: undefined, ru: undefined, en: undefined },
      });
    });

    it('should reject non-object for color', () => {
      expectInvalidData(optionalInfoSchema, {
        weight: undefined,
        dimensions: undefined,
        material: { ro: undefined, ru: undefined, en: undefined },
        color: 'Blue',
      });
    });
  });

  describe('Invalid Input - Missing Required Structure', () => {
    it('should reject missing material field', () => {
      expectInvalidData(optionalInfoSchema, {
        weight: undefined,
        dimensions: undefined,
        color: { ro: undefined, ru: undefined, en: undefined },
      });
    });

    it('should reject missing color field', () => {
      expectInvalidData(optionalInfoSchema, {
        weight: undefined,
        dimensions: undefined,
        material: { ro: undefined, ru: undefined, en: undefined },
      });
    });

    it('should reject completely empty object', () => {
      expectInvalidData(optionalInfoSchema, {});
    });
  });

  describe('Edge Cases', () => {
    it('should accept very long weight string', () => {
      expectValidData(optionalInfoSchema, {
        weight: 'a'.repeat(500),
        dimensions: undefined,
        material: { ro: undefined, ru: undefined, en: undefined },
        color: { ro: undefined, ru: undefined, en: undefined },
      });
    });

    it('should accept special characters in all fields', () => {
      expectValidData(optionalInfoSchema, {
        weight: '500g (±10g)',
        dimensions: '10×10×10 cm²',
        material: {
          ro: 'Ceramică @ 100%',
          ru: 'Керамика # №1',
          en: 'Ceramic & Glass',
        },
        color: {
          ro: 'Albastru-verzui',
          ru: 'Сине-зелёный',
          en: 'Blue-greenish',
        },
      });
    });
  });
});
