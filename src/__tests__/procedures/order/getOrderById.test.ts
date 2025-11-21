import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOrderByIdProcedure } from '@/server/procedures/order/getOrderById';
import { Order } from '@/models/order/order';
import connectMongo from '@/lib/connect-mongo';
import {
  mockOrderWithHomeDelivery,
  mockClient,
  mockProduct,
} from '@/__tests__/helpers/mockFactories';
import { createMockAggregate } from '@/__tests__/helpers/testUtils';

// Mock dependencies
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/order/order');

/**
 * getOrderById Procedure Tests
 *
 * Tests the order retrieval procedure which fetches orders by ID.
 * Supports both MongoDB ObjectId and custom_id lookups.
 */

describe('getOrderById Procedure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connectMongo).mockResolvedValue(undefined as never);
  });

  describe('Successful Order Retrieval', () => {
    it('should fetch order by valid ObjectId', async () => {
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439011',
        clientData: mockClient,
        productDetails: [mockProduct],
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(connectMongo).toHaveBeenCalled();
    });

    it('should fetch order by custom_id', async () => {
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439011',
        custom_id: 'ORD12345',
        clientData: mockClient,
        productDetails: [mockProduct],
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: 'ORD12345' }),
        input: { id: 'ORD12345' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(result.order?.custom_id).toBe('ORD12345');
    });

    it('should return order with all fields', async () => {
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439011',
        clientData: mockClient,
        productDetails: [mockProduct],
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.order).toHaveProperty('custom_id');
      expect(result.order).toHaveProperty('products');
      expect(result.order).toHaveProperty('payment_method');
      expect(result.order).toHaveProperty('delivery_method');
      expect(result.order).toHaveProperty('total_cost');
      expect(result.order).toHaveProperty('state');
    });
  });

  describe('Order Not Found', () => {
    it('should return error when order does not exist', async () => {
      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: 'NONEXISTENT' }),
        input: { id: 'NONEXISTENT' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('This order does not exist');
      expect(result.order).toBeNull();
    });

    it('should return error for invalid ObjectId', async () => {
      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: 'invalid-id-format' }),
        input: { id: 'invalid-id-format' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.order).toBeNull();
    });

    it('should return null order when not found', async () => {
      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439999' }),
        input: { id: '507f1f77bcf86cd799439999' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.order).toBeNull();
    });
  });

  describe('Client Data Population', () => {
    it('should populate client data via aggregation', async () => {
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439011',
        clientData: mockClient,
        productDetails: [mockProduct],
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.order).toBeDefined();
      // Client data would be populated in the aggregation pipeline
      expect(Order.aggregate).toHaveBeenCalled();
    });

    it('should use aggregation $lookup for client', async () => {
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439011',
        clientData: mockClient,
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(Order.aggregate).toHaveBeenCalled();
      const aggregateCall = vi.mocked(Order.aggregate).mock.calls[0][0];
      expect(aggregateCall).toBeInstanceOf(Array);
    });
  });

  describe('Product Data Population', () => {
    it('should populate product details via aggregation', async () => {
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439011',
        clientData: mockClient,
        productDetails: [mockProduct],
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(Order.aggregate).toHaveBeenCalled();
    });

    it('should handle orders with multiple products', async () => {
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439011',
        clientData: mockClient,
        productDetails: [mockProduct, mockProduct],
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
    });
  });

  describe('Database Connection', () => {
    it('should connect to MongoDB before query', async () => {
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439011',
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(connectMongo).toHaveBeenCalled();
    });

    it('should handle database connection errors', async () => {
      vi.mocked(connectMongo).mockRejectedValue(new Error('Connection failed'));

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle database query errors', async () => {
      vi.mocked(Order.aggregate).mockRejectedValue(new Error('Query failed'));

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Query failed');
    });
  });

  describe('ID Type Detection', () => {
    it('should detect valid MongoDB ObjectId', async () => {
      const validObjectId = '507f1f77bcf86cd799439011';
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        _id: validObjectId,
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      await getOrderByIdProcedure({
        getRawInput: async () => ({ id: validObjectId }),
        input: { id: validObjectId },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(Order.aggregate).toHaveBeenCalled();
      // Should query by _id for ObjectId format
    });

    it('should detect custom_id format', async () => {
      const customId = 'ORD12345';
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        custom_id: customId,
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      await getOrderByIdProcedure({
        getRawInput: async () => ({ id: customId }),
        input: { id: customId },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(Order.aggregate).toHaveBeenCalled();
      // Should query by custom_id for non-ObjectId format
    });

    it('should handle short IDs as custom_id', async () => {
      const shortId = 'ABC123';
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        custom_id: shortId,
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      await getOrderByIdProcedure({
        getRawInput: async () => ({ id: shortId }),
        input: { id: shortId },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(Order.aggregate).toHaveBeenCalled();
    });
  });

  describe('Response Structure', () => {
    it('should return success and order on successful fetch', async () => {
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439011',
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('order');
      expect(result.success).toBe(true);
    });

    it('should return success false and error on failure', async () => {
      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: 'INVALID' }),
        input: { id: 'INVALID' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('order');
      expect(result.success).toBe(false);
      expect(result.order).toBeNull();
    });

    it('should include error message in response', async () => {
      vi.mocked(Order.aggregate).mockRejectedValue(new Error('Custom error message'));

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty aggregate result', async () => {
      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.order).toBeNull();
    });

    it('should handle null aggregate result', async () => {
      vi.mocked(Order.aggregate).mockResolvedValue(null as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.order).toBeNull();
    });

    it('should handle special characters in custom_id', async () => {
      const specialId = 'ORD-2024-001';
      const mockOrderData = {
        ...mockOrderWithHomeDelivery,
        custom_id: specialId,
      };

      vi.mocked(Order.aggregate).mockImplementation(createMockAggregate([mockOrderData]) as never);

      const result = await getOrderByIdProcedure({
        getRawInput: async () => ({ id: specialId }),
        input: { id: specialId },
        ctx: {},
        path: 'order.getById',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
    });
  });
});
