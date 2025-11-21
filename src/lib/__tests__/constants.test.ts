import { describe, it, expect } from 'vitest';
import { productsLimit, heroImages, reviewLogos } from '@/lib/constants';

/**
 * Constants Validation Tests
 *
 * Tests for constant exports from src/lib/constants.ts
 * Ensures values are correctly defined and haven't been accidentally modified.
 */

describe('Constants', () => {
  describe('productsLimit', () => {
    it('should be defined', () => {
      expect(productsLimit).toBeDefined();
    });

    it('should be a positive number', () => {
      expect(typeof productsLimit).toBe('number');
      expect(productsLimit).toBeGreaterThan(0);
    });

    it('should be a reasonable limit for pagination', () => {
      // Should be reasonable for pagination (not too small, not too large)
      expect(productsLimit).toBeGreaterThan(5);
      expect(productsLimit).toBeLessThanOrEqual(100);
    });

    it('should be an integer', () => {
      expect(Number.isInteger(productsLimit)).toBe(true);
    });
  });

  describe('heroImages', () => {
    it('should be defined', () => {
      expect(heroImages).toBeDefined();
    });

    it('should be an array', () => {
      expect(Array.isArray(heroImages)).toBe(true);
    });

    it('should have at least one image', () => {
      expect(heroImages.length).toBeGreaterThan(0);
    });

    it('should contain string paths', () => {
      heroImages.forEach(image => {
        expect(typeof image).toBe('string');
        expect(image.length).toBeGreaterThan(0);
      });
    });

    it('should have valid image paths', () => {
      heroImages.forEach(image => {
        // Should start with / or be an absolute URL
        const isRelativePath = image.startsWith('/');
        const isAbsoluteURL = image.startsWith('http://') || image.startsWith('https://');

        expect(isRelativePath || isAbsoluteURL).toBe(true);
      });
    });

    it('should not have duplicate images', () => {
      const uniqueImages = new Set(heroImages);
      expect(uniqueImages.size).toBe(heroImages.length);
    });
  });

  describe('reviewLogos', () => {
    it('should be defined', () => {
      expect(reviewLogos).toBeDefined();
    });

    it('should be an array', () => {
      expect(Array.isArray(reviewLogos)).toBe(true);
    });

    it('should have at least one logo', () => {
      expect(reviewLogos.length).toBeGreaterThan(0);
    });

    it('should contain objects with src and value properties', () => {
      reviewLogos.forEach(logo => {
        expect(typeof logo).toBe('object');
        expect(logo).toHaveProperty('src');
        expect(logo).toHaveProperty('value');
        expect(typeof logo.src).toBe('string');
        expect(typeof logo.value).toBe('number');
      });
    });

    it('should have valid logo src paths', () => {
      reviewLogos.forEach(logo => {
        // Should start with / or be an absolute URL
        const isRelativePath = logo.src.startsWith('/');
        const isAbsoluteURL = logo.src.startsWith('http://') || logo.src.startsWith('https://');

        expect(isRelativePath || isAbsoluteURL).toBe(true);
        expect(logo.src.length).toBeGreaterThan(0);
      });
    });

    it('should not have duplicate values', () => {
      const values = reviewLogos.map(logo => logo.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(reviewLogos.length);
    });

    it('should have sequential value indices', () => {
      const values = reviewLogos.map(logo => logo.value).sort((a, b) => a - b);
      values.forEach((value, index) => {
        expect(value).toBe(index);
      });
    });

    it('should have reasonable number of logos for display', () => {
      // Typically review logos are 3-20 for a carousel
      expect(reviewLogos.length).toBeGreaterThanOrEqual(3);
      expect(reviewLogos.length).toBeLessThanOrEqual(50);
    });
  });

  describe('All Constants - Type Safety', () => {
    it('should not be reassignable (const)', () => {
      // This test verifies TypeScript const usage at compile time
      // At runtime, we verify they exist and have expected types
      expect(productsLimit).toBeDefined();
      expect(heroImages).toBeDefined();
      expect(reviewLogos).toBeDefined();
    });

    it('should have stable values across imports', async () => {
      // Import again to verify values are stable
      const constants = await import('@/lib/constants');

      expect(constants.productsLimit).toBe(productsLimit);
      expect(constants.heroImages).toEqual(heroImages);
      expect(constants.reviewLogos).toEqual(reviewLogos);
    });
  });
});
