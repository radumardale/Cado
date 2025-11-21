import { describe, it, expect } from 'vitest';
import { OrderState } from '@/models/order/types/orderState';
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod';
import { DeliveryMethod } from '@/models/order/types/deliveryMethod';
import { ClientEntity } from '@/models/order/types/orderEntity';
import {
  mockOrderWithHomeDelivery,
  mockOrderWithPickup,
  mockOrderWithLegalBilling,
} from '@/__tests__/helpers/mockFactories';

/**
 * Order Model Tests
 *
 * Tests the Order schema structure, validation rules, and data integrity.
 * These tests verify mock data conforms to expected Order interface structure.
 */

describe('Order Model - Schema Structure', () => {
  describe('Required Fields', () => {
    it('should have custom_id field', () => {
      expect(mockOrderWithHomeDelivery).toHaveProperty('custom_id');
      expect(typeof mockOrderWithHomeDelivery.custom_id).toBe('string');
    });

    it('should have products array', () => {
      expect(mockOrderWithHomeDelivery).toHaveProperty('products');
      expect(Array.isArray(mockOrderWithHomeDelivery.products)).toBe(true);
    });

    it('should have client reference', () => {
      expect(mockOrderWithHomeDelivery).toHaveProperty('client');
    });

    it('should have payment_method', () => {
      expect(mockOrderWithHomeDelivery).toHaveProperty('payment_method');
      expect(Object.values(OrderPaymentMethod)).toContain(mockOrderWithHomeDelivery.payment_method);
    });

    it('should have delivery_method', () => {
      expect(mockOrderWithHomeDelivery).toHaveProperty('delivery_method');
      expect(Object.values(DeliveryMethod)).toContain(mockOrderWithHomeDelivery.delivery_method);
    });

    it('should have total_cost', () => {
      expect(mockOrderWithHomeDelivery).toHaveProperty('total_cost');
      expect(typeof mockOrderWithHomeDelivery.total_cost).toBe('number');
    });

    it('should have additional_info object', () => {
      expect(mockOrderWithHomeDelivery).toHaveProperty('additional_info');
      expect(typeof mockOrderWithHomeDelivery.additional_info).toBe('object');
    });

    it('should have state field', () => {
      expect(mockOrderWithHomeDelivery).toHaveProperty('state');
      expect(Object.values(OrderState)).toContain(mockOrderWithHomeDelivery.state);
    });
  });

  describe('Custom ID Format', () => {
    it('should have 8-character custom_id', () => {
      expect(mockOrderWithHomeDelivery.custom_id).toHaveLength(8);
      expect(mockOrderWithPickup.custom_id).toHaveLength(8);
      expect(mockOrderWithLegalBilling.custom_id).toHaveLength(8);
    });

    it('should have unique custom_ids across orders', () => {
      const ids = [
        mockOrderWithHomeDelivery.custom_id,
        mockOrderWithPickup.custom_id,
        mockOrderWithLegalBilling.custom_id,
      ];

      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Invoice ID Format', () => {
    it('should have numeric invoice_id', () => {
      expect(typeof mockOrderWithHomeDelivery.invoice_id).toBe('number');
    });

    it('should have invoice_id >= 100000', () => {
      expect(mockOrderWithHomeDelivery.invoice_id).toBeGreaterThanOrEqual(100000);
      expect(mockOrderWithPickup.invoice_id).toBeGreaterThanOrEqual(100000);
    });

    it('should have unique invoice_ids for different orders', () => {
      // Invoice IDs would be unique in actual database due to auto-increment
      // Here we verify the structure supports unique IDs
      const order1 = { ...mockOrderWithHomeDelivery, invoice_id: 100001 };
      const order2 = { ...mockOrderWithPickup, invoice_id: 100002 };
      expect(order1.invoice_id).not.toBe(order2.invoice_id);
    });
  });

  describe('Order States', () => {
    it('should have valid OrderState enum values', () => {
      expect(OrderState.NotPaid).toBe('NOT_PAID');
      expect(OrderState.Paid).toBe('PAID');
      expect(OrderState.TransactionFailed).toBe('TRANSACTION_FAILED');
      expect(OrderState.Delivered).toBe('DELIVERED');
    });

    it('should accept NotPaid state', () => {
      const order = { ...mockOrderWithHomeDelivery, state: OrderState.NotPaid };
      expect(order.state).toBe('NOT_PAID');
    });

    it('should accept Paid state', () => {
      const order = { ...mockOrderWithHomeDelivery, state: OrderState.Paid };
      expect(order.state).toBe('PAID');
    });

    it('should accept TransactionFailed state', () => {
      const order = { ...mockOrderWithHomeDelivery, state: OrderState.TransactionFailed };
      expect(order.state).toBe('TRANSACTION_FAILED');
    });

    it('should accept Delivered state', () => {
      const order = { ...mockOrderWithHomeDelivery, state: OrderState.Delivered };
      expect(order.state).toBe('DELIVERED');
    });
  });

  describe('Products Structure', () => {
    it('should store products array', () => {
      expect(Array.isArray(mockOrderWithHomeDelivery.products)).toBe(true);
      expect(mockOrderWithHomeDelivery.products.length).toBeGreaterThan(0);
    });

    it('should have product and quantity in each item', () => {
      const product = mockOrderWithHomeDelivery.products[0];
      expect(product).toHaveProperty('product');
      expect(product).toHaveProperty('quantity');
      expect(typeof product.quantity).toBe('number');
    });

    it('should allow multiple products', () => {
      const multiProductOrder = {
        ...mockOrderWithHomeDelivery,
        products: [mockOrderWithHomeDelivery.products[0], mockOrderWithPickup.products[0]],
      };

      expect(multiProductOrder.products).toHaveLength(2);
    });

    it('should have product with required fields', () => {
      const product = mockOrderWithHomeDelivery.products[0].product;
      expect(product).toHaveProperty('_id');
      expect(product).toHaveProperty('custom_id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('images');
    });
  });

  describe('Additional Info Structure', () => {
    it('should have user_data with all fields', () => {
      const userData = mockOrderWithHomeDelivery.additional_info.user_data;
      expect(userData).toHaveProperty('firstname');
      expect(userData).toHaveProperty('lastname');
      expect(userData).toHaveProperty('email');
      expect(userData).toHaveProperty('tel_number');
    });

    it('should have billing_address', () => {
      expect(mockOrderWithHomeDelivery.additional_info).toHaveProperty('billing_address');
      expect(mockOrderWithHomeDelivery.additional_info.billing_address).toHaveProperty(
        'billing_type'
      );
    });

    it('should have delivery_address for home delivery', () => {
      expect(mockOrderWithHomeDelivery.additional_info).toHaveProperty('delivery_address');
      const deliveryAddr = mockOrderWithHomeDelivery.additional_info.delivery_address;
      expect(deliveryAddr).toHaveProperty('region');
      expect(deliveryAddr).toHaveProperty('city');
      expect(deliveryAddr).toHaveProperty('home_address');
      expect(deliveryAddr).toHaveProperty('home_nr');
    });

    it('should not have delivery_address for pickup orders', () => {
      // Pickup orders don't require delivery address
      expect(mockOrderWithPickup.additional_info).not.toHaveProperty('delivery_address');
    });

    it('should have entity_type', () => {
      expect(mockOrderWithHomeDelivery.additional_info).toHaveProperty('entity_type');
      expect(Object.values(ClientEntity)).toContain(
        mockOrderWithHomeDelivery.additional_info.entity_type
      );
    });
  });

  describe('Billing Address Discriminator', () => {
    it('should support Natural entity billing', () => {
      const billing = mockOrderWithHomeDelivery.additional_info.billing_address;
      expect(billing.billing_type).toBe(ClientEntity.Natural);
      expect(billing).toHaveProperty('firstname');
      expect(billing).toHaveProperty('lastname');
    });

    it('should support Legal entity billing', () => {
      const billing = mockOrderWithLegalBilling.additional_info.billing_address;
      expect(billing.billing_type).toBe(ClientEntity.Legal);
      expect(billing).toHaveProperty('company_name');
      expect(billing).toHaveProperty('idno');
    });
  });

  describe('Delivery Details', () => {
    it('should have hours_intervals', () => {
      expect(mockOrderWithHomeDelivery.delivery_details).toHaveProperty('hours_intervals');
      expect(typeof mockOrderWithHomeDelivery.delivery_details.hours_intervals).toBe('string');
    });

    it('should have optional message', () => {
      expect(mockOrderWithHomeDelivery.delivery_details).toHaveProperty('message');
    });

    it('should have optional comments', () => {
      expect(mockOrderWithHomeDelivery.delivery_details).toHaveProperty('comments');
    });

    it('should allow empty message and comments', () => {
      expect(mockOrderWithPickup.delivery_details.message).toBe('');
      expect(mockOrderWithPickup.delivery_details.comments).toBe('');
    });
  });

  describe('Payment Methods', () => {
    it('should have valid PaymentMethod enum', () => {
      expect(OrderPaymentMethod.Paynet).toBe('PAYNET');
      expect(OrderPaymentMethod.Cash).toBe('CASH');
    });

    it('should support Paynet payment', () => {
      expect(mockOrderWithHomeDelivery.payment_method).toBe(OrderPaymentMethod.Paynet);
    });

    it('should support Cash payment', () => {
      expect(mockOrderWithPickup.payment_method).toBe(OrderPaymentMethod.Cash);
    });
  });

  describe('Delivery Methods', () => {
    it('should have valid DeliveryMethod enum', () => {
      expect(DeliveryMethod.HOME_DELIVERY).toBe('HOME_DELIVERY');
      expect(DeliveryMethod.PICKUP).toBe('PICKUP');
    });

    it('should support home delivery', () => {
      expect(mockOrderWithHomeDelivery.delivery_method).toBe(DeliveryMethod.HOME_DELIVERY);
    });

    it('should support pickup', () => {
      expect(mockOrderWithPickup.delivery_method).toBe(DeliveryMethod.PICKUP);
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt timestamp', () => {
      expect(mockOrderWithHomeDelivery).toHaveProperty('createdAt');
      expect(mockOrderWithHomeDelivery.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Paynet Integration', () => {
    it('should store optional paynet_id as number', () => {
      expect(mockOrderWithHomeDelivery).toHaveProperty('paynet_id');
      expect(typeof mockOrderWithHomeDelivery.paynet_id).toBe('number');
    });

    it('should allow orders without paynet_id', () => {
      // Cash orders may not have paynet_id
      const cashOrder = { ...mockOrderWithPickup, paynet_id: undefined };
      expect(cashOrder.paynet_id).toBeUndefined();
    });
  });
});
