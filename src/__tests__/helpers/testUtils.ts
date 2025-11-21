import { vi } from 'vitest';
import type { Query } from 'mongoose';

/**
 * Test utility functions for payment and order testing
 */

/**
 * Creates a mock Mongoose query chain that returns the provided data
 * Used for mocking Model.find(), Model.findOne(), etc.
 */
export function createMockQuery<T>(data: T): Partial<Query<unknown, unknown>> {
  return {
    select: vi.fn().mockReturnValue({
      lean: vi.fn().mockResolvedValue(data),
    }),
    lean: vi.fn().mockResolvedValue(data),
    exec: vi.fn().mockResolvedValue(data),
  } as Partial<Query<unknown, unknown>>;
}

/**
 * Creates a mock query that rejects with an error
 */
export function createMockQueryWithError(error: Error): Partial<Query<unknown, unknown>> {
  return {
    select: vi.fn().mockReturnValue({
      lean: vi.fn().mockRejectedValue(error),
    }),
    lean: vi.fn().mockRejectedValue(error),
    exec: vi.fn().mockRejectedValue(error),
  } as Partial<Query<unknown, unknown>>;
}

/**
 * Creates a mock Mongoose document with common methods
 */
export function createMockDocument<T>(data: T) {
  return {
    ...data,
    save: vi.fn().mockResolvedValue(data),
    toObject: vi.fn().mockReturnValue(data),
    _id: data && typeof data === 'object' && '_id' in data ? data._id : 'mock-id',
  };
}

/**
 * Mock nodemailer transporter
 */
export function createMockMailTransporter() {
  return {
    sendMail: vi.fn().mockResolvedValue({
      messageId: 'mock-message-id',
      accepted: ['test@example.com'],
      rejected: [],
      response: '250 Message accepted',
    }),
  };
}

/**
 * Mock nodemailer with createTransport that returns mock transporter
 */
export function setupNodemailerMock() {
  const mockTransporter = createMockMailTransporter();
  return {
    createTransport: vi.fn().mockReturnValue(mockTransporter),
    mockTransporter,
  };
}

/**
 * Mock React Email render function
 */
export function setupReactEmailMock() {
  return {
    render: vi.fn().mockResolvedValue('<html>Mock Email HTML</html>'),
  };
}

/**
 * Mock APIClient for Paynet integration
 */
export function createMockAPIClient(response: unknown) {
  return {
    makeAuthenticatedRequest: vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(response),
      status: 200,
      statusText: 'OK',
    }),
  };
}

/**
 * Mock APIClient that returns an error
 */
export function createMockAPIClientWithError(error: Error) {
  return {
    makeAuthenticatedRequest: vi.fn().mockRejectedValue(error),
  };
}

/**
 * Mock NextAuth session
 */
export function createMockSession(user?: { email: string; name: string }) {
  return {
    user: user || {
      email: 'admin@example.com',
      name: 'Admin User',
    },
    expires: '2025-12-31',
  };
}

/**
 * Mock MongoDB connection
 */
export function setupMongoMock() {
  return {
    connectMongo: vi.fn().mockResolvedValue({}),
  };
}

/**
 * Helper to create mock findOneAndUpdate response
 */
export function createMockFindOneAndUpdate<T>(data: T) {
  return vi.fn().mockResolvedValue(data);
}

/**
 * Helper to create mock aggregate pipeline response
 */
export function createMockAggregate<T>(data: T[]) {
  return vi.fn().mockResolvedValue(data);
}

/**
 * Helper to create mock Model.create response
 */
export function createMockCreate<T>(data: T) {
  const mockDoc = createMockDocument(data);
  return vi.fn().mockResolvedValue(mockDoc);
}

/**
 * Helper to mock environment variables
 */
export function mockEnvVars(vars: Record<string, string>) {
  const originalEnv = { ...process.env };
  Object.assign(process.env, vars);

  return () => {
    process.env = originalEnv;
  };
}

/**
 * Default test environment variables
 */
export const defaultTestEnv = {
  MONGO_URI: 'mongodb://localhost:27017/cado-test',
  BASE_URL: 'http://localhost:3000',
  EMAIL_ADDRESS: 'test@cado.md',
  EMAIL_PASSWORD: 'test-password',
  FROM_EMAIL_ADDRESS: 'no-reply@cado.md',
  CONTACT_EMAIL_ADDRESS: 'admin@cado.md',
  API_BASE_URL: 'https://api.paynet.md',
  API_REDIRECT_URL: 'https://paynet.md/payment',
  API_MERCHANT_CODE: 'TEST_MERCHANT',
  API_SALES_AREA_CODE: 'TEST_AREA',
  API_USERNAME: 'test_user',
  API_PASSWORD: 'test_pass',
};

/**
 * Wait for async operations (useful for testing async side effects)
 */
export function waitFor(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper to extract call arguments from a mock
 */
export function getCallArgs<T>(mockFn: { mock: { calls: unknown[][] } }, callIndex: number = 0): T {
  return mockFn.mock.calls[callIndex] as T;
}

/**
 * Helper to check if a mock was called with specific args
 */
export function wasCalledWith(
  mockFn: { mock: { calls: unknown[][] } },
  ...args: unknown[]
): boolean {
  return mockFn.mock.calls.some((call: unknown[]) =>
    args.every((arg, index) => {
      if (typeof arg === 'object' && arg !== null) {
        return JSON.stringify(call[index]) === JSON.stringify(arg);
      }
      return call[index] === arg;
    })
  );
}
