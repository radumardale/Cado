import { describe, it } from 'vitest';
import { Ocasions } from '@/lib/enums/Ocasions';
import { sendMessageRequest } from '@/lib/validation/contacts/sendMessageRequest';
import { addHomeBannerRequestSchema } from '@/lib/validation/home/addHomeBannerRequest';
import { deleteHomeBannerRequestSchema } from '@/lib/validation/home/updateHomeBannerRequest';
import { updateHomeOcasionRequestSchema } from '@/lib/validation/home/updateHomeOcasion';
import { updateSeasonCatalogRequestSchema } from '@/lib/validation/home/updateSeasonCatalogRequest';
import {
  createMultilingualString,
  createMongoId,
  createValidEmail,
  expectValidData,
  expectInvalidData,
  testMongoIdField,
} from '../shared/test-helpers';

// ============================================================================
// Factory Functions
// ============================================================================

function createValidContactMessage() {
  return {
    email: createValidEmail(),
    name: 'John Doe',
    tel_number: '+37312345678',
    contact_method: ['EMAIL' as const],
    message: 'This is a test message',
    subject: 'ORDER_ISSUE' as const,
    termsAccepted: true,
  };
}

function createValidAddHomeBannerRequest() {
  return {
    ocasion: Ocasions.VALENTINES_DAY,
  };
}

function createValidDeleteHomeBannerRequest() {
  return {
    id: createMongoId(),
  };
}

function createValidUpdateHomeOcasionRequest() {
  return {
    id: createMongoId(),
    ocasionTitle: createMultilingualString("Valentine's Day"),
    ocasion: Ocasions.VALENTINES_DAY as any, // eslint-disable-line
  };
}

function createValidUpdateSeasonCatalogRequest() {
  return {
    id: createMongoId(),
    link: 'https://cado.md/catalog',
    active: true,
  };
}

// ============================================================================
// Contact Form Schema Tests (sendMessageRequest)
// ============================================================================

describe('sendMessageRequest', () => {
  const validData = createValidContactMessage();

  describe('Valid Input', () => {
    it('should accept valid contact form data', () => {
      expectValidData(sendMessageRequest, validData);
    });

    it('should accept contact_method with EMAIL only', () => {
      expectValidData(sendMessageRequest, {
        ...validData,
        contact_method: ['EMAIL'],
      });
    });

    it('should accept contact_method with TEL only', () => {
      expectValidData(sendMessageRequest, {
        ...validData,
        contact_method: ['TEL'],
      });
    });

    it('should accept contact_method with both EMAIL and TEL', () => {
      expectValidData(sendMessageRequest, {
        ...validData,
        contact_method: ['EMAIL', 'TEL'],
      });
    });

    it('should accept minimum name length', () => {
      expectValidData(sendMessageRequest, {
        ...validData,
        name: 'AB',
      });
    });

    it('should accept maximum name length', () => {
      expectValidData(sendMessageRequest, {
        ...validData,
        name: 'A'.repeat(40),
      });
    });

    it('should accept minimum tel_number length', () => {
      expectValidData(sendMessageRequest, {
        ...validData,
        tel_number: '123456789',
      });
    });

    it('should accept maximum tel_number length', () => {
      expectValidData(sendMessageRequest, {
        ...validData,
        tel_number: '1'.repeat(23),
      });
    });

    it('should accept minimum message length', () => {
      expectValidData(sendMessageRequest, {
        ...validData,
        message: 'Hi',
      });
    });

    it('should accept all subject types', () => {
      const subjects = ['ORDER_ISSUE', 'GIFT_ASSITANCE', 'COMPANY_COLLABORATION', 'OTHER'] as const;
      subjects.forEach(subject => {
        expectValidData(sendMessageRequest, {
          ...validData,
          subject,
        });
      });
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user_name@example-domain.com',
      ];

      validEmails.forEach(email => {
        expectValidData(sendMessageRequest, {
          ...validData,
          email,
        });
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user @example.com',
      ];

      invalidEmails.forEach(email => {
        expectInvalidData(sendMessageRequest, {
          ...validData,
          email,
        });
      });
    });

    it('should reject empty email', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        email: '',
      });
    });
  });

  describe('Name Validation', () => {
    it('should reject name shorter than 2 characters', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        name: 'A',
      });
    });

    it('should reject name longer than 40 characters', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        name: 'A'.repeat(41),
      });
    });

    it('should reject empty name', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        name: '',
      });
    });
  });

  describe('Phone Number Validation', () => {
    it('should reject tel_number shorter than 9 characters', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        tel_number: '12345678',
      });
    });

    it('should reject tel_number longer than 23 characters', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        tel_number: '1'.repeat(24),
      });
    });

    it('should reject empty tel_number', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        tel_number: '',
      });
    });
  });

  describe('Contact Method Validation', () => {
    it('should accept empty contact_method array (schema allows it)', () => {
      expectValidData(sendMessageRequest, {
        ...validData,
        contact_method: [],
      });
    });

    it('should reject invalid contact_method', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        contact_method: ['INVALID'] as any, // eslint-disable-line
      });
    });

    it('should reject non-array contact_method', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        contact_method: 'EMAIL' as any, // eslint-disable-line
      });
    });
  });

  describe('Message Validation', () => {
    it('should reject message shorter than 2 characters', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        message: 'A',
      });
    });

    it('should reject empty message', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        message: '',
      });
    });
  });

  describe('Subject Validation', () => {
    it('should reject invalid subject', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        subject: 'INVALID_SUBJECT' as any, // eslint-disable-line
      });
    });
  });

  describe('Terms Acceptance', () => {
    it('should accept termsAccepted = true', () => {
      expectValidData(sendMessageRequest, {
        ...validData,
        termsAccepted: true,
      });
    });

    it('should reject termsAccepted = false', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        termsAccepted: false,
      });
    });

    it('should reject non-boolean termsAccepted', () => {
      expectInvalidData(sendMessageRequest, {
        ...validData,
        termsAccepted: 'true' as any, // eslint-disable-line
      });
    });
  });

  describe('Required Fields', () => {
    it('should require email field', () => {
      const { email, ...withoutEmail } = validData; // eslint-disable-line
      expectInvalidData(sendMessageRequest, withoutEmail);
    });

    it('should require name field', () => {
      const { name, ...withoutName } = validData; // eslint-disable-line
      expectInvalidData(sendMessageRequest, withoutName);
    });

    it('should require tel_number field', () => {
      const { tel_number, ...withoutTel } = validData; // eslint-disable-line
      expectInvalidData(sendMessageRequest, withoutTel);
    });

    it('should require contact_method field', () => {
      const { contact_method, ...withoutMethod } = validData; // eslint-disable-line
      expectInvalidData(sendMessageRequest, withoutMethod);
    });

    it('should require message field', () => {
      const { message, ...withoutMessage } = validData; // eslint-disable-line
      expectInvalidData(sendMessageRequest, withoutMessage);
    });

    it('should require subject field', () => {
      const { subject, ...withoutSubject } = validData; // eslint-disable-line
      expectInvalidData(sendMessageRequest, withoutSubject);
    });

    it('should require termsAccepted field', () => {
      const { termsAccepted, ...withoutTerms } = validData; // eslint-disable-line
      expectInvalidData(sendMessageRequest, withoutTerms);
    });
  });
});

// ============================================================================
// Add Home Banner Request Schema Tests
// ============================================================================

describe('addHomeBannerRequestSchema', () => {
  const validData = createValidAddHomeBannerRequest();

  describe('Valid Input', () => {
    it('should accept valid add home banner request', () => {
      expectValidData(addHomeBannerRequestSchema, validData);
    });

    it('should accept all Ocasions enum values', () => {
      const ocasionValues = Object.values(Ocasions);
      ocasionValues.forEach(ocasion => {
        expectValidData(addHomeBannerRequestSchema, {
          ocasion,
        });
      });
    });
  });

  describe('Enum Validation', () => {
    it('should reject invalid ocasion value', () => {
      expectInvalidData(addHomeBannerRequestSchema, {
        ocasion: 'INVALID_OCASION' as any, // eslint-disable-line
      });
    });

    it('should reject lowercase ocasion value', () => {
      expectInvalidData(addHomeBannerRequestSchema, {
        ocasion: 'valentines_day' as any, // eslint-disable-line
      });
    });
  });

  describe('Required Fields', () => {
    it('should require ocasion field', () => {
      expectInvalidData(addHomeBannerRequestSchema, {});
    });
  });

  describe('Type Validation', () => {
    it('should reject non-string ocasion', () => {
      expectInvalidData(addHomeBannerRequestSchema, {
        ocasion: 123 as any, // eslint-disable-line
      });
    });

    it('should reject null ocasion', () => {
      expectInvalidData(addHomeBannerRequestSchema, {
        ocasion: null,
      });
    });
  });
});

// ============================================================================
// Delete Home Banner Request Schema Tests
// ============================================================================

describe('deleteHomeBannerRequestSchema', () => {
  const validData = createValidDeleteHomeBannerRequest();

  describe('Valid Input', () => {
    it('should accept valid delete home banner request', () => {
      expectValidData(deleteHomeBannerRequestSchema, validData);
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(deleteHomeBannerRequestSchema, validData, 'id');
  });

  describe('Required Fields', () => {
    it('should require id field', () => {
      expectInvalidData(deleteHomeBannerRequestSchema, {});
    });
  });

  describe('Type Validation', () => {
    it('should reject non-string id', () => {
      expectInvalidData(deleteHomeBannerRequestSchema, {
        id: 123 as any, // eslint-disable-line
      });
    });

    it('should reject null id', () => {
      expectInvalidData(deleteHomeBannerRequestSchema, {
        id: null,
      });
    });
  });
});

// ============================================================================
// Update Home Ocasion Request Schema Tests
// ============================================================================

describe('updateHomeOcasionRequestSchema', () => {
  const validData = createValidUpdateHomeOcasionRequest();

  describe('Valid Input', () => {
    it('should accept valid update home ocasion request', () => {
      expectValidData(updateHomeOcasionRequestSchema, validData);
    });

    it('should accept DISCOUNTS literal value', () => {
      expectValidData(updateHomeOcasionRequestSchema, {
        ...validData,
        ocasion: 'DISCOUNTS',
      });
    });

    it('should accept all Ocasions enum values', () => {
      const ocasionValues = Object.values(Ocasions);
      ocasionValues.forEach(ocasion => {
        expectValidData(updateHomeOcasionRequestSchema, {
          ...validData,
          ocasion,
        });
      });
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(updateHomeOcasionRequestSchema, validData, 'id');
  });

  describe('Multilingual Field Validation', () => {
    it('should require all languages for ocasionTitle', () => {
      expectValidData(updateHomeOcasionRequestSchema, validData);
    });

    it('should reject ocasionTitle missing Romanian', () => {
      expectInvalidData(updateHomeOcasionRequestSchema, {
        ...validData,
        ocasionTitle: { ru: 'Test RU', en: 'Test EN' },
      });
    });

    it('should reject ocasionTitle missing Russian', () => {
      expectInvalidData(updateHomeOcasionRequestSchema, {
        ...validData,
        ocasionTitle: { ro: 'Test RO', en: 'Test EN' },
      });
    });

    it('should reject ocasionTitle missing English', () => {
      expectInvalidData(updateHomeOcasionRequestSchema, {
        ...validData,
        ocasionTitle: { ro: 'Test RO', ru: 'Test RU' },
      });
    });

    it('should reject ocasionTitle with empty strings', () => {
      expectInvalidData(updateHomeOcasionRequestSchema, {
        ...validData,
        ocasionTitle: { ro: '', ru: '', en: '' },
      });
    });
  });

  describe('Union Validation', () => {
    it('should accept Ocasions enum values', () => {
      expectValidData(updateHomeOcasionRequestSchema, {
        ...validData,
        ocasion: Ocasions.CHRISTMAS_NEW_YEAR,
      });
    });

    it('should accept DISCOUNTS literal', () => {
      expectValidData(updateHomeOcasionRequestSchema, {
        ...validData,
        ocasion: 'DISCOUNTS',
      });
    });

    it('should reject invalid union value', () => {
      expectInvalidData(updateHomeOcasionRequestSchema, {
        ...validData,
        ocasion: 'INVALID_VALUE' as any, // eslint-disable-line
      });
    });
  });

  describe('Required Fields', () => {
    it('should require id field', () => {
      const { id, ...withoutId } = validData; // eslint-disable-line
      expectInvalidData(updateHomeOcasionRequestSchema, withoutId);
    });

    it('should require ocasionTitle field', () => {
      const { ocasionTitle, ...withoutTitle } = validData; // eslint-disable-line
      expectInvalidData(updateHomeOcasionRequestSchema, withoutTitle);
    });

    it('should require ocasion field', () => {
      const { ocasion, ...withoutOcasion } = validData; // eslint-disable-line
      expectInvalidData(updateHomeOcasionRequestSchema, withoutOcasion);
    });
  });
});

// ============================================================================
// Update Season Catalog Request Schema Tests
// ============================================================================

describe('updateSeasonCatalogRequestSchema', () => {
  const validData = createValidUpdateSeasonCatalogRequest();

  describe('Valid Input', () => {
    it('should accept valid update season catalog request', () => {
      expectValidData(updateSeasonCatalogRequestSchema, validData);
    });

    it('should accept active = true', () => {
      expectValidData(updateSeasonCatalogRequestSchema, {
        ...validData,
        active: true,
      });
    });

    it('should accept active = false', () => {
      expectValidData(updateSeasonCatalogRequestSchema, {
        ...validData,
        active: false,
      });
    });

    it('should accept empty link string', () => {
      expectValidData(updateSeasonCatalogRequestSchema, {
        ...validData,
        link: '',
      });
    });

    it('should accept long link URLs', () => {
      expectValidData(updateSeasonCatalogRequestSchema, {
        ...validData,
        link: 'https://cado.md/catalog/valentines-day/for-her/romantic-gifts?sort=price&order=asc',
      });
    });
  });

  describe('MongoDB ID Validation', () => {
    testMongoIdField(updateSeasonCatalogRequestSchema, validData, 'id');
  });

  describe('Required Fields', () => {
    it('should require id field', () => {
      const { id, ...withoutId } = validData; // eslint-disable-line
      expectInvalidData(updateSeasonCatalogRequestSchema, withoutId);
    });

    it('should require link field', () => {
      const { link, ...withoutLink } = validData; // eslint-disable-line
      expectInvalidData(updateSeasonCatalogRequestSchema, withoutLink);
    });

    it('should require active field', () => {
      const { active, ...withoutActive } = validData; // eslint-disable-line
      expectInvalidData(updateSeasonCatalogRequestSchema, withoutActive);
    });
  });

  describe('Type Validation', () => {
    it('should reject non-string link', () => {
      expectInvalidData(updateSeasonCatalogRequestSchema, {
        ...validData,
        link: 123 as any, // eslint-disable-line
      });
    });

    it('should reject non-boolean active', () => {
      expectInvalidData(updateSeasonCatalogRequestSchema, {
        ...validData,
        active: 'true' as any, // eslint-disable-line
      });
    });

    it('should reject null link', () => {
      expectInvalidData(updateSeasonCatalogRequestSchema, {
        ...validData,
        link: null,
      });
    });

    it('should reject null active', () => {
      expectInvalidData(updateSeasonCatalogRequestSchema, {
        ...validData,
        active: null,
      });
    });
  });
});
