import { describe, it, expect, vi, beforeEach } from 'vitest';

// IMPORTANT: Mocks must be defined BEFORE imports
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/client/client');
vi.mock('@/models/order/order');
vi.mock('@/models/product/product');
vi.mock('nodemailer');
vi.mock('@react-email/components');
vi.mock('@/lib/apiCLient');

// Mock Next.js request context - required for NextAuth in tests
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
  cookies: vi.fn(() => ({ get: vi.fn(), set: vi.fn() })),
}));

// Mock NextAuth - must return a valid session for protected procedures
vi.mock('next-auth', async () => {
  const actual = await vi.importActual('next-auth');
  return {
    ...actual,
    getServerSession: vi.fn(() =>
      Promise.resolve({
        user: { email: 'admin@test.com', name: 'Admin' },
        expires: '2025-12-31',
      })
    ),
  };
});

// Now import after mocks are set up
import { addOrderProcedure } from '@/server/procedures/order/addOrder';
import { updateOrderProcedure } from '@/server/procedures/order/updateOrder';
import { deleteOrderProcedure } from '@/server/procedures/order/deleteOrder';
import { getAllOrdersProcedure } from '@/server/procedures/order/getAllOrders';
import { Client } from '@/models/client/client';
import { Order } from '@/models/order/order';
import { Product } from '@/models/product/product';
import connectMongo from '@/lib/connect-mongo';
import { createMockDocument } from '@/__tests__/helpers/testUtils';
import {
  mockAddOrderRequest,
  mockUpdateOrderRequest,
  mockOrderWithHomeDelivery,
  mockClient,
  mockProduct,
} from '@/__tests__/helpers/mockFactories';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { APIClient } from '@/lib/apiCLient';
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod';
import { OrderState } from '@/models/order/types/orderState';
import { DeliveryMethod } from '@/models/order/types/deliveryMethod';
import SortBy from '@/lib/enums/SortBy';

/**
 * Order Procedures Test Suite
 *
 * Tests remaining order-related tRPC procedures including:
 * - addOrder - Order creation with client upsert, email, stock updates, payment
 * - updateOrder - Order updates with client management
 * - deleteOrder - Order deletion
 * - getAllOrders - Admin order listing with search and filters
 */

describe('Order Procedures', () => {
  let mockTransporter: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connectMongo).mockResolvedValue(undefined as never);

    // Setup nodemailer mock
    mockTransporter = {
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
    };
    vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter as never);

    // Setup email render mock
    vi.mocked(render).mockResolvedValue('<html>Email content</html>' as never);
  });

  describe('addOrder Procedure', () => {
    const validInput = {
      ...mockAddOrderRequest,
      payment_method: OrderPaymentMethod.Cash, // Use Cash for simpler tests
      delivery_method: DeliveryMethod.PICKUP, // Cash requires PICKUP
    };

    it('should create order with client upsert', async () => {
      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: [],
        save: vi.fn().mockResolvedValue(true),
      });

      const mockOrderDoc = createMockDocument({
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439013',
        toObject: () => mockOrderWithHomeDelivery,
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.create).mockResolvedValue(mockOrderDoc as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      const result = await addOrderProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'order.addOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(Client.findOneAndUpdate).toHaveBeenCalledWith(
        { email: validInput.additional_info.user_data.email },
        expect.objectContaining({
          firstname: validInput.additional_info.user_data.firstname,
          lastname: validInput.additional_info.user_data.lastname,
        }),
        { upsert: true, new: true }
      );
      expect(Order.create).toHaveBeenCalled();
    });

    it('should send admin notification email', async () => {
      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: [],
        save: vi.fn().mockResolvedValue(true),
      });

      const mockOrderDoc = createMockDocument({
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439013',
        toObject: () => mockOrderWithHomeDelivery,
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.create).mockResolvedValue(mockOrderDoc as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      const result = await addOrderProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'order.addOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalled();
      const adminEmailCall = mockTransporter.sendMail.mock.calls[0][0];
      expect(adminEmailCall.subject).toContain('New Order');
    });

    it('should update product stock for each product', async () => {
      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: [],
        save: vi.fn().mockResolvedValue(true),
      });

      const mockOrderDoc = createMockDocument({
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439013',
        toObject: () => mockOrderWithHomeDelivery,
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.create).mockResolvedValue(mockOrderDoc as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      const result = await addOrderProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'order.addOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(Product.findOneAndUpdate).toHaveBeenCalledTimes(validInput.products.length);
      expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: validInput.products[0].product._id },
        { $inc: { 'stock_availability.stock': -validInput.products[0].quantity } }
      );
    });

    it('should initiate Paynet payment for Paynet orders', async () => {
      const paynetInput = {
        ...validInput,
        payment_method: OrderPaymentMethod.Paynet,
      };

      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: [],
        save: vi.fn().mockResolvedValue(true),
      });

      const mockOrderDoc = createMockDocument({
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439013',
        invoice_id: 100001,
        custom_id: 'ORD12345',
        toObject: () => mockOrderWithHomeDelivery,
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.create).mockResolvedValue(mockOrderDoc as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      const mockPaynetResponse = {
        json: vi.fn().mockResolvedValue({
          PaymentId: 'PAY-123456',
          ExpiryDate: '2024-12-31T23:59:59Z',
          Signature: 'mock-signature',
        }),
      };

      vi.mocked(APIClient.makeAuthenticatedRequest).mockResolvedValue(mockPaynetResponse as never);

      const result = await addOrderProcedure({
        getRawInput: async () => paynetInput,
        input: paynetInput,
        ctx: { session: {}, user: {} },
        path: 'order.addOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.paymentForm).toBeDefined();
      expect(result.paymentForm?.fields.operation).toBe('PAY-123456');
      expect(APIClient.makeAuthenticatedRequest).toHaveBeenCalled();
    });

    it('should send customer email for cash orders', async () => {
      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: [],
        save: vi.fn().mockResolvedValue(true),
      });

      const mockOrderDoc = createMockDocument({
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439013',
        toObject: () => mockOrderWithHomeDelivery,
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.create).mockResolvedValue(mockOrderDoc as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      const result = await addOrderProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'order.addOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      // Should send 2 emails: admin notification + customer confirmation
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2);
      const customerEmailCall = mockTransporter.sendMail.mock.calls[1][0];
      expect(customerEmailCall.to).toBe(validInput.additional_info.user_data.email);
    });

    it('should handle billing checkbox for delivery address', async () => {
      const inputWithBillingCheckbox = {
        ...validInput,
        additional_info: {
          ...validInput.additional_info,
          billing_checkbox: true,
        },
      };

      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: [],
        save: vi.fn().mockResolvedValue(true),
      });

      const mockOrderDoc = createMockDocument({
        ...mockOrderWithHomeDelivery,
        _id: '507f1f77bcf86cd799439013',
        toObject: () => mockOrderWithHomeDelivery,
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.create).mockResolvedValue(mockOrderDoc as never);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue({} as never);

      const result = await addOrderProcedure({
        getRawInput: async () => inputWithBillingCheckbox,
        input: inputWithBillingCheckbox,
        ctx: { session: {}, user: {} },
        path: 'order.addOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(Order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          additional_info: expect.objectContaining({
            billing_address: expect.objectContaining({
              region: inputWithBillingCheckbox.additional_info.delivery_address.region,
            }),
          }),
        })
      );
    });

    it('should handle client not found error', async () => {
      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(null as never);

      const result = await addOrderProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'order.addOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Client not found');
    });

    it('should handle order creation errors', async () => {
      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: [],
        save: vi.fn().mockResolvedValue(true),
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.create).mockRejectedValue(new Error('Database error'));

      const result = await addOrderProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'order.addOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });

  describe('updateOrder Procedure', () => {
    const validUpdateInput = mockUpdateOrderRequest;

    it('should update order successfully', async () => {
      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: ['507f1f77bcf86cd799439011'],
        save: vi.fn().mockResolvedValue(true),
      });

      const mockOrderDoc = createMockDocument({
        ...mockOrderWithHomeDelivery,
        _id: validUpdateInput.id,
        toObject: () => ({
          ...mockOrderWithHomeDelivery,
          _id: validUpdateInput.id,
        }),
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.findByIdAndUpdate).mockResolvedValue(mockOrderDoc as never);

      const result = await updateOrderProcedure({
        getRawInput: async () => validUpdateInput,
        input: validUpdateInput,
        ctx: { session: {}, user: {} },
        path: 'order.updateOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        validUpdateInput.id,
        expect.objectContaining({
          products: validUpdateInput.products,
          total_cost: validUpdateInput.total_cost,
          state: validUpdateInput.state,
        }),
        { new: true }
      );
    });

    it('should add order to client if not already present', async () => {
      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: [], // Empty - order not yet added
        save: vi.fn().mockResolvedValue(true),
      });

      const mockOrderDoc = createMockDocument({
        ...mockOrderWithHomeDelivery,
        _id: validUpdateInput.id,
        toObject: () => ({
          ...mockOrderWithHomeDelivery,
          _id: validUpdateInput.id,
        }),
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.findByIdAndUpdate).mockResolvedValue(mockOrderDoc as never);

      const result = await updateOrderProcedure({
        getRawInput: async () => validUpdateInput,
        input: validUpdateInput,
        ctx: { session: {}, user: {} },
        path: 'order.updateOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(mockClientDoc.orders).toContain(validUpdateInput.id);
      expect(mockClientDoc.save).toHaveBeenCalled();
    });

    it('should not duplicate order in client orders', async () => {
      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: [validUpdateInput.id], // Order already present
        save: vi.fn().mockResolvedValue(true),
      });

      const mockOrderDoc = createMockDocument({
        ...mockOrderWithHomeDelivery,
        _id: validUpdateInput.id,
        toObject: () => ({
          ...mockOrderWithHomeDelivery,
          _id: validUpdateInput.id,
        }),
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.findByIdAndUpdate).mockResolvedValue(mockOrderDoc as never);

      const result = await updateOrderProcedure({
        getRawInput: async () => validUpdateInput,
        input: validUpdateInput,
        ctx: { session: {}, user: {} },
        path: 'order.updateOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(mockClientDoc.save).not.toHaveBeenCalled();
    });

    it('should handle client not found', async () => {
      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(null as never);

      const result = await updateOrderProcedure({
        getRawInput: async () => validUpdateInput,
        input: validUpdateInput,
        ctx: { session: {}, user: {} },
        path: 'order.updateOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Client not found');
      expect(result.order).toBeNull();
    });

    it('should handle order not found', async () => {
      const mockClientDoc = createMockDocument({
        ...mockClient,
        _id: '507f1f77bcf86cd799439012',
        orders: [],
        save: vi.fn().mockResolvedValue(true),
      });

      vi.mocked(Client.findOneAndUpdate).mockResolvedValue(mockClientDoc as never);
      vi.mocked(Order.findByIdAndUpdate).mockResolvedValue(null as never);

      const result = await updateOrderProcedure({
        getRawInput: async () => validUpdateInput,
        input: validUpdateInput,
        ctx: { session: {}, user: {} },
        path: 'order.updateOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Order not found');
      expect(result.order).toBeNull();
    });

    it('should handle update errors', async () => {
      vi.mocked(Client.findOneAndUpdate).mockRejectedValue(new Error('Database error'));

      const result = await updateOrderProcedure({
        getRawInput: async () => validUpdateInput,
        input: validUpdateInput,
        ctx: { session: {}, user: {} },
        path: 'order.updateOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.order).toBeNull();
    });
  });

  describe('deleteOrder Procedure', () => {
    const validDeleteInput = {
      id: '507f1f77bcf86cd799439011',
    };

    it('should delete order successfully', async () => {
      vi.mocked(Order.findByIdAndDelete).mockResolvedValue({} as never);

      const result = await deleteOrderProcedure({
        getRawInput: async () => validDeleteInput,
        input: validDeleteInput,
        ctx: { session: {}, user: {} },
        path: 'order.deleteOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(Order.findByIdAndDelete).toHaveBeenCalledWith(validDeleteInput.id);
    });

    it('should handle deletion errors', async () => {
      vi.mocked(Order.findByIdAndDelete).mockRejectedValue(new Error('Database error'));

      const result = await deleteOrderProcedure({
        getRawInput: async () => validDeleteInput,
        input: validDeleteInput,
        ctx: { session: {}, user: {} },
        path: 'order.deleteOrder',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });

  describe('getAllOrders Procedure', () => {
    it('should return paginated orders', async () => {
      const mockOrders = [
        { ...mockOrderWithHomeDelivery, _id: '1' },
        { ...mockOrderWithHomeDelivery, _id: '2' },
        { ...mockOrderWithHomeDelivery, _id: '3' },
      ];

      vi.mocked(Order.aggregate).mockResolvedValue([
        {
          orders: mockOrders,
          totalCount: [{ count: 3 }],
        },
      ] as never);

      const result = await getAllOrdersProcedure({
        getRawInput: async () => ({ limit: 10 }),
        input: { limit: 10 },
        ctx: {},
        path: 'order.getAllOrders',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.orders).toHaveLength(3);
      expect(result.totalCount).toBe(3);
      expect(result.nextCursor).toBeNull();
    });

    it('should handle pagination with cursor', async () => {
      const mockOrders = Array.from({ length: 11 }, (_, i) => ({
        ...mockOrderWithHomeDelivery,
        _id: `order-${i}`,
      }));

      vi.mocked(Order.aggregate).mockResolvedValue([
        {
          orders: mockOrders,
          totalCount: [{ count: 20 }],
        },
      ] as never);

      const result = await getAllOrdersProcedure({
        getRawInput: async () => ({ limit: 10, cursor: 0 }),
        input: { limit: 10, cursor: 0 },
        ctx: {},
        path: 'order.getAllOrders',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.orders).toHaveLength(10); // Limited to 10
      expect(result.nextCursor).toBe(10); // Has next page
      expect(result.totalCount).toBe(20);
    });

    it('should filter by search query', async () => {
      const searchInput = {
        searchQuery: 'test@example.com',
        limit: 10,
      };

      vi.mocked(Order.aggregate).mockResolvedValue([
        {
          orders: [mockOrderWithHomeDelivery],
          totalCount: [{ count: 1 }],
        },
      ] as never);

      const result = await getAllOrdersProcedure({
        getRawInput: async () => searchInput,
        input: searchInput,
        ctx: {},
        path: 'order.getAllOrders',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(Order.aggregate).toHaveBeenCalled();
    });

    it('should filter by date range', async () => {
      const dateInput = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        limit: 10,
      };

      vi.mocked(Order.aggregate).mockResolvedValue([
        {
          orders: [mockOrderWithHomeDelivery],
          totalCount: [{ count: 1 }],
        },
      ] as never);

      const result = await getAllOrdersProcedure({
        getRawInput: async () => dateInput,
        input: dateInput,
        ctx: {},
        path: 'order.getAllOrders',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(Order.aggregate).toHaveBeenCalled();
    });

    it('should sort by price ascending', async () => {
      const sortInput = {
        sortBy: SortBy.PRICE_ASC,
        limit: 10,
      };

      vi.mocked(Order.aggregate).mockResolvedValue([
        {
          orders: [mockOrderWithHomeDelivery],
          totalCount: [{ count: 1 }],
        },
      ] as never);

      const result = await getAllOrdersProcedure({
        getRawInput: async () => sortInput,
        input: sortInput,
        ctx: {},
        path: 'order.getAllOrders',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(Order.aggregate).toHaveBeenCalled();
    });

    it('should sort by latest by default', async () => {
      vi.mocked(Order.aggregate).mockResolvedValue([
        {
          orders: [mockOrderWithHomeDelivery],
          totalCount: [{ count: 1 }],
        },
      ] as never);

      const result = await getAllOrdersProcedure({
        getRawInput: async () => ({ limit: 10 }),
        input: { limit: 10 },
        ctx: {},
        path: 'order.getAllOrders',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(Order.aggregate).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      vi.mocked(Order.aggregate).mockResolvedValue([
        {
          orders: [],
          totalCount: [],
        },
      ] as never);

      const result = await getAllOrdersProcedure({
        getRawInput: async () => ({ limit: 10 }),
        input: { limit: 10 },
        ctx: {},
        path: 'order.getAllOrders',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.orders).toEqual([]);
      expect(result.totalCount).toBe(0);
      expect(result.nextCursor).toBeNull();
    });

    it('should handle aggregation errors', async () => {
      vi.mocked(Order.aggregate).mockRejectedValue(new Error('Database error'));

      const result = await getAllOrdersProcedure({
        getRawInput: async () => ({ limit: 10 }),
        input: { limit: 10 },
        ctx: {},
        path: 'order.getAllOrders',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.orders).toEqual([]);
      expect(result.totalCount).toBe(0);
    });
  });
});
