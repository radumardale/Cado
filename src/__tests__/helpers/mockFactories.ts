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

/**
 * Factory functions for creating test data with variations
 */

/**
 * Product factory with customizable fields
 */
export function createMockProduct(overrides: Partial<typeof mockProduct> = {}) {
  return {
    ...mockProduct,
    ...overrides,
  };
}

/**
 * Create multiple mock products
 */
export function createMockProducts(count: number, baseOverrides: Partial<typeof mockProduct> = {}) {
  return Array.from({ length: count }, (_, i) =>
    createMockProduct({
      ...baseOverrides,
      _id: `507f1f77bcf86cd79943${String(i).padStart(4, '0')}`,
      custom_id: `PROD${String(i + 1).padStart(3, '0')}`,
      title: {
        ro: `Produs ${i + 1}`,
        ru: `Продукт ${i + 1}`,
        en: `Product ${i + 1}`,
      },
    })
  );
}

/**
 * Blog post factory
 */
export function createMockBlog(
  overrides: Partial<{
    _id: string;
    title: { ro: string; ru: string; en: string };
    image: string;
    tag: string;
    date: Date;
    sections: Array<{
      subtitle: { ro: string; ru: string; en: string };
      content: { ro: string; ru: string; en: string };
    }>;
    section_images: Array<{ image: string; index: number }>;
  }> = {}
) {
  return {
    _id: '607f1f77bcf86cd799439011',
    title: {
      ro: 'Blog Post Test',
      ru: 'Тестовый пост',
      en: 'Test Blog Post',
    },
    image: 'https://d3rus23k068yq9.cloudfront.net/BLOG/607f1f77bcf86cd799439011/main.jpg',
    tag: 'NEWS',
    date: new Date('2024-01-01'),
    sections: [
      {
        subtitle: {
          ro: 'Subtitlu',
          ru: 'Подзаголовок',
          en: 'Subtitle',
        },
        content: {
          ro: '<p>Conținut blog în română</p>',
          ru: '<p>Содержание блога на русском</p>',
          en: '<p>Blog content in English</p>',
        },
      },
    ],
    section_images: [],
    ...overrides,
  };
}

/**
 * Create multiple mock blogs
 */
export function createMockBlogs(count: number) {
  return Array.from({ length: count }, (_, i) =>
    createMockBlog({
      _id: `607f1f77bcf86cd79943${String(i).padStart(4, '0')}`,
      title: {
        ro: `Postare Blog ${i + 1}`,
        ru: `Пост блога ${i + 1}`,
        en: `Blog Post ${i + 1}`,
      },
      tag: i % 2 === 0 ? 'NEWS' : 'RECOMMENDATIONS',
    })
  );
}

/**
 * Home Banner factory
 */
export function createMockHomeBanner(
  overrides: Partial<{
    _id: string;
    title: { ro: string; ru: string; en: string };
    link: { ro: string; ru: string; en: string };
    images: { desktop: string; mobile: string };
  }> = {}
) {
  return {
    _id: '707f1f77bcf86cd799439011',
    title: {
      ro: 'Banner Test',
      ru: 'Тестовый баннер',
      en: 'Test Banner',
    },
    link: {
      ro: '/ro/catalog',
      ru: '/ru/catalog',
      en: '/en/catalog',
    },
    images: {
      desktop: 'https://d3rus23k068yq9.cloudfront.net/BANNER/707f/desktop.jpg',
      mobile: 'https://d3rus23k068yq9.cloudfront.net/BANNER/707f/mobile.jpg',
    },
    ...overrides,
  };
}

/**
 * Season Catalog factory
 */
export function createMockSeasonCatalog(
  overrides: Partial<{
    _id: string;
    active: boolean;
    link: { ro: string; ru: string; en: string };
  }> = {}
) {
  return {
    _id: '807f1f77bcf86cd799439011',
    active: true,
    link: {
      ro: '/ro/catalog',
      ru: '/ru/catalog',
      en: '/en/catalog',
    },
    ...overrides,
  };
}

/**
 * Home Occasion factory
 */
export function createMockHomeOcasion(
  overrides: Partial<{
    _id: string;
    ocasion: string;
    title: { ro: string; ru: string; en: string };
  }> = {}
) {
  return {
    _id: '907f1f77bcf86cd799439011',
    ocasion: 'VALENTINE',
    title: {
      ro: 'Ziua Îndrăgostiților',
      ru: 'День Святого Валентина',
      en: "Valentine's Day",
    },
    ...overrides,
  };
}

/**
 * Image upload link factory
 */
export function createMockImageLink(destination: string, id: string, hash: string = 'abc123') {
  return `https://cadomd.s3.eu-north-1.amazonaws.com/${destination}/${id}/${hash}.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=TESTKEY&X-Amz-Date=20240101T120000Z&X-Amz-Expires=3600&X-Amz-Signature=testsignature&X-Amz-SignedHeaders=host`;
}
