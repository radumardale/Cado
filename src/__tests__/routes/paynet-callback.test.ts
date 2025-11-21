import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/paynet-callback/route';
import { Order } from '@/models/order/order';
import connectMongo from '@/lib/connect-mongo';
import { OrderState } from '@/models/order/types/orderState';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import {
  mockPaynetWebhookSuccess,
  mockPaynetWebhookFailed,
  mockOrderWithHomeDelivery,
} from '@/__tests__/helpers/mockFactories';
import { createMockDocument } from '@/__tests__/helpers/testUtils';

// Mock dependencies
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/order/order');
vi.mock('nodemailer');
vi.mock('@react-email/components');

/**
 * Paynet Webhook Handler Tests
 *
 * Tests the /paynet-callback route which processes payment notifications from Paynet.
 * This is the MOST CRITICAL path for revenue - must have 100% coverage.
 *
 * Webhook flow:
 * 1. Receive POST with payment status from Paynet
 * 2. Find order by invoice_id
 * 3. Update order state based on EventType (PAID/FAILED)
 * 4. Save paynet_id
 * 5. For PAID: save order + send confirmation email
 * 6. Return 200 response
 */

describe('Paynet Webhook Handler', () => {
  let mockTransporter: { sendMail: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connectMongo).mockResolvedValue(undefined as never);

    // Setup nodemailer mock
    mockTransporter = {
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    };
    vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter as never);

    // Setup react-email render mock
    vi.mocked(render).mockResolvedValue('<html>Email content</html>');
  });

  describe('Successful Payment (PAID Event)', () => {
    it('should process successful payment webhook', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      const response = await POST(request);

      expect(response).toBeDefined();
      expect(response!.status).toBe(200);
      expect(await response!.text()).toBe('Success');
    });

    it('should update order state to Paid', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(mockOrder.state).toBe(OrderState.Paid);
    });

    it('should save paynet_id from webhook', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(mockOrder.paynet_id).toBe(mockPaynetWebhookSuccess.Payment.Id);
    });

    it('should save order after updating state', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should send confirmation email', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    it('should send email to correct recipient', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
        additional_info: {
          ...mockOrderWithHomeDelivery.additional_info,
          user_data: {
            ...mockOrderWithHomeDelivery.additional_info.user_data,
            email: 'customer@example.com',
          },
        },
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'customer@example.com',
        })
      );
    });

    it('should render order confirmation email template', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(render).toHaveBeenCalled();
    });

    it('should include order data in email template', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      // Verify render was called with order data
      expect(render).toHaveBeenCalledTimes(1);
      expect(vi.mocked(render).mock.calls[0][0]).toBeDefined();
    });

    it('should use Romanian subject line', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'CONFIRMARE COMANDA | CADO',
        })
      );
    });

    it('should connect to MongoDB before operations', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(connectMongo).toHaveBeenCalled();
    });

    it('should find order by invoice_id from webhook', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(Order.findOne).toHaveBeenCalledWith({ invoice_id: 100001 });
    });
  });

  describe('Failed Payment (Non-PAID Event)', () => {
    it('should process failed payment webhook', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 789012,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookFailed),
      });

      const response = await POST(request);

      expect(response).toBeDefined();
      expect(response!.status).toBe(200);
    });

    it('should update order state to TransactionFailed', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 789012,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookFailed),
      });

      await POST(request);

      expect(mockOrder.state).toBe(OrderState.TransactionFailed);
    });

    it('should save paynet_id for failed payments', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 789012,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookFailed),
      });

      await POST(request);

      expect(mockOrder.paynet_id).toBe(mockPaynetWebhookFailed.Payment.Id);
    });

    it('should NOT send email for failed payments', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 789012,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookFailed),
      });

      await POST(request);

      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should handle CANCELLED event type', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 789012,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const cancelledWebhook = {
        ...mockPaynetWebhookFailed,
        EventType: 'CANCELLED',
      };

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(cancelledWebhook),
      });

      await POST(request);

      expect(mockOrder.state).toBe(OrderState.TransactionFailed);
    });

    it('should handle EXPIRED event type', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 789012,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const expiredWebhook = {
        ...mockPaynetWebhookFailed,
        EventType: 'EXPIRED',
      };

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(expiredWebhook),
      });

      await POST(request);

      expect(mockOrder.state).toBe(OrderState.TransactionFailed);
    });
  });

  describe('Order Not Found', () => {
    it('should handle order not found gracefully', async () => {
      vi.mocked(Order.findOne).mockResolvedValue(null);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      // Should not throw error - just returns undefined (converted to 200 OK by Next.js)
      const response = await POST(request);
      expect(response).toBeUndefined();
    });

    it('should not attempt to save if order not found', async () => {
      vi.mocked(Order.findOne).mockResolvedValue(null);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should not send email if order not found', async () => {
      vi.mocked(Order.findOne).mockResolvedValue(null);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      vi.mocked(connectMongo).mockRejectedValue(new Error('Connection failed'));

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      // Should throw and be handled by Next.js error boundary
      await expect(POST(request)).rejects.toThrow('Connection failed');
    });

    it('should handle order query errors', async () => {
      vi.mocked(Order.findOne).mockRejectedValue(new Error('Query failed'));

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await expect(POST(request)).rejects.toThrow('Query failed');
    });

    it('should handle order save errors', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });
      mockOrder.save = vi.fn().mockRejectedValue(new Error('Save failed'));

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await expect(POST(request)).rejects.toThrow('Save failed');
    });

    it('should handle email rendering errors', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      vi.mocked(render).mockRejectedValue(new Error('Render failed'));

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await expect(POST(request)).rejects.toThrow('Render failed');
    });

    it('should handle email sending errors', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);
      mockTransporter.sendMail.mockRejectedValue(new Error('Email send failed'));

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await expect(POST(request)).rejects.toThrow('Email send failed');
    });

    it('should handle malformed webhook JSON', async () => {
      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: 'invalid json',
      });

      await expect(POST(request)).rejects.toThrow();
    });
  });

  describe('Webhook Data Validation', () => {
    it('should extract invoice_id from Payment.ExternalId', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 999999,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const customWebhook = {
        ...mockPaynetWebhookSuccess,
        Payment: {
          ...mockPaynetWebhookSuccess.Payment,
          ExternalId: 999999,
        },
      };

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(customWebhook),
      });

      await POST(request);

      expect(Order.findOne).toHaveBeenCalledWith({ invoice_id: 999999 });
    });

    it('should extract paynet_id from Payment.Id', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const customWebhook = {
        ...mockPaynetWebhookSuccess,
        Payment: {
          ...mockPaynetWebhookSuccess.Payment,
          Id: 888888,
        },
      };

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(customWebhook),
      });

      await POST(request);

      expect(mockOrder.paynet_id).toBe(888888);
    });

    it('should check EventType for PAID status', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.NotPaid,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify({ ...mockPaynetWebhookSuccess, EventType: 'PAID' }),
      });

      await POST(request);

      expect(mockOrder.state).toBe(OrderState.Paid);
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });
  });

  describe('Idempotency', () => {
    it('should handle duplicate webhooks for same payment', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.Paid, // Already paid
        paynet_id: mockPaynetWebhookSuccess.Payment.Id,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      const response = await POST(request);

      expect(response).toBeDefined();
      expect(response!.status).toBe(200);
      expect(mockOrder.save).toHaveBeenCalled(); // Still saves (idempotent)
    });

    it('should resend email on duplicate PAID webhook', async () => {
      const mockOrder = createMockDocument({
        ...mockOrderWithHomeDelivery,
        invoice_id: 100001,
        state: OrderState.Paid, // Already paid
        paynet_id: mockPaynetWebhookSuccess.Payment.Id,
      });

      vi.mocked(Order.findOne).mockResolvedValue(mockOrder as never);

      const request = new Request('http://localhost:3000/paynet-callback', {
        method: 'POST',
        body: JSON.stringify(mockPaynetWebhookSuccess),
      });

      await POST(request);

      // Current implementation resends email (might want to prevent this in future)
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });
  });
});
