import { afterEach, beforeEach, vi } from 'vitest';
import { defaultTestEnv } from './helpers/testUtils';

/**
 * Global test setup for payment and order processing tests
 * This file is run once before all tests
 */

// Setup default environment variables for tests
beforeEach(() => {
  // Set default test environment variables
  Object.assign(process.env, defaultTestEnv);
});

// Clean up mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Suppress console errors during tests (optional - remove if you want to see errors)
// global.console = {
//   ...console,
//   error: vi.fn(),
//   warn: vi.fn(),
// };
