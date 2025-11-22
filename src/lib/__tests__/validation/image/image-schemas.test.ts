import { describe, it } from 'vitest';
import { deleteImageRequestSchema } from '@/lib/validation/image/deleteImageRequest';
import { uploadBlogImagesRequestSchema } from '@/lib/validation/image/uploadBlogImagesRequest';
import { uploadProductImageRequestSchema } from '@/lib/validation/image/uploadProductImagesRequest';
import { uploadBannerImagesRequestSchema } from '@/lib/validation/image/uploadBannerImageRequest';
import {
  createMongoId,
  expectValidData,
  expectInvalidData,
  testMongoIdField,
} from '../shared/test-helpers';

// ============================================================================
// Factory Functions
// ============================================================================

function createValidDeleteImageRequest() {
  return {
    image: 'https://cloudfront.net/image.jpg',
    id: createMongoId(),
    destination: 'PRODUCT' as const,
  };
}

function createValidUploadBlogImagesRequest() {
  return {
    filenames: [
      { image: 'blog-image-1.jpg', index: 0 },
      { image: 'blog-image-2.jpg', index: 1 },
    ],
    id: createMongoId(),
    newMainImageKey: 'main-blog-image.jpg',
  };
}

function createValidUploadProductImagesRequest() {
  return {
    filenames: ['product-image-1.jpg', 'product-image-2.jpg', 'product-image-3.jpg'],
    id: createMongoId(),
  };
}

function createValidUploadBannerImagesRequest() {
  return {
    id: createMongoId(),
    newImageKeys: {
      ro: 'banner-ro.jpg',
      ru: 'banner-ru.jpg',
      en: 'banner-en.jpg',
    },
  };
}

// ============================================================================
// Delete Image Request Schema Tests
// ============================================================================

describe('deleteImageRequestSchema', () => {
  const validData = createValidDeleteImageRequest();

  describe('Valid Input', () => {
    it('should accept valid delete request with PRODUCT destination', () => {
      expectValidData(deleteImageRequestSchema, validData);
    });

    it('should accept valid delete request with BLOG destination', () => {
      const blogData = {
        ...validData,
        destination: 'BLOG' as const,
      };
      expectValidData(deleteImageRequestSchema, blogData);
    });

    it('should accept image URL with minimum length', () => {
      const minData = {
        ...validData,
        image: 'ab',
      };
      expectValidData(deleteImageRequestSchema, minData);
    });

    it('should accept long image URLs', () => {
      const longUrlData = {
        ...validData,
        image: 'https://d3rus23k068yq9.cloudfront.net/very/long/path/to/image/file/name.jpg',
      };
      expectValidData(deleteImageRequestSchema, longUrlData);
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(deleteImageRequestSchema, validData, 'id');
  });

  describe('Required Fields', () => {
    it('should require image field', () => {
      const { image, ...withoutImage } = validData; // eslint-disable-line
      expectInvalidData(deleteImageRequestSchema, withoutImage);
    });

    it('should require id field', () => {
      const { id, ...withoutId } = validData; // eslint-disable-line
      expectInvalidData(deleteImageRequestSchema, withoutId);
    });

    it('should require destination field', () => {
      const { destination, ...withoutDestination } = validData; // eslint-disable-line
      expectInvalidData(deleteImageRequestSchema, withoutDestination);
    });
  });

  describe('String Validation', () => {
    it('should reject image shorter than 2 characters', () => {
      expectInvalidData(deleteImageRequestSchema, {
        ...validData,
        image: 'a',
      });
    });

    it('should reject empty image string', () => {
      expectInvalidData(deleteImageRequestSchema, {
        ...validData,
        image: '',
      });
    });

    it('should reject non-string image', () => {
      expectInvalidData(deleteImageRequestSchema, {
        ...validData,
        image: 123 as any, // eslint-disable-line
      });
    });
  });

  describe('Enum Validation', () => {
    it('should accept PRODUCT destination', () => {
      expectValidData(deleteImageRequestSchema, {
        ...validData,
        destination: 'PRODUCT',
      });
    });

    it('should accept BLOG destination', () => {
      expectValidData(deleteImageRequestSchema, {
        ...validData,
        destination: 'BLOG',
      });
    });

    it('should reject invalid destination', () => {
      expectInvalidData(deleteImageRequestSchema, {
        ...validData,
        destination: 'INVALID' as any, // eslint-disable-line
      });
    });

    it('should reject lowercase destination', () => {
      expectInvalidData(deleteImageRequestSchema, {
        ...validData,
        destination: 'product' as any, // eslint-disable-line
      });
    });
  });

  describe('Type Validation', () => {
    it('should reject null image', () => {
      expectInvalidData(deleteImageRequestSchema, {
        ...validData,
        image: null,
      });
    });

    it('should reject undefined image', () => {
      expectInvalidData(deleteImageRequestSchema, {
        ...validData,
        image: undefined,
      });
    });
  });
});

// ============================================================================
// Upload Blog Images Request Schema Tests
// ============================================================================

describe('uploadBlogImagesRequestSchema', () => {
  const validData = createValidUploadBlogImagesRequest();

  describe('Valid Input', () => {
    it('should accept valid upload blog images request', () => {
      expectValidData(uploadBlogImagesRequestSchema, validData);
    });

    it('should accept empty filenames array', () => {
      expectValidData(uploadBlogImagesRequestSchema, {
        ...validData,
        filenames: [],
      });
    });

    it('should accept null newMainImageKey', () => {
      expectValidData(uploadBlogImagesRequestSchema, {
        ...validData,
        newMainImageKey: null,
      });
    });

    it('should accept single filename', () => {
      expectValidData(uploadBlogImagesRequestSchema, {
        ...validData,
        filenames: [{ image: 'single-image.jpg', index: 0 }],
      });
    });

    it('should accept multiple filenames', () => {
      expectValidData(uploadBlogImagesRequestSchema, {
        ...validData,
        filenames: [
          { image: 'image-1.jpg', index: 0 },
          { image: 'image-2.jpg', index: 1 },
          { image: 'image-3.jpg', index: 2 },
          { image: 'image-4.jpg', index: 3 },
        ],
      });
    });

    it('should accept negative index numbers', () => {
      expectValidData(uploadBlogImagesRequestSchema, {
        ...validData,
        filenames: [{ image: 'image.jpg', index: -1 }],
      });
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(uploadBlogImagesRequestSchema, validData, 'id');
  });

  describe('Required Fields', () => {
    it('should require filenames field', () => {
      const { filenames, ...withoutFilenames } = validData; // eslint-disable-line
      expectInvalidData(uploadBlogImagesRequestSchema, withoutFilenames);
    });

    it('should require id field', () => {
      const { id, ...withoutId } = validData; // eslint-disable-line
      expectInvalidData(uploadBlogImagesRequestSchema, withoutId);
    });

    it('should require newMainImageKey field', () => {
      const { newMainImageKey, ...withoutKey } = validData; // eslint-disable-line
      expectInvalidData(uploadBlogImagesRequestSchema, withoutKey);
    });
  });

  describe('Array Validation', () => {
    it('should reject non-array filenames', () => {
      expectInvalidData(uploadBlogImagesRequestSchema, {
        ...validData,
        filenames: 'not-an-array' as any, // eslint-disable-line
      });
    });

    it('should reject filenames with missing image field', () => {
      expectInvalidData(uploadBlogImagesRequestSchema, {
        ...validData,
        filenames: [{ index: 0 }] as any, // eslint-disable-line
      });
    });

    it('should reject filenames with missing index field', () => {
      expectInvalidData(uploadBlogImagesRequestSchema, {
        ...validData,
        filenames: [{ image: 'test.jpg' }] as any, // eslint-disable-line
      });
    });

    it('should reject filenames with non-string image', () => {
      expectInvalidData(uploadBlogImagesRequestSchema, {
        ...validData,
        filenames: [{ image: 123, index: 0 }] as any, // eslint-disable-line
      });
    });

    it('should reject filenames with non-number index', () => {
      expectInvalidData(uploadBlogImagesRequestSchema, {
        ...validData,
        filenames: [{ image: 'test.jpg', index: '0' }] as any, // eslint-disable-line
      });
    });
  });

  describe('Type Validation', () => {
    it('should reject non-string newMainImageKey', () => {
      expectInvalidData(uploadBlogImagesRequestSchema, {
        ...validData,
        newMainImageKey: 123 as any, // eslint-disable-line
      });
    });

    it('should reject undefined newMainImageKey', () => {
      expectInvalidData(uploadBlogImagesRequestSchema, {
        ...validData,
        newMainImageKey: undefined,
      });
    });
  });
});

// ============================================================================
// Upload Product Images Request Schema Tests
// ============================================================================

describe('uploadProductImageRequestSchema', () => {
  const validData = createValidUploadProductImagesRequest();

  describe('Valid Input', () => {
    it('should accept valid upload product images request', () => {
      expectValidData(uploadProductImageRequestSchema, validData);
    });

    it('should accept empty filenames array', () => {
      expectValidData(uploadProductImageRequestSchema, {
        ...validData,
        filenames: [],
      });
    });

    it('should accept single filename', () => {
      expectValidData(uploadProductImageRequestSchema, {
        ...validData,
        filenames: ['single-product-image.jpg'],
      });
    });

    it('should accept multiple filenames', () => {
      expectValidData(uploadProductImageRequestSchema, {
        ...validData,
        filenames: [
          'product-1.jpg',
          'product-2.jpg',
          'product-3.jpg',
          'product-4.jpg',
          'product-5.jpg',
        ],
      });
    });

    it('should accept filenames with various extensions', () => {
      expectValidData(uploadProductImageRequestSchema, {
        ...validData,
        filenames: ['image.jpg', 'image.png', 'image.webp', 'image.gif'],
      });
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(uploadProductImageRequestSchema, validData, 'id');
  });

  describe('Required Fields', () => {
    it('should require filenames field', () => {
      const { filenames, ...withoutFilenames } = validData; // eslint-disable-line
      expectInvalidData(uploadProductImageRequestSchema, withoutFilenames);
    });

    it('should require id field', () => {
      const { id, ...withoutId } = validData; // eslint-disable-line
      expectInvalidData(uploadProductImageRequestSchema, withoutId);
    });
  });

  describe('Array Validation', () => {
    it('should reject non-array filenames', () => {
      expectInvalidData(uploadProductImageRequestSchema, {
        ...validData,
        filenames: 'not-an-array' as any, // eslint-disable-line
      });
    });

    it('should reject filenames with non-string elements', () => {
      expectInvalidData(uploadProductImageRequestSchema, {
        ...validData,
        filenames: [123, 456] as any, // eslint-disable-line
      });
    });

    it('should reject filenames with mixed types', () => {
      expectInvalidData(uploadProductImageRequestSchema, {
        ...validData,
        filenames: ['image.jpg', 123, null] as any, // eslint-disable-line
      });
    });
  });

  describe('Type Validation', () => {
    it('should reject null filenames', () => {
      expectInvalidData(uploadProductImageRequestSchema, {
        ...validData,
        filenames: null,
      });
    });

    it('should reject undefined filenames', () => {
      expectInvalidData(uploadProductImageRequestSchema, {
        ...validData,
        filenames: undefined,
      });
    });
  });
});

// ============================================================================
// Upload Banner Images Request Schema Tests
// ============================================================================

describe('uploadBannerImagesRequestSchema', () => {
  const validData = createValidUploadBannerImagesRequest();

  describe('Valid Input', () => {
    it('should accept valid upload banner images request', () => {
      expectValidData(uploadBannerImagesRequestSchema, validData);
    });

    it('should accept all nullable image keys', () => {
      expectValidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: {
          ro: null,
          ru: null,
          en: null,
        },
      });
    });

    it('should accept partially nullable image keys', () => {
      expectValidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: {
          ro: 'banner-ro.jpg',
          ru: null,
          en: 'banner-en.jpg',
        },
      });
    });

    it('should accept only Romanian image', () => {
      expectValidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: {
          ro: 'banner-ro.jpg',
          ru: null,
          en: null,
        },
      });
    });

    it('should accept only Russian image', () => {
      expectValidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: {
          ro: null,
          ru: 'banner-ru.jpg',
          en: null,
        },
      });
    });

    it('should accept only English image', () => {
      expectValidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: {
          ro: null,
          ru: null,
          en: 'banner-en.jpg',
        },
      });
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(uploadBannerImagesRequestSchema, validData, 'id');
  });

  describe('Required Fields', () => {
    it('should require id field', () => {
      const { id, ...withoutId } = validData; // eslint-disable-line
      expectInvalidData(uploadBannerImagesRequestSchema, withoutId);
    });

    it('should require newImageKeys field', () => {
      const { newImageKeys, ...withoutKeys } = validData; // eslint-disable-line
      expectInvalidData(uploadBannerImagesRequestSchema, withoutKeys);
    });

    it('should require ro field in newImageKeys', () => {
      const { ro, ...withoutRo } = validData.newImageKeys; // eslint-disable-line
      expectInvalidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: withoutRo,
      });
    });

    it('should require ru field in newImageKeys', () => {
      const { ru, ...withoutRu } = validData.newImageKeys; // eslint-disable-line
      expectInvalidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: withoutRu,
      });
    });

    it('should require en field in newImageKeys', () => {
      const { en, ...withoutEn } = validData.newImageKeys; // eslint-disable-line
      expectInvalidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: withoutEn,
      });
    });
  });

  describe('Type Validation', () => {
    it('should reject non-string ro (when not null)', () => {
      expectInvalidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: {
          ...validData.newImageKeys,
          ro: 123 as any, // eslint-disable-line
        },
      });
    });

    it('should reject non-string ru (when not null)', () => {
      expectInvalidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: {
          ...validData.newImageKeys,
          ru: 123 as any, // eslint-disable-line
        },
      });
    });

    it('should reject non-string en (when not null)', () => {
      expectInvalidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: {
          ...validData.newImageKeys,
          en: 123 as any, // eslint-disable-line
        },
      });
    });

    it('should reject undefined ro', () => {
      expectInvalidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: {
          ...validData.newImageKeys,
          ro: undefined as any, // eslint-disable-line
        },
      });
    });

    it('should reject non-object newImageKeys', () => {
      expectInvalidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: 'not-an-object' as any, // eslint-disable-line
      });
    });

    it('should reject null newImageKeys', () => {
      expectInvalidData(uploadBannerImagesRequestSchema, {
        ...validData,
        newImageKeys: null,
      });
    });
  });
});
