import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getBaseUrl } from '@/lib/sitemap-generator';

/**
 * Sitemap Generator Tests
 *
 * Tests for sitemap generation utility functions:
 * - getBaseUrl() - Environment-based base URL determination with fallbacks
 */

describe('Sitemap Generator', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment variables
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  describe('getBaseUrl()', () => {
    it('should use BASE_URL when provided', () => {
      process.env.BASE_URL = 'https://example.com';
      (process.env as any).NODE_ENV = 'development'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://example.com');
    });

    it('should use BASE_URL with custom port', () => {
      process.env.BASE_URL = 'http://localhost:4000';
      (process.env as any).NODE_ENV = 'development'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('http://localhost:4000');
    });

    it('should ignore BASE_URL when it is "/"', () => {
      process.env.BASE_URL = '/';
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://cado.md');
    });

    it('should fallback to production URL when NODE_ENV is production and BASE_URL not set', () => {
      delete process.env.BASE_URL;
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://cado.md');
    });

    it('should fallback to development URL when NODE_ENV is development and BASE_URL not set', () => {
      delete process.env.BASE_URL;
      (process.env as any).NODE_ENV = 'development'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('http://localhost:3000');
    });

    it('should fallback to development URL when NODE_ENV is test and BASE_URL not set', () => {
      delete process.env.BASE_URL;
      (process.env as any).NODE_ENV = 'test'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('http://localhost:3000');
    });

    it('should remove trailing slash from BASE_URL', () => {
      process.env.BASE_URL = 'https://example.com/';
      (process.env as any).NODE_ENV = 'development'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://example.com');
    });

    it('should remove trailing slash from custom URL', () => {
      process.env.BASE_URL = 'http://localhost:8080/';
      (process.env as any).NODE_ENV = 'development'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('http://localhost:8080');
    });

    it('should handle BASE_URL without trailing slash', () => {
      process.env.BASE_URL = 'https://staging.cado.md';
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://staging.cado.md');
    });

    it('should handle empty BASE_URL by using fallback', () => {
      process.env.BASE_URL = '';
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://cado.md');
    });

    it('should prioritize BASE_URL over NODE_ENV', () => {
      process.env.BASE_URL = 'https://custom.domain.com';
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://custom.domain.com');
    });

    it('should handle subdomain in BASE_URL', () => {
      process.env.BASE_URL = 'https://api.cado.md';
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://api.cado.md');
    });

    it('should handle URL with path in BASE_URL', () => {
      process.env.BASE_URL = 'https://example.com/app';
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://example.com/app');
    });

    it('should remove trailing slash from URL with path', () => {
      process.env.BASE_URL = 'https://example.com/app/';
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://example.com/app');
    });
  });

  describe('getBaseUrl() - Edge Cases', () => {
    it('should handle missing NODE_ENV by defaulting to development', () => {
      delete process.env.BASE_URL;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NODE_ENV;

      // When NODE_ENV is undefined, it's not 'production', so defaults to dev
      expect(getBaseUrl()).toBe('http://localhost:3000');
    });

    it('should handle BASE_URL with multiple trailing slashes', () => {
      process.env.BASE_URL = 'https://example.com//';
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      // Only removes the last slash
      expect(getBaseUrl()).toBe('https://example.com/');
    });

    it('should handle BASE_URL with query parameters', () => {
      process.env.BASE_URL = 'https://example.com?param=value';
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://example.com?param=value');
    });

    it('should handle BASE_URL with hash', () => {
      process.env.BASE_URL = 'https://example.com#section';
      (process.env as any).NODE_ENV = 'production'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://example.com#section');
    });

    it('should use BASE_URL even with unusual NODE_ENV values', () => {
      process.env.BASE_URL = 'https://staging.com';
      (process.env as any).NODE_ENV = 'staging'; // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(getBaseUrl()).toBe('https://staging.com');
    });
  });
});
