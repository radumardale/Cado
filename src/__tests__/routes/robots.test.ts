import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import robots from '@/app/robots';

describe('Robots.txt Generation', () => {
  let originalBaseUrl: string | undefined;

  beforeEach(() => {
    // Save original BASE_URL
    originalBaseUrl = process.env.BASE_URL;
  });

  afterEach(() => {
    // Restore original BASE_URL
    if (originalBaseUrl !== undefined) {
      process.env.BASE_URL = originalBaseUrl;
    } else {
      delete process.env.BASE_URL;
    }
  });

  it('should generate robots.txt with proper structure', () => {
    const result = robots();

    expect(result).toBeDefined();
    expect(result.rules).toBeDefined();
    expect(Array.isArray(result.rules)).toBe(true);
    expect(result.sitemap).toBeDefined();
    expect(result.host).toBeDefined();
  });

  it('should block sensitive paths for all user agents', () => {
    const result = robots();

    // Find the rule for all user agents
    const allAgentsRule = result.rules?.find(rule =>
      rule.userAgent === '*'
    );

    expect(allAgentsRule).toBeDefined();
    expect(allAgentsRule?.allow).toBe('/');

    const disallowed = allAgentsRule?.disallow;
    expect(disallowed).toContain('/admin/');
    expect(disallowed).toContain('/api/');
    expect(disallowed).toContain('/_next/');
    expect(disallowed).toContain('/paynet-callback/');
    expect(disallowed).toContain('/auth/');
    expect(disallowed).toContain('/login/');
    expect(disallowed).toContain('/checkout/');
    expect(disallowed).toContain('/confirmation/');
    expect(disallowed).toContain('/payment-error/');
  });

  it('should have specific rules for Googlebot', () => {
    const result = robots();

    const googlebotRule = result.rules?.find(rule =>
      rule.userAgent === 'Googlebot'
    );

    expect(googlebotRule).toBeDefined();
    expect(googlebotRule?.allow).toBe('/');

    // Googlebot should not have /_next/ blocked (for performance)
    const disallowed = googlebotRule?.disallow;
    expect(disallowed).toContain('/admin/');
    expect(disallowed).toContain('/api/');
    expect(disallowed).not.toContain('/_next/');
  });

  it('should have specific rules for Yandex', () => {
    const result = robots();

    const yandexRule = result.rules?.find(rule =>
      rule.userAgent === 'Yandex'
    );

    expect(yandexRule).toBeDefined();
    expect(yandexRule?.allow).toBe('/');

    const disallowed = yandexRule?.disallow;
    expect(disallowed).toContain('/admin/');
    expect(disallowed).toContain('/api/');
    expect(disallowed).not.toContain('/_next/');
  });

  it('should reference the sitemap correctly', () => {
    const result = robots();

    expect(result.sitemap).toBe('http://localhost:3000/sitemap.xml');
  });

  it('should set the correct host', () => {
    const result = robots();

    expect(result.host).toBe('http://localhost:3000');
  });

  it('should use BASE_URL environment variable when set', () => {
    process.env.BASE_URL = 'https://example.com';

    const result = robots();

    expect(result.sitemap).toBe('https://example.com/sitemap.xml');
    expect(result.host).toBe('https://example.com');
  });

  it('should use production URL when NODE_ENV is production', () => {
    delete process.env.BASE_URL;
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const result = robots();

    expect(result.sitemap).toBe('https://cado.md/sitemap.xml');
    expect(result.host).toBe('https://cado.md');

    // Restore NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should have correct number of rules', () => {
    const result = robots();

    // Should have rules for: *, Googlebot, Yandex
    expect(result.rules?.length).toBe(3);
  });

  it('should allow crawling of root path for all user agents', () => {
    const result = robots();

    result.rules?.forEach(rule => {
      expect(rule.allow).toBe('/');
    });
  });

  it('should block checkout flow for all user agents', () => {
    const result = robots();

    result.rules?.forEach(rule => {
      if (rule.disallow) {
        expect(rule.disallow).toContain('/checkout/');
        expect(rule.disallow).toContain('/confirmation/');
        expect(rule.disallow).toContain('/payment-error/');
      }
    });
  });

  it('should block authentication paths for all user agents', () => {
    const result = robots();

    result.rules?.forEach(rule => {
      if (rule.disallow) {
        expect(rule.disallow).toContain('/auth/');
        expect(rule.disallow).toContain('/admin/');
      }
    });
  });

  it('should not have duplicate paths in disallow lists', () => {
    const result = robots();

    result.rules?.forEach(rule => {
      if (rule.disallow && Array.isArray(rule.disallow)) {
        const uniquePaths = new Set(rule.disallow);
        expect(uniquePaths.size).toBe(rule.disallow.length);
      }
    });
  });

  it('should format URLs consistently with trailing slashes', () => {
    const result = robots();

    result.rules?.forEach(rule => {
      if (rule.disallow && Array.isArray(rule.disallow)) {
        rule.disallow.forEach(path => {
          // All disallowed paths should end with /
          expect(path.endsWith('/')).toBe(true);
        });
      }
    });
  });
});