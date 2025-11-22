import { describe, it } from 'vitest';
import { BlogTags } from '@/lib/enums/BlogTags';
import { sectionSchema } from '@/lib/validation/blog/types/sectionSchema';
import { addBlogRequestSchema } from '@/lib/validation/blog/addBlogRequest';
import { updateBlogRequestSchema } from '@/lib/validation/blog/updateBlogRequest';
import { deleteBlogRequestSchema } from '@/lib/validation/blog/deleteBlogRequest';
import { getBlogRequestSchema } from '@/lib/validation/blog/getBlogRequest';
import { getLimitedBlogsRequestSchema } from '@/lib/validation/blog/getLimitedBlogsRequest';
import {
  createMultilingualString,
  createMongoId,
  createXSSMultilingual,
  expectValidData,
  expectInvalidData,
  testMultilingualField,
  testMongoIdField,
} from '../shared/test-helpers';

// ============================================================================
// Factory Functions
// ============================================================================

function createValidSection() {
  return {
    subtitle: createMultilingualString('Section Title'),
    content: createMultilingualString('Section Content'),
  };
}

function createValidBlogData() {
  return {
    data: {
      title: createMultilingualString('Blog Title'),
      isImageNew: true,
      sectionsImagesCount: 3,
      tag: BlogTags.NEWS,
      sections: [createValidSection(), createValidSection()],
    },
  };
}

// ============================================================================
// Section Schema Tests
// ============================================================================

describe('sectionSchema', () => {
  const validSection = createValidSection();

  describe('Valid Input', () => {
    it('should accept valid section with all fields', () => {
      expectValidData(sectionSchema, validSection);
    });

    it('should accept section with minimal valid data', () => {
      const minimalSection = {
        subtitle: { ro: 'T', ru: 'T', en: 'T' },
        content: { ro: 'C', ru: 'C', en: 'C' },
      };
      expectValidData(sectionSchema, minimalSection);
    });
  });

  describe('Multilingual Field Validation', () => {
    testMultilingualField(sectionSchema, validSection, 'subtitle');
    testMultilingualField(sectionSchema, validSection, 'content');
  });

  describe('Required Fields', () => {
    it('should require subtitle field', () => {
      const { subtitle, ...withoutSubtitle } = validSection; // eslint-disable-line
      expectInvalidData(sectionSchema, withoutSubtitle);
    });

    it('should require content field', () => {
      const { content, ...withoutContent } = validSection; // eslint-disable-line
      expectInvalidData(sectionSchema, withoutContent);
    });
  });

  describe('Security', () => {
    it('should handle XSS payloads in subtitle', () => {
      const sectionWithXSS = {
        ...validSection,
        subtitle: createXSSMultilingual(),
      };
      expectValidData(sectionSchema, sectionWithXSS);
    });

    it('should handle XSS payloads in content', () => {
      const sectionWithXSS = {
        ...validSection,
        content: createXSSMultilingual(),
      };
      expectValidData(sectionSchema, sectionWithXSS);
    });
  });
});

// ============================================================================
// Add Blog Request Schema Tests
// ============================================================================

describe('addBlogRequestSchema', () => {
  const validBlogData = createValidBlogData();

  describe('Valid Input', () => {
    it('should accept valid blog data with all required fields', () => {
      expectValidData(addBlogRequestSchema, validBlogData);
    });

    it('should accept blog data with imagesChanged flag', () => {
      const dataWithImagesChanged = {
        data: {
          ...validBlogData.data,
          imagesChanged: true,
        },
      };
      expectValidData(addBlogRequestSchema, dataWithImagesChanged);
    });

    it('should accept blog data without optional imagesChanged', () => {
      expectValidData(addBlogRequestSchema, validBlogData);
    });

    it('should accept blog with empty sections array', () => {
      const dataWithNoSections = {
        data: {
          ...validBlogData.data,
          sections: [],
        },
      };
      expectValidData(addBlogRequestSchema, dataWithNoSections);
    });

    it('should accept blog with multiple sections', () => {
      const dataWithManySections = {
        data: {
          ...validBlogData.data,
          sections: [
            createValidSection(),
            createValidSection(),
            createValidSection(),
            createValidSection(),
          ],
        },
      };
      expectValidData(addBlogRequestSchema, dataWithManySections);
    });

    it('should accept sectionsImagesCount of 0', () => {
      const dataWithNoImages = {
        data: {
          ...validBlogData.data,
          sectionsImagesCount: 0,
        },
      };
      expectValidData(addBlogRequestSchema, dataWithNoImages);
    });
  });

  describe('Multilingual Field Validation', () => {
    it('should require all languages for title', () => {
      expectValidData(addBlogRequestSchema, validBlogData);
    });

    it('should reject title missing Romanian', () => {
      const invalidData = {
        data: {
          ...validBlogData.data,
          title: { ru: 'Test RU', en: 'Test EN' },
        },
      };
      expectInvalidData(addBlogRequestSchema, invalidData);
    });

    it('should reject title missing Russian', () => {
      const invalidData = {
        data: {
          ...validBlogData.data,
          title: { ro: 'Test RO', en: 'Test EN' },
        },
      };
      expectInvalidData(addBlogRequestSchema, invalidData);
    });

    it('should reject title missing English', () => {
      const invalidData = {
        data: {
          ...validBlogData.data,
          title: { ro: 'Test RO', ru: 'Test RU' },
        },
      };
      expectInvalidData(addBlogRequestSchema, invalidData);
    });

    it('should reject title with empty strings', () => {
      const invalidData = {
        data: {
          ...validBlogData.data,
          title: { ro: '', ru: '', en: '' },
        },
      };
      expectInvalidData(addBlogRequestSchema, invalidData);
    });
  });

  describe('Enum Validation', () => {
    it('should accept tag = NEWS', () => {
      const data = {
        data: {
          ...validBlogData.data,
          tag: BlogTags.NEWS,
        },
      };
      expectValidData(addBlogRequestSchema, data);
    });

    it('should accept tag = RECOMMENDATIONS', () => {
      const data = {
        data: {
          ...validBlogData.data,
          tag: BlogTags.RECOMMENDATIONS,
        },
      };
      expectValidData(addBlogRequestSchema, data);
    });

    it('should accept tag = EXPERIENCES', () => {
      const data = {
        data: {
          ...validBlogData.data,
          tag: BlogTags.EXPERIENCES,
        },
      };
      expectValidData(addBlogRequestSchema, data);
    });

    it('should reject invalid tag value', () => {
      const invalidData = {
        data: {
          ...validBlogData.data,
          tag: 'INVALID_TAG' as any, // eslint-disable-line
        },
      };
      expectInvalidData(addBlogRequestSchema, invalidData);
    });
  });

  describe('Required Fields', () => {
    it('should require data field', () => {
      expectInvalidData(addBlogRequestSchema, {});
    });

    it('should require title field', () => {
      const { title, ...dataWithoutTitle } = validBlogData.data; // eslint-disable-line
      expectInvalidData(addBlogRequestSchema, { data: dataWithoutTitle });
    });

    it('should require isImageNew field', () => {
      const { isImageNew, ...dataWithoutIsImageNew } = validBlogData.data; // eslint-disable-line
      expectInvalidData(addBlogRequestSchema, { data: dataWithoutIsImageNew });
    });

    it('should require sectionsImagesCount field', () => {
      const { sectionsImagesCount, ...dataWithoutCount } = validBlogData.data; // eslint-disable-line
      expectInvalidData(addBlogRequestSchema, { data: dataWithoutCount });
    });

    it('should require tag field', () => {
      const { tag, ...dataWithoutTag } = validBlogData.data; // eslint-disable-line
      expectInvalidData(addBlogRequestSchema, { data: dataWithoutTag });
    });

    it('should require sections field', () => {
      const { sections, ...dataWithoutSections } = validBlogData.data; // eslint-disable-line
      expectInvalidData(addBlogRequestSchema, { data: dataWithoutSections });
    });
  });

  describe('Type Validation', () => {
    it('should reject non-boolean isImageNew', () => {
      const invalidData = {
        data: {
          ...validBlogData.data,
          isImageNew: 'true' as any, // eslint-disable-line
        },
      };
      expectInvalidData(addBlogRequestSchema, invalidData);
    });

    it('should reject non-number sectionsImagesCount', () => {
      const invalidData = {
        data: {
          ...validBlogData.data,
          sectionsImagesCount: '3' as any, // eslint-disable-line
        },
      };
      expectInvalidData(addBlogRequestSchema, invalidData);
    });

    it('should accept negative sectionsImagesCount (schema allows it)', () => {
      const data = {
        data: {
          ...validBlogData.data,
          sectionsImagesCount: -1,
        },
      };
      expectValidData(addBlogRequestSchema, data);
    });

    it('should reject non-array sections', () => {
      const invalidData = {
        data: {
          ...validBlogData.data,
          sections: 'not-an-array' as any, // eslint-disable-line
        },
      };
      expectInvalidData(addBlogRequestSchema, invalidData);
    });

    it('should reject sections with invalid section objects', () => {
      const invalidData = {
        data: {
          ...validBlogData.data,
          sections: [
            { subtitle: 'invalid' }, // Missing multilingual structure
          ],
        },
      };
      expectInvalidData(addBlogRequestSchema, invalidData);
    });
  });

  describe('Security', () => {
    it('should handle XSS payloads in title', () => {
      const dataWithXSS = {
        data: {
          ...validBlogData.data,
          title: createXSSMultilingual(),
        },
      };
      expectValidData(addBlogRequestSchema, dataWithXSS);
    });

    it('should handle XSS payloads in sections', () => {
      const dataWithXSS = {
        data: {
          ...validBlogData.data,
          sections: [
            {
              subtitle: createXSSMultilingual(),
              content: createXSSMultilingual(),
            },
          ],
        },
      };
      expectValidData(addBlogRequestSchema, dataWithXSS);
    });
  });
});

// ============================================================================
// Update Blog Request Schema Tests
// ============================================================================

describe('updateBlogRequestSchema', () => {
  const validUpdateData = {
    ...createValidBlogData(),
    id: createMongoId(),
  };

  describe('Valid Input', () => {
    it('should accept valid update data with MongoDB ID', () => {
      expectValidData(updateBlogRequestSchema, validUpdateData);
    });

    it('should accept update data with all blog fields', () => {
      const completeData = {
        ...validUpdateData,
        data: {
          ...validUpdateData.data,
          imagesChanged: true,
        },
      };
      expectValidData(updateBlogRequestSchema, completeData);
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(updateBlogRequestSchema, validUpdateData, 'id');
  });

  describe('Required Fields', () => {
    it('should require id field', () => {
      const dataWithoutId = createValidBlogData();
      expectInvalidData(updateBlogRequestSchema, dataWithoutId);
    });

    it('should require all blog data fields', () => {
      const { title, ...dataWithoutTitle } = validUpdateData.data; // eslint-disable-line
      expectInvalidData(updateBlogRequestSchema, {
        ...validUpdateData,
        data: dataWithoutTitle,
      });
    });
  });

  describe('Multilingual Field Validation', () => {
    it('should require all languages for title', () => {
      expectValidData(updateBlogRequestSchema, validUpdateData);
    });

    it('should reject title missing Romanian', () => {
      const invalidData = {
        ...validUpdateData,
        data: {
          ...validUpdateData.data,
          title: { ru: 'Test RU', en: 'Test EN' },
        },
      };
      expectInvalidData(updateBlogRequestSchema, invalidData);
    });

    it('should reject title missing Russian', () => {
      const invalidData = {
        ...validUpdateData,
        data: {
          ...validUpdateData.data,
          title: { ro: 'Test RO', en: 'Test EN' },
        },
      };
      expectInvalidData(updateBlogRequestSchema, invalidData);
    });

    it('should reject title missing English', () => {
      const invalidData = {
        ...validUpdateData,
        data: {
          ...validUpdateData.data,
          title: { ro: 'Test RO', ru: 'Test RU' },
        },
      };
      expectInvalidData(updateBlogRequestSchema, invalidData);
    });

    it('should reject title with empty strings', () => {
      const invalidData = {
        ...validUpdateData,
        data: {
          ...validUpdateData.data,
          title: { ro: '', ru: '', en: '' },
        },
      };
      expectInvalidData(updateBlogRequestSchema, invalidData);
    });
  });

  describe('Enum Validation', () => {
    it('should accept tag = NEWS', () => {
      const data = {
        ...validUpdateData,
        data: {
          ...validUpdateData.data,
          tag: BlogTags.NEWS,
        },
      };
      expectValidData(updateBlogRequestSchema, data);
    });

    it('should accept tag = RECOMMENDATIONS', () => {
      const data = {
        ...validUpdateData,
        data: {
          ...validUpdateData.data,
          tag: BlogTags.RECOMMENDATIONS,
        },
      };
      expectValidData(updateBlogRequestSchema, data);
    });

    it('should accept tag = EXPERIENCES', () => {
      const data = {
        ...validUpdateData,
        data: {
          ...validUpdateData.data,
          tag: BlogTags.EXPERIENCES,
        },
      };
      expectValidData(updateBlogRequestSchema, data);
    });

    it('should reject invalid tag value', () => {
      const invalidData = {
        ...validUpdateData,
        data: {
          ...validUpdateData.data,
          tag: 'INVALID_TAG' as any, // eslint-disable-line
        },
      };
      expectInvalidData(updateBlogRequestSchema, invalidData);
    });
  });
});

// ============================================================================
// Delete Blog Request Schema Tests
// ============================================================================

describe('deleteBlogRequestSchema', () => {
  const validDeleteData = {
    id: createMongoId(),
  };

  describe('Valid Input', () => {
    it('should accept valid MongoDB ID', () => {
      expectValidData(deleteBlogRequestSchema, validDeleteData);
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(deleteBlogRequestSchema, validDeleteData, 'id');
  });

  describe('Required Fields', () => {
    it('should require id field', () => {
      expectInvalidData(deleteBlogRequestSchema, {});
    });
  });

  describe('Type Validation', () => {
    it('should reject non-string id', () => {
      expectInvalidData(deleteBlogRequestSchema, { id: 123 });
    });
  });
});

// ============================================================================
// Get Blog Request Schema Tests
// ============================================================================

describe('getBlogRequestSchema', () => {
  const validGetData = {
    id: createMongoId(),
  };

  describe('Valid Input', () => {
    it('should accept valid MongoDB ID', () => {
      expectValidData(getBlogRequestSchema, validGetData);
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(getBlogRequestSchema, validGetData, 'id');
  });

  describe('Required Fields', () => {
    it('should require id field', () => {
      expectInvalidData(getBlogRequestSchema, {});
    });
  });

  describe('Type Validation', () => {
    it('should reject non-string id', () => {
      expectInvalidData(getBlogRequestSchema, { id: 123 });
    });
  });
});

// ============================================================================
// Get Limited Blogs Request Schema Tests
// ============================================================================

describe('getLimitedBlogsRequestSchema', () => {
  const validLimitData = {
    limit: 10,
  };

  describe('Valid Input', () => {
    it('should accept valid limit number', () => {
      expectValidData(getLimitedBlogsRequestSchema, validLimitData);
    });

    it('should accept limit of 0', () => {
      expectValidData(getLimitedBlogsRequestSchema, { limit: 0 });
    });

    it('should accept limit of 1', () => {
      expectValidData(getLimitedBlogsRequestSchema, { limit: 1 });
    });

    it('should accept large limit numbers', () => {
      expectValidData(getLimitedBlogsRequestSchema, { limit: 1000 });
    });

    it('should accept negative limit (schema allows it)', () => {
      expectValidData(getLimitedBlogsRequestSchema, { limit: -1 });
    });
  });

  describe('Required Fields', () => {
    it('should require limit field', () => {
      expectInvalidData(getLimitedBlogsRequestSchema, {});
    });
  });

  describe('Type Validation', () => {
    it('should reject non-number limit', () => {
      expectInvalidData(getLimitedBlogsRequestSchema, { limit: '10' });
    });

    it('should reject string number limit', () => {
      expectInvalidData(getLimitedBlogsRequestSchema, { limit: '10' });
    });

    it('should reject boolean limit', () => {
      expectInvalidData(getLimitedBlogsRequestSchema, { limit: true });
    });

    it('should reject null limit', () => {
      expectInvalidData(getLimitedBlogsRequestSchema, { limit: null });
    });

    it('should reject undefined limit', () => {
      expectInvalidData(getLimitedBlogsRequestSchema, { limit: undefined });
    });
  });
});
