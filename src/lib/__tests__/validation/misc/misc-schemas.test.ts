import { describe, it } from 'vitest';
import { loginRequestSchema } from '@/lib/validation/user/loginRequest';
import { searchProductRequestSchema } from '@/lib/validation/search/searchProductRequest';
import { updateReccProductRequestSchema } from '@/lib/validation/reccProducts/updateReccProductRequestSchema';
import {
  createMongoId,
  expectValidData,
  expectInvalidData,
  testMongoIdField,
} from '../shared/test-helpers';

// ============================================================================
// Login Request Schema Tests
// ============================================================================

describe('loginRequestSchema', () => {
  const validData = {
    username: 'testuser',
    password: 'password123',
  };

  describe('Valid Input', () => {
    it('should accept valid login credentials', () => {
      expectValidData(loginRequestSchema, validData);
    });

    it('should accept minimum password length', () => {
      expectValidData(loginRequestSchema, {
        ...validData,
        password: '123456',
      });
    });

    it('should accept long passwords', () => {
      expectValidData(loginRequestSchema, {
        ...validData,
        password: 'a'.repeat(100),
      });
    });

    it('should accept minimum username length', () => {
      expectValidData(loginRequestSchema, {
        ...validData,
        username: 'a',
      });
    });

    it('should accept long usernames', () => {
      expectValidData(loginRequestSchema, {
        ...validData,
        username: 'a'.repeat(100),
      });
    });
  });

  describe('Username Validation', () => {
    it('should reject empty username', () => {
      expectInvalidData(loginRequestSchema, {
        ...validData,
        username: '',
      });
    });

    it('should reject missing username', () => {
      const { username, ...withoutUsername } = validData; // eslint-disable-line
      expectInvalidData(loginRequestSchema, withoutUsername);
    });

    it('should reject non-string username', () => {
      expectInvalidData(loginRequestSchema, {
        ...validData,
        username: 123 as any, // eslint-disable-line
      });
    });
  });

  describe('Password Validation', () => {
    it('should reject password shorter than 6 characters', () => {
      expectInvalidData(loginRequestSchema, {
        ...validData,
        password: '12345',
      });
    });

    it('should reject empty password', () => {
      expectInvalidData(loginRequestSchema, {
        ...validData,
        password: '',
      });
    });

    it('should reject missing password', () => {
      const { password, ...withoutPassword } = validData; // eslint-disable-line
      expectInvalidData(loginRequestSchema, withoutPassword);
    });

    it('should reject non-string password', () => {
      expectInvalidData(loginRequestSchema, {
        ...validData,
        password: 123456 as any, // eslint-disable-line
      });
    });
  });

  describe('Required Fields', () => {
    it('should require both username and password', () => {
      expectInvalidData(loginRequestSchema, {});
    });
  });
});

// ============================================================================
// Search Product Request Schema Tests
// ============================================================================

describe('searchProductRequestSchema', () => {
  const validData = {
    title: 'search query',
  };

  describe('Valid Input', () => {
    it('should accept valid search query', () => {
      expectValidData(searchProductRequestSchema, validData);
    });

    it('should accept minimum title length', () => {
      expectValidData(searchProductRequestSchema, {
        title: 'ab',
      });
    });

    it('should accept long search queries', () => {
      expectValidData(searchProductRequestSchema, {
        title: 'a'.repeat(200),
      });
    });

    it('should accept search with special characters', () => {
      expectValidData(searchProductRequestSchema, {
        title: 'Product & Gift',
      });
    });

    it('should accept search with Romanian diacritics', () => {
      expectValidData(searchProductRequestSchema, {
        title: 'Țăști',
      });
    });

    it('should accept search with Cyrillic characters', () => {
      expectValidData(searchProductRequestSchema, {
        title: 'Продукт',
      });
    });
  });

  describe('Title Validation', () => {
    it('should reject title shorter than 2 characters', () => {
      expectInvalidData(searchProductRequestSchema, {
        title: 'a',
      });
    });

    it('should reject empty title', () => {
      expectInvalidData(searchProductRequestSchema, {
        title: '',
      });
    });

    it('should reject missing title', () => {
      expectInvalidData(searchProductRequestSchema, {});
    });

    it('should reject non-string title', () => {
      expectInvalidData(searchProductRequestSchema, {
        title: 123 as any, // eslint-disable-line
      });
    });
  });
});

// ============================================================================
// Update Recommended Product Request Schema Tests
// ============================================================================

describe('updateReccProductRequestSchema', () => {
  const validData = {
    replaceId: createMongoId(),
    productId: createMongoId(),
  };

  describe('Valid Input', () => {
    it('should accept valid update recommendation request', () => {
      expectValidData(updateReccProductRequestSchema, validData);
    });

    it('should accept different IDs for replaceId and productId', () => {
      expectValidData(updateReccProductRequestSchema, {
        replaceId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439022',
      });
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(updateReccProductRequestSchema, validData, 'replaceId');
    testMongoIdField(updateReccProductRequestSchema, validData, 'productId');
  });

  describe('Required Fields', () => {
    it('should require replaceId field', () => {
      const { replaceId, ...withoutReplaceId } = validData; // eslint-disable-line
      expectInvalidData(updateReccProductRequestSchema, withoutReplaceId);
    });

    it('should require productId field', () => {
      const { productId, ...withoutProductId } = validData; // eslint-disable-line
      expectInvalidData(updateReccProductRequestSchema, withoutProductId);
    });

    it('should require both IDs', () => {
      expectInvalidData(updateReccProductRequestSchema, {});
    });
  });

  describe('Type Validation', () => {
    it('should reject non-string replaceId', () => {
      expectInvalidData(updateReccProductRequestSchema, {
        ...validData,
        replaceId: 123 as any, // eslint-disable-line
      });
    });

    it('should reject non-string productId', () => {
      expectInvalidData(updateReccProductRequestSchema, {
        ...validData,
        productId: 123 as any, // eslint-disable-line
      });
    });

    it('should reject null replaceId', () => {
      expectInvalidData(updateReccProductRequestSchema, {
        ...validData,
        replaceId: null,
      });
    });

    it('should reject null productId', () => {
      expectInvalidData(updateReccProductRequestSchema, {
        ...validData,
        productId: null,
      });
    });
  });
});
