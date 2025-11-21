import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addToCart } from '@/lib/utils';
import { mockProduct, mockProductOnSale } from '@/__tests__/helpers/mockFactories';
import type { CartInterface } from '@/lib/types/CartInterface';
import type { ProductInterface } from '@/models/product/types/productInterface';

// Mock the toast component
vi.mock('@/components/ui/productToast', () => ({
  toast: vi.fn(),
}));

import { toast } from '@/components/ui/productToast';

/**
 * Cart Utility Tests
 *
 * Tests the addToCart function which manages shopping cart state.
 * Covers adding new products, updating quantities, and toast notifications.
 */

describe('addToCart Utility', () => {
  let mockSetValue: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetValue = vi.fn();
    vi.clearAllMocks();
  });

  describe('Adding Products to Empty Cart', () => {
    it('should add a new product to an empty cart', () => {
      const emptyCart: CartInterface[] = [];

      addToCart(mockProduct as ProductInterface, 1, emptyCart, mockSetValue, 'en');

      expect(mockSetValue).toHaveBeenCalledWith([
        {
          productId: mockProduct.custom_id,
          quantity: 1,
        },
      ]);
    });

    it('should add product with custom quantity', () => {
      const emptyCart: CartInterface[] = [];

      addToCart(mockProduct as ProductInterface, 3, emptyCart, mockSetValue, 'en');

      expect(mockSetValue).toHaveBeenCalledWith([
        {
          productId: mockProduct.custom_id,
          quantity: 3,
        },
      ]);
    });

    it('should add product with default quantity of 1', () => {
      const emptyCart: CartInterface[] = [];

      addToCart(mockProduct as ProductInterface, 1, emptyCart, mockSetValue, 'en');

      const cartUpdate = mockSetValue.mock.calls[0][0];
      expect(cartUpdate[0].quantity).toBe(1);
    });
  });

  describe('Adding Products to Existing Cart', () => {
    it('should add new product to cart with existing products', () => {
      const existingCart: CartInterface[] = [
        {
          productId: 'EXISTING_PROD',
          quantity: 2,
        },
      ];

      addToCart(mockProductOnSale as ProductInterface, 1, existingCart, mockSetValue, 'en');

      expect(mockSetValue).toHaveBeenCalledWith([
        {
          productId: 'EXISTING_PROD',
          quantity: 2,
        },
        {
          productId: mockProductOnSale.custom_id,
          quantity: 1,
        },
      ]);
    });

    it('should preserve existing cart items when adding new product', () => {
      const existingCart: CartInterface[] = [
        { productId: 'OTHER_PROD_1', quantity: 1 },
        { productId: 'OTHER_PROD_2', quantity: 5 },
      ];

      addToCart(mockProduct as ProductInterface, 2, existingCart, mockSetValue, 'en');

      const cartUpdate = mockSetValue.mock.calls[0][0];
      expect(cartUpdate).toHaveLength(3);
      expect(cartUpdate[0]).toEqual({ productId: 'OTHER_PROD_1', quantity: 1 });
      expect(cartUpdate[1]).toEqual({ productId: 'OTHER_PROD_2', quantity: 5 });
      expect(cartUpdate[2]).toEqual({ productId: mockProduct.custom_id, quantity: 2 });
    });
  });

  describe('Incrementing Existing Product Quantity', () => {
    it('should increment quantity when product already exists in cart', () => {
      const existingCart: CartInterface[] = [
        {
          productId: mockProduct.custom_id,
          quantity: 2,
        },
      ];

      addToCart(mockProduct as ProductInterface, 1, existingCart, mockSetValue, 'en');

      expect(mockSetValue).toHaveBeenCalledWith([
        {
          productId: mockProduct.custom_id,
          quantity: 3,
        },
      ]);
    });

    it('should increment by custom quantity', () => {
      const existingCart: CartInterface[] = [
        {
          productId: mockProduct.custom_id,
          quantity: 5,
        },
      ];

      addToCart(mockProduct as ProductInterface, 3, existingCart, mockSetValue, 'en');

      const cartUpdate = mockSetValue.mock.calls[0][0];
      expect(cartUpdate[0].quantity).toBe(8);
    });

    it('should not modify other products when incrementing', () => {
      const existingCart: CartInterface[] = [
        { productId: 'OTHER_A', quantity: 1 },
        { productId: mockProduct.custom_id, quantity: 2 },
        { productId: 'OTHER_B', quantity: 3 },
      ];

      addToCart(mockProduct as ProductInterface, 5, existingCart, mockSetValue, 'en');

      const cartUpdate = mockSetValue.mock.calls[0][0];
      expect(cartUpdate).toHaveLength(3);
      expect(cartUpdate[0]).toEqual({ productId: 'OTHER_A', quantity: 1 });
      expect(cartUpdate[1]).toEqual({ productId: mockProduct.custom_id, quantity: 7 });
      expect(cartUpdate[2]).toEqual({ productId: 'OTHER_B', quantity: 3 });
    });
  });

  describe('Toast Notifications', () => {
    it('should trigger toast notification when adding product', () => {
      const emptyCart: CartInterface[] = [];

      addToCart(mockProduct as ProductInterface, 1, emptyCart, mockSetValue, 'en');

      expect(toast).toHaveBeenCalledWith({
        title: mockProduct.title.en,
        image: mockProduct.images[0],
        price: mockProduct.price,
      });
    });

    it('should show correct locale in toast', () => {
      const emptyCart: CartInterface[] = [];

      addToCart(mockProduct as ProductInterface, 1, emptyCart, mockSetValue, 'ro');

      expect(toast).toHaveBeenCalledWith({
        title: mockProduct.title.ro,
        image: mockProduct.images[0],
        price: mockProduct.price,
      });
    });

    it('should show Russian locale in toast', () => {
      const emptyCart: CartInterface[] = [];

      addToCart(mockProduct as ProductInterface, 1, emptyCart, mockSetValue, 'ru');

      expect(toast).toHaveBeenCalledWith({
        title: mockProduct.title.ru,
        image: mockProduct.images[0],
        price: mockProduct.price,
      });
    });

    it('should trigger toast even when incrementing existing product', () => {
      const existingCart: CartInterface[] = [
        {
          productId: mockProduct.custom_id,
          quantity: 1,
        },
      ];

      addToCart(mockProduct as ProductInterface, 1, existingCart, mockSetValue, 'en');

      expect(toast).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cart State Immutability', () => {
    it('should not mutate the original cart array', () => {
      const originalCart: CartInterface[] = [{ productId: 'IMMUTABLE_TEST', quantity: 1 }];
      const cartCopy = [...originalCart];

      addToCart(mockProduct as ProductInterface, 1, originalCart, mockSetValue, 'en');

      expect(originalCart).toEqual(cartCopy);
    });

    it('should create a new array reference', () => {
      const originalCart: CartInterface[] = [{ productId: 'REFERENCE_TEST', quantity: 1 }];

      addToCart(mockProduct as ProductInterface, 1, originalCart, mockSetValue, 'en');

      const newCart = mockSetValue.mock.calls[0][0];
      expect(newCart).not.toBe(originalCart);
    });

    it('should not mutate existing cart items when incrementing', () => {
      const existingItem = { productId: mockProduct.custom_id, quantity: 2 };
      const originalCart: CartInterface[] = [existingItem];

      addToCart(mockProduct as ProductInterface, 1, originalCart, mockSetValue, 'en');

      expect(existingItem.quantity).toBe(2); // Original unchanged
    });
  });

  describe('Product Identification', () => {
    it('should identify products by custom_id', () => {
      const existingCart: CartInterface[] = [
        {
          productId: mockProduct.custom_id,
          quantity: 1,
        },
      ];

      const sameProduct = { ...mockProduct, _id: 'different-mongo-id' };
      addToCart(sameProduct as ProductInterface, 1, existingCart, mockSetValue, 'en');

      const cartUpdate = mockSetValue.mock.calls[0][0];
      expect(cartUpdate).toHaveLength(1);
      expect(cartUpdate[0].quantity).toBe(2);
    });

    it('should treat products with different custom_ids as separate', () => {
      const existingCart: CartInterface[] = [
        {
          productId: 'EXISTING_DIFFERENT',
          quantity: 1,
        },
      ];

      const differentProduct = { ...mockProduct, custom_id: 'PROD999' };
      addToCart(differentProduct as ProductInterface, 1, existingCart, mockSetValue, 'en');

      const cartUpdate = mockSetValue.mock.calls[0][0];
      expect(cartUpdate).toHaveLength(2);
    });
  });

  describe('Multiple Operations', () => {
    it('should handle multiple sequential adds correctly', () => {
      let cart: CartInterface[] = [];

      // First add
      addToCart(mockProduct as ProductInterface, 1, cart, mockSetValue, 'en');
      cart = mockSetValue.mock.calls[0][0];

      // Second add - same product
      addToCart(mockProduct as ProductInterface, 2, cart, mockSetValue, 'en');
      cart = mockSetValue.mock.calls[1][0];

      expect(cart[0].quantity).toBe(3);
    });

    it('should handle adding multiple different products', () => {
      let cart: CartInterface[] = [];

      // Add first product
      addToCart(mockProduct as ProductInterface, 1, cart, mockSetValue, 'en');
      cart = mockSetValue.mock.calls[0][0];

      // Add second product
      addToCart(mockProductOnSale as ProductInterface, 2, cart, mockSetValue, 'en');
      cart = mockSetValue.mock.calls[1][0];

      expect(cart).toHaveLength(2);
      expect(cart[0].quantity).toBe(1);
      expect(cart[1].quantity).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle adding product with zero quantity', () => {
      const emptyCart: CartInterface[] = [];

      addToCart(mockProduct as ProductInterface, 0, emptyCart, mockSetValue, 'en');

      const cartUpdate = mockSetValue.mock.calls[0][0];
      expect(cartUpdate[0].quantity).toBe(0);
    });

    it('should handle large quantities', () => {
      const emptyCart: CartInterface[] = [];

      addToCart(mockProduct as ProductInterface, 999, emptyCart, mockSetValue, 'en');

      const cartUpdate = mockSetValue.mock.calls[0][0];
      expect(cartUpdate[0].quantity).toBe(999);
    });

    it('should handle cart with many products', () => {
      const largeCart: CartInterface[] = Array.from({ length: 50 }, (_, i) => ({
        productId: `PROD${i}`,
        quantity: 1,
      }));

      addToCart(mockProduct as ProductInterface, 1, largeCart, mockSetValue, 'en');

      const cartUpdate = mockSetValue.mock.calls[0][0];
      expect(cartUpdate).toHaveLength(51);
    });
  });
});
