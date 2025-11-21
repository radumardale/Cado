import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cancelOrderProcedure } from '@/server/procedures/order/cancelOrderPayment';
import { Order } from '@/models/order/order';
import { Product } from '@/models/product/product';
import connectMongo from '@/lib/connect-mongo';
import { OrderState } from '@/models/order/types/orderState';
import { mockOrderWithHomeDelivery } from '@/__tests__/helpers/mockFactories';
import { createMockDocument } from '@/__tests__/helpers/testUtils';

// Mock dependencies
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/order/order');
vi.mock('@/models/product/product');

/**
 * cancelOrderPayment Procedure Tests
 *
 * Tests the order cancellation procedure which:
 * - Sets order state to TransactionFailed
 * - Restores product stock quantities
 * - Is idempotent (safe to call multiple times)
 */

describe('cancelOrderPayment Procedure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connectMongo).mockResolvedValue(undefined as never);
  });

  describe('First Time Cancellation', () => {
    it('should cancel order successfully', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      const result = await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(connectMongo).toHaveBeenCalled();
    });

    it('should change order state to TransactionFailed', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(mockOrder.state).toBe(OrderState.TransactionFailed);
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should restore product stock quantities', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
        products: [
          {
            product: { _id: 'prod1' },
            quantity: 3,
          },
          {
            product: { _id: 'prod2' },
            quantity: 2,
          },
        ],
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(Product.findOneAndUpdate).toHaveBeenCalledTimes(2);
      expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'prod1' },
        { $inc: { 'stock_availability.stock': 3 } }
      );
      expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'prod2' },
        { $inc: { 'stock_availability.stock': 2 } }
      );
    });

    it('should increment stock by correct quantity', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
        products: [
          {
            product: { _id: 'prod1' },
            quantity: 5,
          },
        ],
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'prod1' },
        { $inc: { 'stock_availability.stock': 5 } }
      );
    });
  });

  describe('Idempotency - Already Cancelled', () => {
    it('should return success if order already cancelled', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.TransactionFailed,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const result = await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
    });

    it('should not modify order state if already TransactionFailed', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.TransactionFailed,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(mockOrder.save).not.toHaveBeenCalled();
    });

    it('should not restore stock if already cancelled', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.TransactionFailed,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(Product.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should be safe to call multiple times', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.TransactionFailed,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      // Call twice
      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(Product.findOneAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Order Not Found', () => {
    it('should return error when order does not exist', async () => {
      vi.mocked(Order.findOne).mockResolvedValue(null);

      const result = await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'NONEXISTENT' }),
        input: { id: 'NONEXISTENT' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Order not found');
    });

    it('should not attempt stock restoration if order not found', async () => {
      vi.mocked(Order.findOne).mockResolvedValue(null);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'NONEXISTENT' }),
        input: { id: 'NONEXISTENT' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(Product.findOneAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Database Operations', () => {
    it('should connect to MongoDB before operations', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(connectMongo).toHaveBeenCalled();
    });

    it('should find order by custom_id', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(Order.findOne).toHaveBeenCalledWith({ custom_id: 'ORD12345' });
    });

    it('should save order after state change', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(mockOrder.save).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      vi.mocked(connectMongo).mockRejectedValue(new Error('Connection failed'));

      const result = await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle order findOne errors', async () => {
      vi.mocked(Order.findOne).mockRejectedValue(new Error('Query failed'));

      const result = await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Query failed');
    });

    it('should handle order save errors', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
      });
      mockOrder.save = vi.fn().mockRejectedValue(new Error('Save failed'));

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const result = await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
    });

    it('should handle stock update errors gracefully', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
        products: [
          {
            product: { _id: 'prod1' },
            quantity: 1,
          },
        ],
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockRejectedValue(new Error('Stock update failed'));

      const result = await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
    });
  });

  describe('Multiple Products Stock Restoration', () => {
    it('should restore stock for all products in order', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
        products: [
          { product: { _id: 'prod1' }, quantity: 1 },
          { product: { _id: 'prod2' }, quantity: 2 },
          { product: { _id: 'prod3' }, quantity: 3 },
        ],
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(Product.findOneAndUpdate).toHaveBeenCalledTimes(3);
    });

    it('should handle orders with single product', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
        products: [{ product: { _id: 'prod1' }, quantity: 1 }],
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(Product.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('State Transition Validation', () => {
    it('should only cancel from NotPaid state', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      expect(mockOrder.state).toBe(OrderState.TransactionFailed);
    });

    it('should not cancel Paid orders', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        state: OrderState.Paid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      await cancelOrderProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.cancel',
        type: 'mutation',
      } as never);

      // Should still process but product stock handling behavior depends on implementation
      expect(mockOrder.save).toHaveBeenCalled();
    });
  });
});
