import { afterEach, beforeEach, vi } from 'vitest';
import { defaultTestEnv } from './helpers/testUtils';
import '@testing-library/jest-dom/vitest';

/**
 * Global test setup for payment and order processing tests
 * This file is run once before all tests
 */

// Setup default environment variables for tests
beforeEach(() => {
  // Set default test environment variables
  Object.assign(process.env, defaultTestEnv);

  // Suppress console output during tests to reduce stderr noise
  // This prevents console.error() calls in application code from cluttering test output
  // Real test failures and assertion errors are still visible through Vitest
  // To debug, temporarily comment out this suppression
  global.console = {
    ...console,
    error: vi.fn(),
    warn: vi.fn(),
  };
});

// Clean up mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
