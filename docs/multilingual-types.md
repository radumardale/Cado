# Multilingual Type System

## Overview

Cado is a multilingual e-commerce platform supporting **Romanian (ro)**, **Russian (ru)**, and **English (en)**. This document describes the centralized type system for handling multilingual data throughout the application.

## Core Types

All multilingual types are defined globally in `global.d.ts` and available throughout the application without imports.

### MultilingualString

The core type for required text in all three languages.

```typescript
type MultilingualString = {
  ro: string;
  ru: string;
  en: string;
  [key: string]: string; // Allows dynamic locale access
};
```

**Use cases:**
- Product titles and descriptions
- Category names
- UI labels that must be translated
- Any content that requires all languages

**Example:**
```typescript
const productTitle: MultilingualString = {
  ro: 'Cadou pentru Ea',
  ru: 'Подарок для Нее',
  en: 'Gift for Her',
};

// Dynamic access with locale variable
const locale: string = 'ro';
console.log(productTitle[locale]); // "Cadou pentru Ea"
```

### OptionalMultilingualString

Type for optional text that may not be present in all languages.

```typescript
type OptionalMultilingualString = {
  ro?: string;
  ru?: string;
  en?: string;
  [key: string]: string | undefined;
};
```

**Use cases:**
- Optional product details (material, color descriptions)
- Supplementary information
- Fields that may be added later

**Example:**
```typescript
const material: OptionalMultilingualString = {
  ro: 'Bumbac organic',
  en: 'Organic cotton',
  // ru is optional and not provided
};
```

### LocaleCode

Type-safe locale identifier.

```typescript
type LocaleCode = 'ro' | 'ru' | 'en';
```

**Use cases:**
- Function parameters that need type-safe locale
- Locale switching logic
- URL generation with locale prefix

### ActionResponse<T>

Generic response type for server actions and tRPC procedures.

```typescript
interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}
```

**Use cases:**
- tRPC procedure responses
- Server action returns
- API response standardization

**Example:**
```typescript
const response: ActionResponse<Product> = {
  success: true,
  data: product,
};
```

## Migration from Inline Types

### Before (Inline Type)

```typescript
interface HomeBannerInterface {
  _id: string;
  images: {
    ro: string;
    ru: string;
    en: string;
  };
  ocasion: Ocasions;
}
```

### After (Shared Type)

```typescript
interface HomeBannerInterface {
  _id: string;
  images: MultilingualString;
  ocasion: Ocasions;
}
```

## Utility Functions

Located in `src/lib/utils/multilingual.ts`

### Type Guards

#### isMultilingualString

Runtime validation for MultilingualString.

```typescript
import { isMultilingualString } from '@/lib/utils/multilingual';

const data: unknown = { ro: 'Text', ru: 'Текст', en: 'Text' };

if (isMultilingualString(data)) {
  // TypeScript now knows data is MultilingualString
  console.log(data.ro); // ✅ Type-safe
}
```

#### isOptionalMultilingualString

Runtime validation for OptionalMultilingualString.

```typescript
import { isOptionalMultilingualString } from '@/lib/utils/multilingual';

const data: unknown = { ro: 'Text', en: undefined };

if (isOptionalMultilingualString(data)) {
  console.log(data.ro ?? 'fallback');
}
```

### Helper Functions

#### createMultilingualString

Create a MultilingualString with uniform text.

```typescript
import { createMultilingualString } from '@/lib/utils/multilingual';

const test = createMultilingualString('Test');
// { ro: 'Test', ru: 'Test', en: 'Test' }
```

#### createEmptyMultilingualString

Create an empty MultilingualString.

```typescript
import { createEmptyMultilingualString } from '@/lib/utils/multilingual';

const empty = createEmptyMultilingualString();
// { ro: '', ru: '', en: '' }
```

#### getLocalizedText

Get text with fallback support.

```typescript
import { getLocalizedText } from '@/lib/utils/multilingual';

const text = { ro: 'Salut', ru: '', en: 'Hello' };

getLocalizedText(text, 'ru', 'en'); // Returns: 'Hello' (fallback)
getLocalizedText(text, 'ro'); // Returns: 'Salut'
```

#### isComplete

Check if all languages have content.

```typescript
import { isComplete } from '@/lib/utils/multilingual';

const complete = { ro: 'Text', ru: 'Текст', en: 'Text' };
const incomplete = { ro: 'Text', ru: '', en: 'Text' };

isComplete(complete); // true
isComplete(incomplete); // false
```

#### mapMultilingualString

Transform text across all languages.

```typescript
import { mapMultilingualString } from '@/lib/utils/multilingual';

const text = { ro: 'HELLO', ru: 'ПРИВЕТ', en: 'HELLO' };
const lower = mapMultilingualString(text, s => s.toLowerCase());
// { ro: 'hello', ru: 'привет', en: 'hello' }

// Example: Normalize for search
const normalized = mapMultilingualString(title, text =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
);
```

## Validation with Zod

### Required Multilingual Field

```typescript
import { z } from 'zod';

export const productTitleSchema = z.object({
  ro: z.string().min(1, { message: 'Romanian title required' }),
  ru: z.string().min(1, { message: 'Russian title required' }),
  en: z.string().min(1, { message: 'English title required' }),
}) satisfies z.ZodType<MultilingualString>;
```

### Optional Multilingual Field

```typescript
export const optionalMultilingualSchema = z.object({
  ro: z.string().optional(),
  ru: z.string().optional(),
  en: z.string().optional(),
}) satisfies z.ZodType<OptionalMultilingualString>;
```

## Mongoose Schemas

### Required Multilingual Field

```typescript
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    type: {
      ro: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
    required: true,
  },
});
```

### Reusable Schema (Recommended)

```typescript
import { ProductInfoSchema } from '@/models/product/types/productInfo';

const ProductSchema = new mongoose.Schema({
  title: {
    type: ProductInfoSchema,
    required: true,
  },
  description: {
    type: ProductInfoSchema,
    required: true,
  },
});
```

## Best Practices

### ✅ DO

1. **Use global types** - No need to import `MultilingualString`
2. **Use type constraints** - Apply `satisfies` to Zod schemas
3. **Document relationships** - Add comments showing type connections
4. **Use utility functions** - Leverage helpers for common operations
5. **Runtime validation** - Use type guards for untrusted data

```typescript
// ✅ Good: Using shared type
interface Product {
  title: MultilingualString;
  description: MultilingualString;
}

// ✅ Good: Type constraint
const schema = z.object({
  ro: z.string(),
  ru: z.string(),
  en: z.string(),
}) satisfies z.ZodType<MultilingualString>;
```

### ❌ DON'T

1. **Don't create inline types** - Use shared types instead
2. **Don't skip validation** - Always validate untrusted data
3. **Don't ignore optional types** - Use `OptionalMultilingualString` when appropriate
4. **Don't forget index signature** - Needed for dynamic locale access

```typescript
// ❌ Bad: Inline type definition
interface Product {
  title: {
    ro: string;
    ru: string;
    en: string;
  };
}

// ❌ Bad: Missing index signature
type BadMultilingual = {
  ro: string;
  ru: string;
  en: string;
  // Missing: [key: string]: string;
};
```

## Common Patterns

### Dynamic Locale Access

```typescript
function getTitle(product: Product, locale: string): string {
  return product.title[locale] || product.title.en; // Fallback to English
}
```

### Creating Normalized Titles

```typescript
const normalizedTitle: MultilingualString = {
  ro: title.ro.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(),
  ru: title.ru.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(),
  en: title.en.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(),
};

// Or using utility:
const normalizedTitle = mapMultilingualString(title, text =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
);
```

### Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(productTitleSchema),
  defaultValues: {
    ro: '',
    ru: '',
    en: '',
  },
});
```

## Files Updated

### ✅ Migrated to Shared Types (20+ files)

#### Core Types
- `global.d.ts` - Type definitions
- `src/lib/types/ActionResponse.ts` - Generic response type

#### Models
- `src/models/product/types/productInfo.ts`
- `src/models/product/types/optionalInfoTexts.ts`
- `src/models/home_banner/types/HomeBannerInterface.ts`
- `src/models/blog/types/SectionInterface.ts`

#### Validation
- `src/lib/validation/product/types/productInfo.ts`
- `src/lib/validation/product/types/optionalInfo.ts`
- `src/lib/validation/image/uploadBannerImageRequest.ts`

#### Enums
- `src/lib/enums/Categories.ts`
- `src/lib/enums/ProductContent.ts`

#### Procedures
- `src/server/procedures/product/addProduct.ts`
- `src/server/procedures/HomeBanner/addHomeBanner.ts`
- `src/server/procedures/image/uploadBannerImage.ts`

#### Utilities
- `src/lib/utils/multilingual.ts` - Helper functions and type guards

### 📋 Remaining Migrations

The following files still use inline multilingual types and can be migrated in future PRs:

#### Server Procedures (~35 files)
- Additional tRPC procedures in `src/server/procedures/`

#### Components (~50 files)
- Admin components
- Product components
- Blog components
- Checkout components

#### Validation Schemas (~15 files)
- Additional Zod schemas in `src/lib/validation/`

#### Other Models (~10 files)
- Additional Mongoose models

**Total remaining:** ~110 files

These migrations are low priority and can be done incrementally without breaking changes.

## Testing

### Unit Tests Example

```typescript
import { isMultilingualString, createMultilingualString } from '@/lib/utils/multilingual';

describe('Multilingual Utils', () => {
  it('validates MultilingualString correctly', () => {
    const valid = { ro: 'Test', ru: 'Тест', en: 'Test' };
    const invalid = { ro: 'Test', ru: 'Тест' };

    expect(isMultilingualString(valid)).toBe(true);
    expect(isMultilingualString(invalid)).toBe(false);
  });

  it('creates uniform multilingual string', () => {
    const result = createMultilingualString('Hello');

    expect(result.ro).toBe('Hello');
    expect(result.ru).toBe('Hello');
    expect(result.en).toBe('Hello');
  });
});
```

## Adding New Languages

To add support for a new language (e.g., French):

1. Update core types in `global.d.ts`:
```typescript
type MultilingualString = {
  ro: string;
  ru: string;
  en: string;
  fr: string; // Add new language
  [key: string]: string;
};

type LocaleCode = 'ro' | 'ru' | 'en' | 'fr'; // Add to union
```

2. Update utility functions in `src/lib/utils/multilingual.ts`
3. Update all Zod schemas to include new field
4. Update all Mongoose schemas
5. Add translations to i18n config

## Related Issues

- Issue #23 - Create shared multilingual type system
- Issue #20 - Type system improvements (parent issue)

## Resources

- [TypeScript Handbook - Global Types](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html)
- [Zod Documentation](https://zod.dev/)
- [Mongoose SchemaTypes](https://mongoosejs.com/docs/schematypes.html)
- [i18n Best Practices](https://www.i18next.com/principles/fallback)

---

**Last Updated:** 2025-11-21
**Status:** ✅ Implemented
**Related PR:** #53
