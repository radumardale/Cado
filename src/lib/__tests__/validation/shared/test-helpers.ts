import { it, expect } from 'vitest';
import type { ZodSchema, ZodError } from 'zod';

/**
 * Shared Test Helpers for Validation Schema Testing
 *
 * This file provides utility functions for testing Zod validation schemas
 * across the entire validation test suite.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface MultilingualString {
  ro: string;
  ru: string;
  en: string;
}

// ============================================================================
// Data Generators
// ============================================================================

/**
 * Generate a valid multilingual string object
 */
export function createMultilingualString(base: string = 'Test'): MultilingualString {
  return {
    ro: `${base} RO`,
    ru: `${base} RU`,
    en: `${base} EN`,
  };
}

/**
 * Generate a valid MongoDB ObjectId (24 hex characters)
 */
export function createMongoId(): string {
  return '507f1f77bcf86cd799439011';
}

/**
 * Generate an invalid MongoDB ObjectId
 */
export function createInvalidMongoId(): string {
  return 'invalid-id-123';
}

/**
 * Generate a valid email address
 */
export function createValidEmail(): string {
  return 'test@example.com';
}

/**
 * Generate an invalid email address
 */
export function createInvalidEmail(): string {
  return 'invalid-email';
}

// ============================================================================
// Security Test Payloads
// ============================================================================

/**
 * Common XSS attack payloads for testing
 */
export const XSS_PAYLOADS = [
  '<script>alert("xss")</script>',
  '<img src=x onerror=alert("xss")>',
  'javascript:alert("xss")',
  '<iframe src="javascript:alert(\'xss\')">',
  '<svg onload=alert("xss")>',
];

/**
 * Common SQL injection payloads for testing
 */
export const SQL_INJECTION_PAYLOADS = [
  "'; DROP TABLE products;--",
  "' OR '1'='1",
  "admin'--",
  "1' UNION SELECT NULL--",
];

/**
 * Create a multilingual object with XSS payload
 */
export function createXSSMultilingual(): MultilingualString {
  return {
    ro: '<script>alert("xss")</script>',
    ru: '<img src=x onerror=alert("xss")>',
    en: 'javascript:alert("xss")',
  };
}

// ============================================================================
// Test Assertion Helpers
// ============================================================================

/**
 * Test that a schema accepts valid data
 */
export function expectValidData<T>(schema: ZodSchema<T>, data: unknown): void {
  const result = schema.safeParse(data);
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data).toBeDefined();
  }
}

/**
 * Test that a schema rejects invalid data
 */
export function expectInvalidData(schema: ZodSchema, data: unknown): void {
  const result = schema.safeParse(data);
  expect(result.success).toBe(false);
}

/**
 * Test that a schema rejects invalid data with a specific error message
 */
export function expectInvalidDataWithMessage(
  schema: ZodSchema,
  data: unknown,
  expectedMessage: string | RegExp
): void {
  const result = schema.safeParse(data);
  expect(result.success).toBe(false);

  if (!result.success) {
    const errorMessages = result.error.errors.map(err => err.message).join(', ');
    if (typeof expectedMessage === 'string') {
      expect(errorMessages).toContain(expectedMessage);
    } else {
      expect(errorMessages).toMatch(expectedMessage);
    }
  }
}

/**
 * Test that a schema rejects invalid data with an error at a specific path
 */
export function expectInvalidDataAtPath(
  schema: ZodSchema,
  data: unknown,
  expectedPath: (string | number)[]
): void {
  const result = schema.safeParse(data);
  expect(result.success).toBe(false);

  if (!result.success) {
    const hasPathError = result.error.errors.some(err => {
      return JSON.stringify(err.path) === JSON.stringify(expectedPath);
    });
    expect(hasPathError).toBe(true);
  }
}

/**
 * Get all error messages from a validation error
 */
export function getErrorMessages(error: ZodError): string[] {
  return error.errors.map(err => err.message);
}

/**
 * Get all error paths from a validation error
 */
export function getErrorPaths(error: ZodError): (string | number)[][] {
  return error.errors.map(err => err.path);
}

// ============================================================================
// Common Test Patterns
// ============================================================================

/**
 * Test that all fields in an object are required
 */
export function testRequiredFields(
  schema: ZodSchema,
  validData: Record<string, unknown>,
  requiredFields: string[]
): void {
  requiredFields.forEach(field => {
    it(`should require ${field} field`, () => {
      const invalidData = { ...validData };
      delete invalidData[field];
      expectInvalidData(schema, invalidData);
    });
  });
}

/**
 * Test string length constraints
 */
export function testStringLength(
  schema: ZodSchema,
  validData: Record<string, unknown>,
  field: string,
  min?: number,
  max?: number
): void {
  if (min !== undefined) {
    it(`should reject ${field} shorter than ${min} characters`, () => {
      const invalidData = { ...validData, [field]: 'a'.repeat(min - 1) };
      expectInvalidData(schema, invalidData);
    });
  }

  if (max !== undefined) {
    it(`should reject ${field} longer than ${max} characters`, () => {
      const invalidData = { ...validData, [field]: 'a'.repeat(max + 1) };
      expectInvalidData(schema, invalidData);
    });
  }
}

/**
 * Test that a field accepts valid enum values
 */
export function testEnumField<T extends Record<string, string>>(
  schema: ZodSchema,
  validData: Record<string, unknown>,
  field: string,
  enumObject: T,
  validValues: T[keyof T][]
): void {
  validValues.forEach(value => {
    it(`should accept ${field} = ${value}`, () => {
      const data = { ...validData, [field]: value };
      expectValidData(schema, data);
    });
  });

  it(`should reject invalid ${field} value`, () => {
    const invalidData = { ...validData, [field]: 'INVALID_ENUM_VALUE' };
    expectInvalidData(schema, invalidData);
  });
}

/**
 * Test multilingual field validation
 */
export function testMultilingualField(
  schema: ZodSchema,
  validData: Record<string, unknown>,
  field: string
): void {
  it(`should require all languages for ${field}`, () => {
    expectValidData(schema, {
      ...validData,
      [field]: createMultilingualString('Valid'),
    });
  });

  it(`should reject ${field} missing Romanian`, () => {
    expectInvalidData(schema, {
      ...validData,
      [field]: { ru: 'Test RU', en: 'Test EN' },
    });
  });

  it(`should reject ${field} missing Russian`, () => {
    expectInvalidData(schema, {
      ...validData,
      [field]: { ro: 'Test RO', en: 'Test EN' },
    });
  });

  it(`should reject ${field} missing English`, () => {
    expectInvalidData(schema, {
      ...validData,
      [field]: { ro: 'Test RO', ru: 'Test RU' },
    });
  });

  it(`should reject ${field} with empty strings`, () => {
    expectInvalidData(schema, {
      ...validData,
      [field]: { ro: '', ru: '', en: '' },
    });
  });
}

/**
 * Test MongoDB ObjectId validation
 */
export function testMongoIdField(
  schema: ZodSchema,
  validData: Record<string, unknown>,
  field: string
): void {
  it(`should accept valid MongoDB ObjectId for ${field}`, () => {
    expectValidData(schema, {
      ...validData,
      [field]: createMongoId(),
    });
  });

  it(`should reject invalid MongoDB ObjectId for ${field}`, () => {
    expectInvalidData(schema, {
      ...validData,
      [field]: createInvalidMongoId(),
    });
  });

  it(`should reject ${field} shorter than 24 characters`, () => {
    expectInvalidData(schema, {
      ...validData,
      [field]: '507f1f77bcf86cd7994390',
    });
  });

  it(`should reject ${field} longer than 24 characters`, () => {
    expectInvalidData(schema, {
      ...validData,
      [field]: '507f1f77bcf86cd79943901111',
    });
  });
}

/**
 * Test number range validation
 */
export function testNumberRange(
  schema: ZodSchema,
  validData: Record<string, unknown>,
  field: string,
  min?: number,
  max?: number
): void {
  if (min !== undefined) {
    it(`should accept ${field} at minimum value ${min}`, () => {
      expectValidData(schema, { ...validData, [field]: min });
    });

    it(`should reject ${field} below minimum ${min}`, () => {
      expectInvalidData(schema, { ...validData, [field]: min - 1 });
    });
  }

  if (max !== undefined) {
    it(`should accept ${field} at maximum value ${max}`, () => {
      expectValidData(schema, { ...validData, [field]: max });
    });

    it(`should reject ${field} above maximum ${max}`, () => {
      expectInvalidData(schema, { ...validData, [field]: max + 1 });
    });
  }
}

/**
 * Test that a schema handles special characters properly
 */
export function testSpecialCharacters(
  schema: ZodSchema,
  validData: Record<string, unknown>,
  field: string
): void {
  const specialCharTestCases = [
    { name: 'Romanian diacritics', value: 'Țăști Șămănă' },
    { name: 'Cyrillic characters', value: 'Продукт Тест' },
    { name: 'Mixed characters', value: 'Test Țest Тест' },
    { name: 'Unicode symbols', value: 'Test ✓ ™ ©' },
  ];

  specialCharTestCases.forEach(({ name, value }) => {
    it(`should handle ${name} in ${field}`, () => {
      expectValidData(schema, { ...validData, [field]: value });
    });
  });
}
