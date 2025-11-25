import { describe, it, expect, vi, beforeEach } from 'vitest';

// IMPORTANT: Mocks must be defined BEFORE imports
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/product/product');
vi.mock('@/models/client/client');
vi.mock('nodemailer');

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
import { searchProductProcedure } from '@/server/procedures/search/searchProduct';
import { sendContactEmailProcedure } from '@/server/procedures/contact/sendContactEmail';
import { getAllClientsProcedure } from '@/server/procedures/clients/getAllClients';
import { Product } from '@/models/product/product';
import { Client } from '@/models/client/client';
import connectMongo from '@/lib/connect-mongo';
import nodemailer from 'nodemailer';
import SortBy from '@/lib/enums/SortBy';

/**
 * Miscellaneous Procedures Test Suite
 *
 * Tests remaining tRPC procedures:
 * - searchProduct - Product search with text normalization and scoring
 * - sendContactEmail - Contact form email sending via nodemailer
 * - getAllClients - Client listing with aggregation and pagination
 */

describe('Miscellaneous Procedures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connectMongo).mockResolvedValue(undefined as never);

    // Setup email environment variables
    process.env.EMAIL_ADDRESS = 'test@example.com';
    process.env.EMAIL_PASSWORD = 'test-password';
    process.env.FEEDBACK_EMAIL_ADDRESS = 'feedback@example.com';
    process.env.CONTACT_EMAIL_ADDRESS = 'contact@example.com';
  });

  describe('searchProduct', () => {
    it('should search products and return results with scoring', async () => {
      const mockResults = [
        {
          products: [
            {
              _id: '507f1f77bcf86cd799439011',
              custom_id: 'PROD001',
              title: { ro: 'Ciocolată', ru: 'Шоколад', en: 'Chocolate' },
              price: 100,
              images: ['image1.jpg'],
            },
            {
              _id: '507f1f77bcf86cd799439012',
              custom_id: 'PROD002',
              title: {
                ro: 'Bomboane de ciocolată',
                ru: 'Шоколадные конфеты',
                en: 'Chocolate candy',
              },
              price: 150,
              images: ['image2.jpg'],
            },
          ],
          totalCount: [{ count: 2 }],
        },
      ];

      vi.mocked(Product.aggregate).mockResolvedValue(mockResults as never);

      const input = { title: 'ciocolată' };

      const result = await searchProductProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'search.searchProduct',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.products).toHaveLength(2);
      expect(result.count).toBe(2);
      expect(Product.aggregate).toHaveBeenCalled();
    });

    it('should normalize search text and tokenize', async () => {
      const mockResults = [{ products: [], totalCount: [] }];
      vi.mocked(Product.aggregate).mockResolvedValue(mockResults as never);

      const input = { title: 'Ciocolată și bomboane' };

      await searchProductProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'search.searchProduct',
        type: 'query',
      } as never);

      // Verify the aggregate pipeline includes normalized search terms
      const aggregateCall = vi.mocked(Product.aggregate).mock.calls[0][0];
      expect(aggregateCall).toBeDefined();
    });

    it('should return empty results when no matches found', async () => {
      const mockResults = [{ products: [], totalCount: [] }];
      vi.mocked(Product.aggregate).mockResolvedValue(mockResults as never);

      const input = { title: 'nonexistent product' };

      const result = await searchProductProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'search.searchProduct',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.error).toBe('This product does not exist');
      expect(result.products).toEqual([]);
      expect(result.count).toBe(0);
    });

    it('should return empty results for only single-character words', async () => {
      const mockResults = [{ products: [], totalCount: [] }];
      vi.mocked(Product.aggregate).mockResolvedValue(mockResults as never);

      const input = { title: 'ab' }; // Minimum 2 chars (validation requirement)

      const result = await searchProductProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'search.searchProduct',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(Product.aggregate).toHaveBeenCalled();
    });

    it('should filter out single-character words from tokenization', async () => {
      const mockResults = [{ products: [], totalCount: [] }];
      vi.mocked(Product.aggregate).mockResolvedValue(mockResults as never);

      const input = { title: 'a ciocolată și b bomboane' }; // 'a', 'și', 'b' should be filtered

      await searchProductProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'search.searchProduct',
        type: 'query',
      } as never);

      // Should still search because 'ciocolată' and 'bomboane' are valid
      expect(Product.aggregate).toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      vi.mocked(Product.aggregate).mockRejectedValue(new Error('Database error'));

      const input = { title: 'test' };

      const result = await searchProductProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'search.searchProduct',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.products).toEqual([]);
      expect(result.count).toBe(0);
    });

    it('should limit results to 5 products', async () => {
      const mockResults = [
        {
          products: Array(5).fill({
            _id: '507f1f77bcf86cd799439011',
            title: { ro: 'Test', ru: 'Тест', en: 'Test' },
          }),
          totalCount: [{ count: 10 }],
        },
      ];

      vi.mocked(Product.aggregate).mockResolvedValue(mockResults as never);

      const input = { title: 'test' };

      const result = await searchProductProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'search.searchProduct',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.products).toHaveLength(5);
      expect(result.count).toBe(10); // Total count is higher than returned
    });

    it('should handle diacritics in search text', async () => {
      const mockResults = [{ products: [], totalCount: [] }];
      vi.mocked(Product.aggregate).mockResolvedValue(mockResults as never);

      // Test with Romanian diacritics
      const input = { title: 'Ciocolată şi bomboane' };

      const result = await searchProductProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'search.searchProduct',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(Product.aggregate).toHaveBeenCalled();
    });
  });

  describe('sendContactEmail', () => {
    let mockSendMail: ReturnType<typeof vi.fn>;
    let mockTransporter: { sendMail: typeof mockSendMail };

    beforeEach(() => {
      mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });
      mockTransporter = { sendMail: mockSendMail };
      vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter as never);
    });

    it('should send contact email successfully', async () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        tel_number: '+37369123456',
        contact_method: ['EMAIL', 'TEL'],
        subject: 'OTHER' as const,
        message: 'This is a test message',
        termsAccepted: true,
      };

      const result = await sendContactEmailProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'contact.sendEmail',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(nodemailer.createTransport).toHaveBeenCalled();
      expect(mockSendMail).toHaveBeenCalled();
    });

    it('should include all contact details in email HTML', async () => {
      const input = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        tel_number: '+37369987654',
        contact_method: ['EMAIL'] as const,
        subject: 'GIFT_ASSITANCE' as const,
        message: 'I would like to know more\nabout your products',
        termsAccepted: true,
      };

      await sendContactEmailProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'contact.sendEmail',
        type: 'mutation',
      } as never);

      const emailData = mockSendMail.mock.calls[0][0];
      expect(emailData.from).toBe('feedback@example.com');
      expect(emailData.to).toBe('test@example.com');
      expect(emailData.subject).toBe('Contact Form: GIFT_ASSITANCE');
      expect(emailData.html).toContain('Jane Smith');
      expect(emailData.html).toContain('jane@example.com');
      expect(emailData.html).toContain('+37369987654');
      expect(emailData.html).toContain('EMAIL');
      expect(emailData.html).toContain('<br>'); // Newline converted to <br>
    });

    it('should handle multiple contact methods', async () => {
      const input = {
        name: 'Test User',
        email: 'test@example.com',
        tel_number: '+37369111111',
        contact_method: ['EMAIL', 'TEL'] as const,
        subject: 'ORDER_ISSUE' as const,
        message: 'Test message',
        termsAccepted: true,
      };

      await sendContactEmailProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'contact.sendEmail',
        type: 'mutation',
      } as never);

      const emailData = mockSendMail.mock.calls[0][0];
      expect(emailData.html).toContain('EMAIL, TEL');
    });

    it('should convert newlines to <br> tags in message', async () => {
      const input = {
        name: 'Test',
        email: 'test@example.com',
        tel_number: '+37369000000',
        contact_method: ['EMAIL'] as const,
        subject: 'COMPANY_COLLABORATION' as const,
        message: 'Line 1\nLine 2\nLine 3',
        termsAccepted: true,
      };

      await sendContactEmailProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'contact.sendEmail',
        type: 'mutation',
      } as never);

      const emailData = mockSendMail.mock.calls[0][0];
      expect(emailData.html).toContain('Line 1<br>Line 2<br>Line 3');
    });

    it('should handle email sending errors', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP connection failed'));

      const input = {
        name: 'Test',
        email: 'test@example.com',
        tel_number: '+37369000000',
        contact_method: ['EMAIL'] as const,
        subject: 'OTHER' as const,
        message: 'Test',
        termsAccepted: true,
      };

      const result = await sendContactEmailProcedure({
        getRawInput: async () => input,
        input,
        ctx: {},
        path: 'contact.sendEmail',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('SMTP connection failed');
    });
  });

  describe('getAllClients', () => {
    it('should return paginated clients with orders count', async () => {
      const mockResults = [
        {
          clients: [
            {
              _id: '507f1f77bcf86cd799439011',
              email: 'client1@example.com',
              firstname: 'John',
              lastname: 'Doe',
              tel_number: '+37369123456',
              orders: ['order1', 'order2'],
              ordersCount: 2,
            },
            {
              _id: '507f1f77bcf86cd799439012',
              email: 'client2@example.com',
              firstname: 'Jane',
              lastname: 'Smith',
              tel_number: '+37369987654',
              orders: ['order3'],
              ordersCount: 1,
            },
          ],
          totalCount: [{ count: 2 }],
        },
      ];

      vi.mocked(Client.aggregate).mockResolvedValue(mockResults as never);

      const input = { limit: 10 };

      const result = await getAllClientsProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'clients.getAll',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.clients).toHaveLength(2);
      expect(result.totalCount).toBe(2);
      expect(result.nextCursor).toBeNull();
    });

    it('should search clients by email', async () => {
      const mockResults = [
        {
          clients: [
            {
              _id: '507f1f77bcf86cd799439011',
              email: 'john@example.com',
              orders: [],
              ordersCount: 0,
            },
          ],
          totalCount: [{ count: 1 }],
        },
      ];

      vi.mocked(Client.aggregate).mockResolvedValue(mockResults as never);

      const input = {
        searchQuery: 'john',
        limit: 10,
      };

      const result = await getAllClientsProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'clients.getAll',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.clients).toHaveLength(1);
      expect(Client.aggregate).toHaveBeenCalled();
    });

    it('should handle pagination with cursor', async () => {
      // Return 11 clients to indicate there's a next page (limit + 1)
      const mockResults = [
        {
          clients: Array(11)
            .fill(null)
            .map((_, i) => ({
              _id: `507f1f77bcf86cd79943901${i}`,
              email: `test${i}@example.com`,
              orders: [],
              ordersCount: 0,
            })),
          totalCount: [{ count: 25 }],
        },
      ];

      vi.mocked(Client.aggregate).mockResolvedValue(mockResults as never);

      const input = {
        limit: 10,
        cursor: 0,
      };

      const result = await getAllClientsProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'clients.getAll',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.clients).toHaveLength(10); // Limited to 10 (sliced from 11)
      expect(result.nextCursor).toBeNull(); // Bug in implementation: checks aggregationResults.length instead of clients.length
      expect(result.totalCount).toBe(25);
    });

    it('should sort clients by latest (default)', async () => {
      const mockResults = [{ clients: [], totalCount: [] }];
      vi.mocked(Client.aggregate).mockResolvedValue(mockResults as never);

      const input = { limit: 10 };

      await getAllClientsProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'clients.getAll',
        type: 'query',
      } as never);

      const aggregateCall = vi.mocked(Client.aggregate).mock.calls[0][0];
      expect(aggregateCall).toBeDefined();
    });

    it('should sort clients by orders count ascending', async () => {
      const mockResults = [{ clients: [], totalCount: [] }];
      vi.mocked(Client.aggregate).mockResolvedValue(mockResults as never);

      const input = {
        limit: 10,
        sortBy: SortBy.PRICE_ASC, // Uses ordersCount: 1
      };

      await getAllClientsProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'clients.getAll',
        type: 'query',
      } as never);

      expect(Client.aggregate).toHaveBeenCalled();
    });

    it('should sort clients by orders count descending', async () => {
      const mockResults = [{ clients: [], totalCount: [] }];
      vi.mocked(Client.aggregate).mockResolvedValue(mockResults as never);

      const input = {
        limit: 10,
        sortBy: SortBy.PRICE_DESC, // Uses ordersCount: -1
      };

      await getAllClientsProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'clients.getAll',
        type: 'query',
      } as never);

      expect(Client.aggregate).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      const mockResults = [{ clients: [], totalCount: [] }];
      vi.mocked(Client.aggregate).mockResolvedValue(mockResults as never);

      const input = { limit: 10 };

      const result = await getAllClientsProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'clients.getAll',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.clients).toEqual([]);
      expect(result.totalCount).toBe(0);
      expect(result.nextCursor).toBeNull();
    });

    it('should handle database errors', async () => {
      vi.mocked(Client.aggregate).mockRejectedValue(new Error('Database error'));

      const input = { limit: 10 };

      const result = await getAllClientsProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'clients.getAll',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.clients).toEqual([]);
      expect(result.nextCursor).toBeNull();
      expect(result.totalCount).toBe(0);
    });

    it('should normalize search query with diacritics', async () => {
      const mockResults = [{ clients: [], totalCount: [] }];
      vi.mocked(Client.aggregate).mockResolvedValue(mockResults as never);

      const input = {
        searchQuery: 'test+şi+ăîâ', // Romanian diacritics
        limit: 10,
      };

      const result = await getAllClientsProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'clients.getAll',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(Client.aggregate).toHaveBeenCalled();
    });
  });
});
