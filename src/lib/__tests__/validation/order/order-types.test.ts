import { describe, it, expect } from 'vitest';
import { UserData } from '@/lib/validation/order/types/userData';
import { DeliveryDetails } from '@/lib/validation/order/types/deliveryDetails';
import { OrderAddress } from '@/lib/validation/order/types/orderAddress';
import { OrderBillingAddress } from '@/lib/validation/order/types/orderBillingAddress';
import { OrderNormalAddress } from '@/lib/validation/order/types/orderNormalAddress';
import { AdditionalInfoSchema } from '@/lib/validation/order/types/additionalInfo';
import { ClientEntity } from '@/models/order/types/orderEntity';
import {
  expectValidData,
  expectInvalidData,
  expectInvalidDataWithMessage,
  XSS_PAYLOADS,
  SQL_INJECTION_PAYLOADS,
} from '../shared/test-helpers';

/**
 * Order Type Schemas Tests
 *
 * Tests for the order validation type schemas:
 * - UserData: Email, name, and phone validation
 * - DeliveryDetails: Optional delivery information
 * - OrderAddress: Base address structure
 * - OrderBillingAddress: Extended billing address
 * - OrderNormalAddress: Extended normal address
 * - AdditionalInfoSchema: Complete additional info with refinements
 */

describe('UserData Schema', () => {
  const validData = {
    email: 'test@example.com',
    firstname: 'John',
    lastname: 'Doe',
    tel_number: '+373 69 123 456',
  };

  describe('Valid Input', () => {
    it('should accept valid user data', () => {
      expectValidData(UserData, validData);
    });

    it('should accept minimum length names (2 chars)', () => {
      expectValidData(UserData, {
        ...validData,
        firstname: 'Jo',
        lastname: 'Do',
      });
    });

    it('should accept maximum length names (30 chars)', () => {
      expectValidData(UserData, {
        ...validData,
        firstname: 'a'.repeat(30),
        lastname: 'b'.repeat(30),
      });
    });

    it('should accept minimum length phone (2 chars)', () => {
      expectValidData(UserData, {
        ...validData,
        tel_number: '12',
      });
    });

    it('should accept maximum length phone (23 chars)', () => {
      expectValidData(UserData, {
        ...validData,
        tel_number: '1'.repeat(23),
      });
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'first-last@test-domain.com',
        'numbers123@domain456.org',
      ];

      validEmails.forEach(email => {
        expectValidData(UserData, { ...validData, email });
      });
    });

    it('should accept names with special characters', () => {
      expectValidData(UserData, {
        ...validData,
        firstname: 'Ștefan',
        lastname: 'Țărmure',
      });
    });

    it('should accept phone numbers with various formats', () => {
      const phoneFormats = ['+373 69 123 456', '069-123-456', '(022) 123-456', '+1-555-123-4567'];

      phoneFormats.forEach(tel_number => {
        expectValidData(UserData, { ...validData, tel_number });
      });
    });
  });

  describe('Invalid Input - Email', () => {
    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@domain',
        'user @domain.com',
        'user@domain .com',
      ];

      invalidEmails.forEach(email => {
        expectInvalidDataWithMessage(UserData, { ...validData, email }, 'Email invalid');
      });
    });

    it('should reject email shorter than 2 characters', () => {
      expectInvalidData(UserData, { ...validData, email: 'a' });
    });

    it('should reject missing email', () => {
      expectInvalidData(UserData, {
        firstname: validData.firstname,
        lastname: validData.lastname,
        tel_number: validData.tel_number,
      });
    });
  });

  describe('Invalid Input - Firstname', () => {
    it('should reject firstname shorter than 2 characters', () => {
      expectInvalidDataWithMessage(
        UserData,
        { ...validData, firstname: 'a' },
        'Vă rugăm să completați spațiul liber'
      );
    });

    it('should reject firstname longer than 30 characters', () => {
      expectInvalidDataWithMessage(
        UserData,
        { ...validData, firstname: 'a'.repeat(31) },
        'Firstname string cannot be more than 30 characters'
      );
    });

    it('should reject missing firstname', () => {
      expectInvalidData(UserData, {
        email: validData.email,
        lastname: validData.lastname,
        tel_number: validData.tel_number,
      });
    });
  });

  describe('Invalid Input - Lastname', () => {
    it('should reject lastname shorter than 2 characters', () => {
      expectInvalidDataWithMessage(
        UserData,
        { ...validData, lastname: 'a' },
        'Vă rugăm să completați spațiul liber'
      );
    });

    it('should reject lastname longer than 30 characters', () => {
      expectInvalidDataWithMessage(
        UserData,
        { ...validData, lastname: 'a'.repeat(31) },
        'Lastname string cannot be more than 30 characters'
      );
    });

    it('should reject missing lastname', () => {
      expectInvalidData(UserData, {
        email: validData.email,
        firstname: validData.firstname,
        tel_number: validData.tel_number,
      });
    });
  });

  describe('Invalid Input - Phone Number', () => {
    it('should reject phone number shorter than 2 characters', () => {
      expectInvalidDataWithMessage(
        UserData,
        { ...validData, tel_number: '1' },
        'Vă rugăm să completați spațiul liber'
      );
    });

    it('should reject phone number longer than 23 characters', () => {
      expectInvalidDataWithMessage(
        UserData,
        { ...validData, tel_number: '1'.repeat(24) },
        'The phone number cannot be longer than 23 characters'
      );
    });

    it('should reject missing phone number', () => {
      expectInvalidData(UserData, {
        email: validData.email,
        firstname: validData.firstname,
        lastname: validData.lastname,
      });
    });
  });

  describe('Security - XSS and SQL Injection', () => {
    it('should handle XSS payloads in firstname without crashing', () => {
      XSS_PAYLOADS.forEach(payload => {
        const result = UserData.safeParse({ ...validData, firstname: payload });
        // Schema may accept or reject based on length constraints
        // The important thing is it doesn't crash
        expect(result).toBeDefined();
      });
    });

    it('should handle SQL injection in email', () => {
      SQL_INJECTION_PAYLOADS.forEach(payload => {
        const result = UserData.safeParse({ ...validData, email: payload });
        // Most will fail email regex, which is expected
        expect(result).toBeDefined();
      });
    });
  });
});

describe('DeliveryDetails Schema', () => {
  describe('Valid Input', () => {
    it('should accept empty object (all fields optional)', () => {
      expectValidData(DeliveryDetails, {});
    });

    it('should accept all fields provided', () => {
      expectValidData(DeliveryDetails, {
        delivery_date: '2024-12-25',
        hours_intervals: '10:00-12:00',
        message: 'Please deliver to front door',
        comments: 'Ring twice',
      });
    });

    it('should accept partial fields', () => {
      expectValidData(DeliveryDetails, {
        delivery_date: '2024-12-25',
      });
    });

    it('should accept only message field', () => {
      expectValidData(DeliveryDetails, {
        message: 'Special delivery instructions',
      });
    });

    it('should accept long message text', () => {
      expectValidData(DeliveryDetails, {
        message: 'a'.repeat(1000),
        comments: 'b'.repeat(1000),
      });
    });
  });

  describe('Type Validation', () => {
    it('should reject non-string delivery_date', () => {
      expectInvalidData(DeliveryDetails, { delivery_date: 123 });
    });

    it('should reject non-string hours_intervals', () => {
      expectInvalidData(DeliveryDetails, { hours_intervals: true });
    });

    it('should reject non-string message', () => {
      expectInvalidData(DeliveryDetails, { message: null });
    });

    it('should reject non-string comments', () => {
      expectInvalidData(DeliveryDetails, { comments: ['array'] });
    });
  });
});

describe('OrderAddress Schema', () => {
  describe('Valid Input', () => {
    it('should accept empty object (all fields optional)', () => {
      expectValidData(OrderAddress, {});
    });

    it('should accept all fields provided', () => {
      expectValidData(OrderAddress, {
        region: 'Chișinău',
        city: 'Chișinău',
        home_address: 'Strada Ștefan cel Mare',
        home_nr: '123A',
      });
    });

    it('should accept partial address', () => {
      expectValidData(OrderAddress, {
        city: 'Chișinău',
        home_address: 'Strada Puşkin',
      });
    });

    it('should accept only city', () => {
      expectValidData(OrderAddress, {
        city: 'Bălți',
      });
    });

    it('should accept special characters in addresses', () => {
      expectValidData(OrderAddress, {
        region: 'Кишинёв',
        city: 'Chișinău',
        home_address: 'Bulevardul Ștefan cel Mare și Sfânt',
        home_nr: '1/2',
      });
    });
  });

  describe('Type Validation', () => {
    it('should reject non-string region', () => {
      expectInvalidData(OrderAddress, { region: 123 });
    });

    it('should reject non-string city', () => {
      expectInvalidData(OrderAddress, { city: true });
    });

    it('should reject non-string home_address', () => {
      expectInvalidData(OrderAddress, { home_address: null });
    });

    it('should reject non-string home_nr', () => {
      expectInvalidData(OrderAddress, { home_nr: 123 });
    });
  });
});

describe('OrderBillingAddress Schema', () => {
  const validData = {
    region: 'Chișinău',
    city: 'Chișinău',
    home_address: 'Strada Centrală',
    home_nr: '10',
  };

  describe('Valid Input', () => {
    it('should accept base address fields only', () => {
      expectValidData(OrderBillingAddress, validData);
    });

    it('should accept with company fields (legal entity)', () => {
      expectValidData(OrderBillingAddress, {
        ...validData,
        company_name: 'SRL Cado',
        idno: '1234567890',
      });
    });

    it('should accept with personal fields (natural entity)', () => {
      expectValidData(OrderBillingAddress, {
        ...validData,
        firstname: 'Ion',
        lastname: 'Popescu',
      });
    });

    it('should accept all fields together', () => {
      expectValidData(OrderBillingAddress, {
        ...validData,
        company_name: 'SRL Cado',
        idno: '1234567890',
        firstname: 'Ion',
        lastname: 'Popescu',
      });
    });

    it('should accept empty object (all optional)', () => {
      expectValidData(OrderBillingAddress, {});
    });

    it('should accept firstname/lastname with max length (30 chars)', () => {
      expectValidData(OrderBillingAddress, {
        ...validData,
        firstname: 'a'.repeat(30),
        lastname: 'b'.repeat(30),
      });
    });
  });

  describe('Invalid Input', () => {
    it('should reject firstname longer than 30 characters', () => {
      expectInvalidDataWithMessage(
        OrderBillingAddress,
        { ...validData, firstname: 'a'.repeat(31) },
        'Firstname string cannot be more than 30 characters'
      );
    });

    it('should reject lastname longer than 30 characters', () => {
      expectInvalidDataWithMessage(
        OrderBillingAddress,
        { ...validData, lastname: 'b'.repeat(31) },
        'Lastname string cannot be more than 30 characters'
      );
    });

    it('should reject non-string company_name', () => {
      expectInvalidData(OrderBillingAddress, { ...validData, company_name: 123 });
    });

    it('should reject non-string idno', () => {
      expectInvalidData(OrderBillingAddress, { ...validData, idno: true });
    });
  });
});

describe('OrderNormalAddress Schema', () => {
  const validData = {
    region: 'Chișinău',
    city: 'Chișinău',
    home_address: 'Strada Centrală',
    home_nr: '10',
    firstname: 'Maria',
    lastname: 'Ionescu',
  };

  describe('Valid Input', () => {
    it('should accept complete normal address', () => {
      expectValidData(OrderNormalAddress, validData);
    });

    it('should accept firstname/lastname with max length (30 chars)', () => {
      expectValidData(OrderNormalAddress, {
        ...validData,
        firstname: 'a'.repeat(30),
        lastname: 'b'.repeat(30),
      });
    });

    it('should accept with optional address fields missing', () => {
      expectValidData(OrderNormalAddress, {
        firstname: 'Maria',
        lastname: 'Ionescu',
      });
    });
  });

  describe('Invalid Input', () => {
    it('should reject missing firstname', () => {
      expectInvalidDataWithMessage(
        OrderNormalAddress,
        {
          region: validData.region,
          city: validData.city,
          home_address: validData.home_address,
          home_nr: validData.home_nr,
          lastname: validData.lastname,
        },
        'Vă rugăm să completați spațiul liber'
      );
    });

    it('should reject missing lastname', () => {
      expectInvalidDataWithMessage(
        OrderNormalAddress,
        {
          region: validData.region,
          city: validData.city,
          home_address: validData.home_address,
          home_nr: validData.home_nr,
          firstname: validData.firstname,
        },
        'Vă rugăm să completați spațiul liber'
      );
    });

    it('should reject firstname longer than 30 characters', () => {
      expectInvalidDataWithMessage(
        OrderNormalAddress,
        { ...validData, firstname: 'a'.repeat(31) },
        'Firstname string cannot be more than 30 characters'
      );
    });

    it('should reject lastname longer than 30 characters', () => {
      expectInvalidDataWithMessage(
        OrderNormalAddress,
        { ...validData, lastname: 'b'.repeat(31) },
        'Lastname string cannot be more than 30 characters'
      );
    });
  });
});

describe('AdditionalInfoSchema - With Refinements', () => {
  const validUserData = {
    email: 'test@example.com',
    firstname: 'John',
    lastname: 'Doe',
    tel_number: '+373 69 123 456',
  };

  const validData = {
    user_data: validUserData,
    delivery_address: {
      region: 'Chișinău',
      city: 'Chișinău',
      home_address: 'Strada Centrală',
      home_nr: '10',
    },
    billing_address: {
      city: 'Chișinău',
      home_address: 'Strada Billing',
      home_nr: '5',
    },
    billing_checkbox: true,
    entity_type: ClientEntity.Natural,
  };

  describe('Valid Input', () => {
    it('should accept valid additional info with billing_checkbox true', () => {
      expectValidData(AdditionalInfoSchema, validData);
    });

    it('should accept Natural entity with billing_checkbox true', () => {
      expectValidData(AdditionalInfoSchema, {
        ...validData,
        billing_checkbox: true,
        entity_type: ClientEntity.Natural,
      });
    });

    it('should accept Legal entity with billing_checkbox true', () => {
      expectValidData(AdditionalInfoSchema, {
        ...validData,
        billing_checkbox: true,
        entity_type: ClientEntity.Legal,
      });
    });

    it('should accept with billing_checkbox false and complete billing address', () => {
      expectValidData(AdditionalInfoSchema, {
        ...validData,
        billing_checkbox: false,
        billing_address: {
          city: 'Chișinău',
          home_address: 'Strada Billing',
          home_nr: '5',
        },
      });
    });
  });

  describe('Refinement 1: Billing Address City Required When Checkbox False', () => {
    it('should reject missing billing city when billing_checkbox is false', () => {
      const invalidData = {
        ...validData,
        billing_checkbox: false,
        billing_address: {
          home_address: 'Strada Billing',
        },
      };

      const result = AdditionalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.errors.map(e => e.path.join('.'));
        expect(errorPaths).toContain('billing_address.city');
      }
    });

    it('should reject empty billing city when billing_checkbox is false', () => {
      const invalidData = {
        ...validData,
        billing_checkbox: false,
        billing_address: {
          city: '',
          home_address: 'Strada Billing',
        },
      };

      const result = AdditionalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject billing city with 1 character when billing_checkbox is false', () => {
      const invalidData = {
        ...validData,
        billing_checkbox: false,
        billing_address: {
          city: 'C',
          home_address: 'Strada Billing',
        },
      };

      const result = AdditionalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept billing city with 2+ characters when billing_checkbox is false', () => {
      expectValidData(AdditionalInfoSchema, {
        ...validData,
        billing_checkbox: false,
        billing_address: {
          city: 'Ch',
          home_address: 'Strada Billing',
        },
      });
    });
  });

  describe('Refinement 2: Billing Address Street Required When Checkbox False', () => {
    it('should reject missing billing home_address when billing_checkbox is false', () => {
      const invalidData = {
        ...validData,
        billing_checkbox: false,
        billing_address: {
          city: 'Chișinău',
        },
      };

      const result = AdditionalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.errors.map(e => e.path.join('.'));
        expect(errorPaths).toContain('billing_address.home_address');
      }
    });

    it('should reject empty billing home_address when billing_checkbox is false', () => {
      const invalidData = {
        ...validData,
        billing_checkbox: false,
        billing_address: {
          city: 'Chișinău',
          home_address: '',
        },
      };

      const result = AdditionalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject billing home_address with 1 character when billing_checkbox is false', () => {
      const invalidData = {
        ...validData,
        billing_checkbox: false,
        billing_address: {
          city: 'Chișinău',
          home_address: 'S',
        },
      };

      const result = AdditionalInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept billing home_address with 2+ characters when billing_checkbox is false', () => {
      expectValidData(AdditionalInfoSchema, {
        ...validData,
        billing_checkbox: false,
        billing_address: {
          city: 'Chișinău',
          home_address: 'St',
        },
      });
    });
  });

  describe('Invalid Input - Required Fields', () => {
    it('should reject missing user_data', () => {
      expectInvalidData(AdditionalInfoSchema, {
        delivery_address: validData.delivery_address,
        billing_address: validData.billing_address,
        billing_checkbox: validData.billing_checkbox,
        entity_type: validData.entity_type,
      });
    });

    it('should reject missing delivery_address', () => {
      expectInvalidData(AdditionalInfoSchema, {
        user_data: validData.user_data,
        billing_address: validData.billing_address,
        billing_checkbox: validData.billing_checkbox,
        entity_type: validData.entity_type,
      });
    });

    it('should reject missing billing_address', () => {
      expectInvalidData(AdditionalInfoSchema, {
        user_data: validData.user_data,
        delivery_address: validData.delivery_address,
        billing_checkbox: validData.billing_checkbox,
        entity_type: validData.entity_type,
      });
    });

    it('should reject missing billing_checkbox', () => {
      expectInvalidData(AdditionalInfoSchema, {
        user_data: validData.user_data,
        delivery_address: validData.delivery_address,
        billing_address: validData.billing_address,
        entity_type: validData.entity_type,
      });
    });

    it('should reject missing entity_type', () => {
      expectInvalidData(AdditionalInfoSchema, {
        user_data: validData.user_data,
        delivery_address: validData.delivery_address,
        billing_address: validData.billing_address,
        billing_checkbox: validData.billing_checkbox,
      });
    });
  });

  describe('Invalid Input - Entity Type', () => {
    it('should reject invalid entity_type', () => {
      expectInvalidData(AdditionalInfoSchema, {
        ...validData,
        entity_type: 'INVALID_ENTITY',
      });
    });
  });
});
