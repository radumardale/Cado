import { describe, it, expect } from 'vitest';
import { addOrderRequestSchema } from '@/lib/validation/order/addOrderRequest';
import { updateOrderRequestSchema } from '@/lib/validation/order/updateOrderRequest';
import { deleteOrderRequestSchema } from '@/lib/validation/order/deleteOrderRequest';
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod';
import { DeliveryMethod } from '@/models/order/types/deliveryMethod';
import { ClientEntity } from '@/models/order/types/orderEntity';
import { OrderState } from '@/models/order/types/orderState';
import { StockState } from '@/lib/enums/StockState';
import {
  createMultilingualString,
  createMongoId,
  createInvalidMongoId,
  expectValidData,
  expectInvalidData,
  expectInvalidDataWithMessage,
} from '../shared/test-helpers';

/**
 * Order CRUD Schemas Tests
 *
 * Tests for order validation CRUD schemas with complex cross-field refinements:
 * - addOrderRequestSchema: 8 refinements (termsAccepted + 7 cross-field)
 * - updateOrderRequestSchema: 6 refinements (same without termsAccepted)
 * - deleteOrderRequestSchema: Simple MongoDB ID validation
 */

// =============================================================================
// Test Data Factories
// =============================================================================

const createValidProduct = () => ({
  product: {
    _id: createMongoId(),
    custom_id: 'PROD-001',
    title: createMultilingualString('Test Product'),
    price: 100,
    stock_availability: {
      stock: 10,
      state: StockState.IN_STOCK,
    },
    sale: {
      active: false,
      sale_price: 0,
    },
    images: ['https://example.com/image1.jpg'],
  },
  quantity: 2,
});

const createValidUserData = () => ({
  email: 'test@example.com',
  firstname: 'John',
  lastname: 'Doe',
  tel_number: '+373 69 123 456',
});

const createValidAdditionalInfo = (
  options: {
    billingCheckbox?: boolean;
    entityType?: ClientEntity;
    includeDeliveryCity?: boolean;
    includeDeliveryAddress?: boolean;
  } = {}
) => {
  const {
    billingCheckbox = true,
    entityType = ClientEntity.Natural,
    includeDeliveryCity = false,
    includeDeliveryAddress = false,
  } = options;

  return {
    user_data: createValidUserData(),
    delivery_address: {
      region: 'Chișinău',
      ...(includeDeliveryCity && { city: 'Chișinău' }),
      ...(includeDeliveryAddress && { home_address: 'Strada Centrală' }),
      home_nr: '10',
    },
    billing_address: {
      city: 'Chișinău',
      home_address: 'Strada Billing',
      home_nr: '5',
      ...(entityType === ClientEntity.Legal && {
        company_name: 'SRL Cado',
        idno: '1234567890',
      }),
      ...(entityType === ClientEntity.Natural && {
        firstname: 'Ion',
        lastname: 'Popescu',
      }),
    },
    billing_checkbox: billingCheckbox,
    entity_type: entityType,
  };
};

const createValidAddOrderData = (overrides = {}) => ({
  products: [createValidProduct()],
  additional_info: createValidAdditionalInfo(),
  payment_method: OrderPaymentMethod.Cash,
  delivery_method: DeliveryMethod.PICKUP,
  delivery_details: {
    delivery_date: '2024-12-25',
    hours_intervals: '10:00-12:00',
    message: 'Please handle with care',
  },
  total_cost: 200,
  termsAccepted: true,
  ...overrides,
});

const createValidUpdateOrderData = (overrides = {}) => ({
  id: createMongoId(),
  products: [createValidProduct()],
  additional_info: createValidAdditionalInfo(),
  payment_method: OrderPaymentMethod.Cash,
  delivery_method: DeliveryMethod.PICKUP,
  delivery_details: {},
  total_cost: 200,
  state: OrderState.NotPaid,
  ...overrides,
});

// =============================================================================
// addOrderRequestSchema Tests
// =============================================================================

describe('addOrderRequestSchema', () => {
  describe('Valid Input', () => {
    it('should accept valid order with PICKUP', () => {
      const validData = createValidAddOrderData();
      expectValidData(addOrderRequestSchema, validData);
    });

    it('should accept valid order with HOME_DELIVERY and Paynet', () => {
      const validData = createValidAddOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Paynet,
        additional_info: createValidAdditionalInfo({
          includeDeliveryCity: true,
          includeDeliveryAddress: true,
        }),
      });
      expectValidData(addOrderRequestSchema, validData);
    });

    it('should accept multiple products', () => {
      const validData = createValidAddOrderData({
        products: [createValidProduct(), createValidProduct(), createValidProduct()],
        total_cost: 600,
      });
      expectValidData(addOrderRequestSchema, validData);
    });

    it('should accept all payment methods with PICKUP', () => {
      Object.values(OrderPaymentMethod).forEach(paymentMethod => {
        const validData = createValidAddOrderData({ payment_method: paymentMethod });
        expectValidData(addOrderRequestSchema, validData);
      });
    });

    it('should accept Legal entity with billing checkbox true', () => {
      const validData = createValidAddOrderData({
        additional_info: createValidAdditionalInfo({
          billingCheckbox: true,
          entityType: ClientEntity.Legal,
        }),
      });
      expectValidData(addOrderRequestSchema, validData);
    });

    it('should accept Legal entity with billing checkbox false and complete billing address', () => {
      const validData = createValidAddOrderData({
        additional_info: createValidAdditionalInfo({
          billingCheckbox: false,
          entityType: ClientEntity.Legal,
        }),
      });
      expectValidData(addOrderRequestSchema, validData);
    });
  });

  describe('Invalid Input - Required Fields', () => {
    it('should reject missing products', () => {
      const invalidData = createValidAddOrderData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (invalidData as any).products;
      expectInvalidData(addOrderRequestSchema, invalidData);
    });

    it('should accept empty products array (schema allows this)', () => {
      // Note: This might be a schema bug - orders should probably require at least one product
      const validData = createValidAddOrderData({ products: [] });
      expectValidData(addOrderRequestSchema, validData);
    });

    it('should reject missing additional_info', () => {
      const invalidData = createValidAddOrderData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (invalidData as any).additional_info;
      expectInvalidData(addOrderRequestSchema, invalidData);
    });

    it('should reject missing payment_method', () => {
      const invalidData = createValidAddOrderData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (invalidData as any).payment_method;
      expectInvalidData(addOrderRequestSchema, invalidData);
    });

    it('should reject missing delivery_method', () => {
      const invalidData = createValidAddOrderData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (invalidData as any).delivery_method;
      expectInvalidData(addOrderRequestSchema, invalidData);
    });

    it('should reject missing termsAccepted', () => {
      const invalidData = createValidAddOrderData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (invalidData as any).termsAccepted;
      expectInvalidData(addOrderRequestSchema, invalidData);
    });
  });

  describe('Product Validation', () => {
    it('should reject product with invalid MongoDB ID', () => {
      const invalidData = createValidAddOrderData();
      invalidData.products[0].product._id = createInvalidMongoId();
      expectInvalidDataWithMessage(
        addOrderRequestSchema,
        invalidData,
        'ID must be exactly 24 characters long'
      );
    });

    it('should reject product with negative price', () => {
      const invalidData = createValidAddOrderData();
      invalidData.products[0].product.price = -10;
      expectInvalidDataWithMessage(addOrderRequestSchema, invalidData, 'Price cannot be below 0');
    });

    it('should reject product with missing title language', () => {
      const invalidData = createValidAddOrderData();
      invalidData.products[0].product.title = {
        ru: 'Test RU',
        en: 'Test EN',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      expectInvalidData(addOrderRequestSchema, invalidData);
    });
  });

  describe('Enum Validation', () => {
    it('should reject invalid payment_method', () => {
      const invalidData = createValidAddOrderData({ payment_method: 'INVALID_METHOD' });
      expectInvalidData(addOrderRequestSchema, invalidData);
    });

    it('should reject invalid delivery_method', () => {
      const invalidData = createValidAddOrderData({ delivery_method: 'INVALID_DELIVERY' });
      expectInvalidData(addOrderRequestSchema, invalidData);
    });
  });

  describe('Refinement 1: termsAccepted Must Be True', () => {
    it('should reject termsAccepted = false', () => {
      const invalidData = createValidAddOrderData({ termsAccepted: false });
      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Trebuie să acceptați termenii și condițiile');
      }
    });

    it('should accept termsAccepted = true', () => {
      const validData = createValidAddOrderData({ termsAccepted: true });
      expectValidData(addOrderRequestSchema, validData);
    });
  });

  describe('Refinement 2: HOME_DELIVERY Requires Paynet Payment', () => {
    it('should reject HOME_DELIVERY with Cash payment', () => {
      const invalidData = createValidAddOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Cash,
        additional_info: createValidAdditionalInfo({
          includeDeliveryCity: true,
          includeDeliveryAddress: true,
        }),
      });

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.errors.map(e => e.path.join('.'));
        expect(errorPaths).toContain('payment_method');
        expect(result.error.errors[0].message).toContain('PAYNET');
      }
    });

    it('should accept HOME_DELIVERY with Paynet payment', () => {
      const validData = createValidAddOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Paynet,
        additional_info: createValidAdditionalInfo({
          includeDeliveryCity: true,
          includeDeliveryAddress: true,
        }),
      });
      expectValidData(addOrderRequestSchema, validData);
    });

    it('should allow Cash payment with PICKUP', () => {
      const validData = createValidAddOrderData({
        delivery_method: DeliveryMethod.PICKUP,
        payment_method: OrderPaymentMethod.Cash,
      });
      expectValidData(addOrderRequestSchema, validData);
    });
  });

  describe('Refinement 3: HOME_DELIVERY Requires Delivery City', () => {
    it('should reject HOME_DELIVERY without delivery city', () => {
      const invalidData = createValidAddOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Paynet,
        additional_info: createValidAdditionalInfo({
          includeDeliveryCity: false,
          includeDeliveryAddress: true,
        }),
      });

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.errors.map(e => e.path.join('.'));
        expect(errorPaths).toContain('additional_info.delivery_address.city');
      }
    });

    it('should reject HOME_DELIVERY with city shorter than 2 characters', () => {
      const invalidData = createValidAddOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Paynet,
      });
      invalidData.additional_info.delivery_address.city = 'C';

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept HOME_DELIVERY with valid city', () => {
      const validData = createValidAddOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Paynet,
        additional_info: createValidAdditionalInfo({
          includeDeliveryCity: true,
          includeDeliveryAddress: true,
        }),
      });
      expectValidData(addOrderRequestSchema, validData);
    });
  });

  describe('Refinement 4: HOME_DELIVERY Requires Home Address', () => {
    it('should reject HOME_DELIVERY without home_address', () => {
      const invalidData = createValidAddOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Paynet,
        additional_info: createValidAdditionalInfo({
          includeDeliveryCity: true,
          includeDeliveryAddress: false,
        }),
      });

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.errors.map(e => e.path.join('.'));
        expect(errorPaths).toContain('additional_info.delivery_address.home_address');
      }
    });

    it('should reject HOME_DELIVERY with home_address shorter than 2 characters', () => {
      const invalidData = createValidAddOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Paynet,
        additional_info: createValidAdditionalInfo({
          includeDeliveryCity: true,
          includeDeliveryAddress: true,
        }),
      });
      invalidData.additional_info.delivery_address.home_address = 'S';

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept HOME_DELIVERY with valid home_address', () => {
      const validData = createValidAddOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Paynet,
        additional_info: createValidAdditionalInfo({
          includeDeliveryCity: true,
          includeDeliveryAddress: true,
        }),
      });
      expectValidData(addOrderRequestSchema, validData);
    });
  });

  describe('Refinement 5: Legal Entity Requires Company Name', () => {
    it('should reject Legal entity without billing checkbox and missing company_name', () => {
      const invalidData = createValidAddOrderData({
        additional_info: {
          ...createValidAdditionalInfo({
            billingCheckbox: false,
            entityType: ClientEntity.Legal,
          }),
          billing_address: {
            city: 'Chișinău',
            home_address: 'Strada Billing',
            idno: '1234567890',
          },
        },
      });

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.errors.map(e => e.path.join('.'));
        expect(errorPaths).toContain('additional_info.billing_address.company_name');
      }
    });

    it('should reject Legal entity with company_name shorter than 2 characters', () => {
      const invalidData = createValidAddOrderData({
        additional_info: {
          ...createValidAdditionalInfo({
            billingCheckbox: false,
            entityType: ClientEntity.Legal,
          }),
          billing_address: {
            city: 'Chișinău',
            home_address: 'Strada Billing',
            company_name: 'C',
            idno: '1234567890',
          },
        },
      });

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept Legal entity with valid company_name', () => {
      const validData = createValidAddOrderData({
        additional_info: createValidAdditionalInfo({
          billingCheckbox: false,
          entityType: ClientEntity.Legal,
        }),
      });
      expectValidData(addOrderRequestSchema, validData);
    });

    it('should allow Legal entity without company_name when billing_checkbox is true', () => {
      const validData = createValidAddOrderData({
        additional_info: createValidAdditionalInfo({
          billingCheckbox: true,
          entityType: ClientEntity.Legal,
        }),
      });
      expectValidData(addOrderRequestSchema, validData);
    });
  });

  describe('Refinement 6: Legal Entity Requires IDNO', () => {
    it('should reject Legal entity without billing checkbox and missing idno', () => {
      const invalidData = createValidAddOrderData({
        additional_info: {
          ...createValidAdditionalInfo({
            billingCheckbox: false,
            entityType: ClientEntity.Legal,
          }),
          billing_address: {
            city: 'Chișinău',
            home_address: 'Strada Billing',
            company_name: 'SRL Cado',
          },
        },
      });

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.errors.map(e => e.path.join('.'));
        expect(errorPaths).toContain('additional_info.billing_address.idno');
      }
    });

    it('should reject Legal entity with idno shorter than 2 characters', () => {
      const invalidData = createValidAddOrderData({
        additional_info: {
          ...createValidAdditionalInfo({
            billingCheckbox: false,
            entityType: ClientEntity.Legal,
          }),
          billing_address: {
            city: 'Chișinău',
            home_address: 'Strada Billing',
            company_name: 'SRL Cado',
            idno: '1',
          },
        },
      });

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Refinement 7: Natural Entity Requires Firstname', () => {
    it('should reject Natural entity without billing checkbox and missing firstname', () => {
      const invalidData = createValidAddOrderData({
        additional_info: {
          ...createValidAdditionalInfo({
            billingCheckbox: false,
            entityType: ClientEntity.Natural,
          }),
          billing_address: {
            city: 'Chișinău',
            home_address: 'Strada Billing',
            lastname: 'Popescu',
          },
        },
      });

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.errors.map(e => e.path.join('.'));
        expect(errorPaths).toContain('additional_info.billing_address.firstname');
      }
    });

    it('should accept Natural entity with valid firstname', () => {
      const validData = createValidAddOrderData({
        additional_info: createValidAdditionalInfo({
          billingCheckbox: false,
          entityType: ClientEntity.Natural,
        }),
      });
      expectValidData(addOrderRequestSchema, validData);
    });
  });

  describe('Refinement 8: Natural Entity Requires Lastname', () => {
    it('should reject Natural entity without billing checkbox and missing lastname', () => {
      const invalidData = createValidAddOrderData({
        additional_info: {
          ...createValidAdditionalInfo({
            billingCheckbox: false,
            entityType: ClientEntity.Natural,
          }),
          billing_address: {
            city: 'Chișinău',
            home_address: 'Strada Billing',
            firstname: 'Ion',
          },
        },
      });

      const result = addOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.errors.map(e => e.path.join('.'));
        expect(errorPaths).toContain('additional_info.billing_address.lastname');
      }
    });

    it('should accept Natural entity with valid lastname', () => {
      const validData = createValidAddOrderData({
        additional_info: createValidAdditionalInfo({
          billingCheckbox: false,
          entityType: ClientEntity.Natural,
        }),
      });
      expectValidData(addOrderRequestSchema, validData);
    });
  });
});

// =============================================================================
// updateOrderRequestSchema Tests
// =============================================================================

describe('updateOrderRequestSchema', () => {
  describe('Valid Input', () => {
    it('should accept valid update order data', () => {
      const validData = createValidUpdateOrderData();
      expectValidData(updateOrderRequestSchema, validData);
    });

    it('should accept all order states', () => {
      Object.values(OrderState).forEach(state => {
        const validData = createValidUpdateOrderData({ state });
        expectValidData(updateOrderRequestSchema, validData);
      });
    });

    it('should accept valid MongoDB ID', () => {
      const validData = createValidUpdateOrderData({ id: createMongoId() });
      expectValidData(updateOrderRequestSchema, validData);
    });
  });

  describe('Invalid Input', () => {
    it('should reject missing id', () => {
      const invalidData = createValidUpdateOrderData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (invalidData as any).id;
      expectInvalidData(updateOrderRequestSchema, invalidData);
    });

    it('should reject invalid MongoDB ID', () => {
      const invalidData = createValidUpdateOrderData({ id: createInvalidMongoId() });
      expectInvalidDataWithMessage(
        updateOrderRequestSchema,
        invalidData,
        'ID must be exactly 24 characters long'
      );
    });

    it('should reject invalid state enum', () => {
      const invalidData = createValidUpdateOrderData({ state: 'INVALID_STATE' });
      expectInvalidData(updateOrderRequestSchema, invalidData);
    });
  });

  describe('Refinements (Same as addOrderRequest, minus termsAccepted)', () => {
    it('should reject HOME_DELIVERY with Cash payment', () => {
      const invalidData = createValidUpdateOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Cash,
        additional_info: createValidAdditionalInfo({
          includeDeliveryCity: true,
          includeDeliveryAddress: true,
        }),
      });

      const result = updateOrderRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept HOME_DELIVERY with Paynet and complete address', () => {
      const validData = createValidUpdateOrderData({
        delivery_method: DeliveryMethod.HOME_DELIVERY,
        payment_method: OrderPaymentMethod.Paynet,
        additional_info: createValidAdditionalInfo({
          includeDeliveryCity: true,
          includeDeliveryAddress: true,
        }),
      });
      expectValidData(updateOrderRequestSchema, validData);
    });
  });
});

// =============================================================================
// deleteOrderRequestSchema Tests
// =============================================================================

describe('deleteOrderRequestSchema', () => {
  describe('Valid Input', () => {
    it('should accept valid MongoDB ID', () => {
      expectValidData(deleteOrderRequestSchema, { id: createMongoId() });
    });

    it('should accept another valid MongoDB ID', () => {
      expectValidData(deleteOrderRequestSchema, { id: '507f191e810c19729de860ea' });
    });
  });

  describe('Invalid Input', () => {
    it('should reject missing id', () => {
      expectInvalidData(deleteOrderRequestSchema, {});
    });

    it('should reject invalid MongoDB ID', () => {
      expectInvalidDataWithMessage(
        deleteOrderRequestSchema,
        { id: createInvalidMongoId() },
        'ID must be exactly 24 characters long'
      );
    });

    it('should reject ID shorter than 24 characters', () => {
      expectInvalidDataWithMessage(
        deleteOrderRequestSchema,
        { id: '507f191e810c19729de860' },
        'ID must be exactly 24 characters long'
      );
    });

    it('should reject ID longer than 24 characters', () => {
      expectInvalidDataWithMessage(
        deleteOrderRequestSchema,
        { id: '507f191e810c19729de860eaaa' },
        'ID must be exactly 24 characters long'
      );
    });

    it('should reject non-string ID', () => {
      expectInvalidData(deleteOrderRequestSchema, { id: 12345 });
    });
  });
});
