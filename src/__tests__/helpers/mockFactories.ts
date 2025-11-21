import { OrderState } from '@/models/order/types/orderState';
import { OrderPaymentMethod } from '@/models/order/types/orderPaymentMethod';
import { DeliveryMethod } from '@/models/order/types/deliveryMethod';
import { ClientEntity } from '@/models/order/types/orderEntity';
import { StockState } from '@/lib/enums/StockState';
import type { ClientInterface } from '@/models/client/types/clientInterface';
import type { Types } from 'mongoose';

/**
 * Mock data factories for testing payment and order processing
 */

export const mockProduct = {
  _id: '507f1f77bcf86cd799439011',
  custom_id: 'PROD001',
  title: {
    ro: 'Produs Test',
    ru: 'Тестовый продукт',
    en: 'Test Product',
  },
  price: 100,
  stock_availability: {
    state: StockState.IN_STOCK,
    stock: 10,
  },
  images: ['https://example.com/image.jpg'],
};

export const mockProductOnSale = {
  ...mockProduct,
  custom_id: 'PROD002',
  sale: {
    active: true,
    sale_price: 80,
  },
};

export const mockClient: ClientInterface = {
  email: 'test@example.com',
  firstname: 'John',
  lastname: 'Doe',
  tel_number: '+37369123456',
  orders: [],
};

export const mockOrderBase = {
  custom_id: 'ORD12345',
  invoice_id: 100001,
  client: '507f1f77bcf86cd799439012' as unknown as Types.ObjectId,
  state: OrderState.NotPaid,
  total_cost: 100,
  createdAt: new Date('2024-01-01'),
  paynet_id: 123456,
};

export const mockOrderWithHomeDelivery = {
  ...mockOrderBase,
  products: [
    {
      product: mockProduct,
      quantity: 1,
    },
  ],
  payment_method: OrderPaymentMethod.Paynet,
  delivery_method: DeliveryMethod.HOME_DELIVERY,
  additional_info: {
    user_data: {
      firstname: 'John',
      lastname: 'Doe',
      email: 'test@example.com',
      tel_number: '+37369123456',
    },
    billing_address: {
      billing_type: ClientEntity.Natural,
      firstname: 'John',
      lastname: 'Doe',
      region: 'Chisinau',
      city: 'Chisinau',
      home_address: 'Str. Test',
      home_nr: '10',
    },
    delivery_address: {
      region: 'Chisinau',
      city: 'Chisinau',
      home_address: 'Str. Test',
      home_nr: '10',
    },
    entity_type: ClientEntity.Natural,
  },
  delivery_details: {
    hours_intervals: '10:00-12:00',
    message: 'Test message',
    comments: 'Test comments',
  },
};

export const mockOrderWithPickup = {
  ...mockOrderBase,
  custom_id: 'ORD12346',
  products: [
    {
      product: mockProduct,
      quantity: 2,
    },
  ],
  payment_method: OrderPaymentMethod.Cash,
  delivery_method: DeliveryMethod.PICKUP,
  additional_info: {
    user_data: {
      firstname: 'Jane',
      lastname: 'Smith',
      email: 'jane@example.com',
      tel_number: '+37369654321',
    },
    billing_address: {
      billing_type: ClientEntity.Natural,
      firstname: 'Jane',
      lastname: 'Smith',
      region: 'Chisinau',
      city: 'Chisinau',
      home_address: 'Str. Main',
      home_nr: '20',
    },
    entity_type: ClientEntity.Natural,
  },
  delivery_details: {
    hours_intervals: '14:00-16:00',
    message: '',
    comments: '',
  },
};

export const mockOrderWithLegalBilling = {
  ...mockOrderBase,
  custom_id: 'ORD12347',
  products: [
    {
      product: mockProduct,
      quantity: 1,
    },
  ],
  payment_method: OrderPaymentMethod.Paynet,
  delivery_method: DeliveryMethod.HOME_DELIVERY,
  additional_info: {
    user_data: {
      firstname: 'Corporate',
      lastname: 'User',
      email: 'corporate@example.com',
      tel_number: '+37369111222',
    },
    billing_address: {
      billing_type: ClientEntity.Legal,
      company_name: 'Test Company SRL',
      idno: '1234567890',
      region: 'Chisinau',
      city: 'Chisinau',
      home_address: 'Str. Business',
      home_nr: '5',
    },
    delivery_address: {
      region: 'Chisinau',
      city: 'Chisinau',
      home_address: 'Str. Delivery',
      home_nr: '15',
    },
    entity_type: ClientEntity.Legal,
  },
  delivery_details: {
    hours_intervals: '09:00-11:00',
    message: 'Invoice required',
    comments: '',
  },
};

export const mockPaynetWebhookSuccess = {
  EventType: 'PAID',
  Payment: {
    Id: 123456,
    ExternalId: 100001,
    Amount: 10000,
    Currency: 498,
    Status: 'Paid',
  },
};

export const mockPaynetWebhookFailed = {
  EventType: 'DECLINED',
  Payment: {
    Id: 123457,
    ExternalId: 100002,
    Amount: 10000,
    Currency: 498,
    Status: 'Declined',
  },
};

export const mockPaynetAPIResponse = {
  PaymentId: 'PAY-123456',
  ExpiryDate: '2024-12-31T23:59:59Z',
  Signature: 'mock-signature-hash',
  Status: 'Success',
};

export const mockSession = {
  user: {
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  expires: '2025-12-31',
};

export const mockAddOrderRequest = {
  products: [
    {
      product: mockProduct,
      quantity: 1,
    },
  ],
  additional_info: {
    user_data: {
      firstname: 'John',
      lastname: 'Doe',
      email: 'test@example.com',
      tel_number: '+37369123456',
    },
    billing_address: {
      billing_type: ClientEntity.Natural,
      firstname: 'John',
      lastname: 'Doe',
      region: 'Chisinau',
      city: 'Chisinau',
      home_address: 'Str. Test',
      home_nr: '10',
    },
    delivery_address: {
      region: 'Chisinau',
      city: 'Chisinau',
      home_address: 'Str. Test',
      home_nr: '10',
    },
    entity_type: ClientEntity.Natural,
    billing_checkbox: false,
  },
  payment_method: OrderPaymentMethod.Paynet,
  delivery_method: DeliveryMethod.HOME_DELIVERY,
  delivery_details: {
    hours_intervals: '10:00-12:00',
    message: 'Test message',
    comments: 'Test comments',
    delivery_date: '2024-12-25',
  },
  total_cost: 100,
  termsAccepted: true,
};

export const mockUpdateOrderRequest = {
  id: '507f1f77bcf86cd799439011',
  products: [
    {
      product: mockProduct,
      quantity: 2,
    },
  ],
  additional_info: {
    user_data: {
      firstname: 'John',
      lastname: 'Doe',
      email: 'test@example.com',
      tel_number: '+37369123456',
    },
    billing_address: {
      billing_type: ClientEntity.Natural,
      firstname: 'John',
      lastname: 'Doe',
      region: 'Chisinau',
      city: 'Chisinau',
      home_address: 'Str. Test',
      home_nr: '10',
    },
    delivery_address: {
      region: 'Chisinau',
      city: 'Chisinau',
      home_address: 'Str. Test',
      home_nr: '10',
    },
    entity_type: ClientEntity.Natural,
    billing_checkbox: false,
  },
  payment_method: OrderPaymentMethod.Cash,
  delivery_method: DeliveryMethod.PICKUP,
  delivery_details: {
    hours_intervals: '14:00-16:00',
    message: 'Updated message',
    comments: 'Updated comments',
  },
  total_cost: 200,
  state: OrderState.Paid,
};
