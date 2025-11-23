# Navigation Mocking in Vitest: Comprehensive Research

**Date:** 2025-01-23
**Context:** Research conducted while refactoring `ProductInfo.test.tsx` to reduce mocking complexity

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Core Constraints](#core-constraints)
- [Approaches Explored](#approaches-explored)
  - [1. Setup Files Pattern](#1-setup-files-pattern)
  - [2. `__mocks__` Folders](#2-__mocks__-folders)
  - [3. Single Navigation Library](#3-single-navigation-library)
  - [4. `vi.mock()` Inside `vi.hoisted()`](#4-vimock-inside-vihoisted)
  - [5. Global State in Setup Files](#5-global-state-in-setup-files)
  - [6. Helper Functions and Factories](#6-helper-functions-and-factories)
- [Current Recommended Pattern](#current-recommended-pattern)
- [Future Improvements](#future-improvements)
- [Quick Reference](#quick-reference)
- [Sources](#sources)

---

## Overview

This document summarizes an exhaustive exploration of patterns to simplify navigation mocking in Vitest tests for a Next.js 15 + next-intl application.

### The Goal

Reduce the ~40 lines of navigation mock boilerplate required in component tests while maintaining:
- Per-test flexibility (different `pathname` values)
- Access to mock functions for assertions
- Test isolation
- Type safety

### The Verdict

After exploring 6 different approaches, the **inline `vi.hoisted()` pattern is optimal** despite its verbosity. This is due to fundamental constraints in Vitest's module hoisting mechanism.

---

## The Problem

### Component Requirements

Our components use two navigation modules:

1. **`next/navigation`** (Next.js core)
   - Provides: `useSearchParams`, `useRouter`, `usePathname`
   - Used by: 14 files (primarily for `useSearchParams`)

2. **`@/i18n/navigation`** (next-intl wrapper)
   - Provides: `Link`, `useRouter`, `usePathname`, `redirect`, `getPathname`
   - Used by: 37 files
   - **Does NOT provide:** `useSearchParams` (critical limitation)

### Test Requirements

When testing components like `ProductInfo`:
- Must mock both `next/navigation` AND `@/i18n/navigation`
- Need different `pathname` values per test (`/en/product/PROD001`, `/en/catalog`, etc.)
- Need access to mock functions for assertions (`expect(mockPush).toHaveBeenCalled()`)
- Must maintain test isolation

### Current Pattern (40+ lines)

```typescript
const navMocks = vi.hoisted(() => {
  const pathname = '/en/product/PROD001';
  const searchParams = new URLSearchParams();

  return {
    nextNavigation: {
      searchParams,
      router: {
        push: vi.fn(),
        replace: vi.fn(),
      },
      pathname,
    },
    i18nNavigation: {
      router: {
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
      },
      pathname,
      Link: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
        <a {...props}>{children}</a>
      ),
      redirect: vi.fn(),
      getPathname: vi.fn(() => pathname),
    },
  };
});

vi.mock('next/navigation', () => ({
  useSearchParams: () => navMocks.nextNavigation.searchParams,
  useRouter: () => navMocks.nextNavigation.router,
  usePathname: () => navMocks.nextNavigation.pathname,
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => navMocks.i18nNavigation.router,
  usePathname: () => navMocks.i18nNavigation.pathname,
  Link: navMocks.i18nNavigation.Link,
  redirect: navMocks.i18nNavigation.redirect,
  getPathname: navMocks.i18nNavigation.getPathname,
}));
```

---

## Core Constraints

### Vitest Hoisting Mechanism

Understanding execution order is critical to why certain patterns don't work.

**Execution Sequence:**

```
┌─────────────────────────────────────────────────┐
│ 1. Setup files run (setup.ts)                  │
│    - Global configuration                       │
│    - Environment variables                      │
│    - globalThis assignments                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 2. Test file: vi.hoisted() callbacks execute   │
│    - Runs BEFORE all imports                    │
│    - Cannot access imported functions           │
│    - Cannot access globalThis from setup ⚠️     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 3. Test file: Static imports evaluated          │
│    - import statements run                      │
│    - Modules are cached                         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 4. Test file: vi.mock() factory functions run  │
│    - Can access values from vi.hoisted()        │
│    - Defines mock implementations               │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 5. Test file: Test code executes               │
│    - describe/it blocks run                     │
│    - Can access globalThis                      │
│    - Can modify mocks in beforeEach             │
└─────────────────────────────────────────────────┘
```

**Key Insight:** `vi.hoisted()` (step 2) executes BEFORE it can access values from setup files (step 1) or imports (step 3).

### Why vi.hoisted() is Required

`vi.mock()` needs to reference variables that are created before imports:

```typescript
// ❌ DOESN'T WORK - pathname is created after imports
import { something } from './module';

const pathname = '/en/product/PROD001';

vi.mock('next/navigation', () => ({
  usePathname: () => pathname, // Error: can't access before initialization
}));

// ✅ WORKS - vi.hoisted() runs before imports
const navMocks = vi.hoisted(() => ({
  pathname: '/en/product/PROD001',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navMocks.pathname, // ✅ Available
}));
```

**Official Documentation:**

> "vi.hoisted executes BEFORE all imports are evaluated. If you need to execute something before imports, use vi.hoisted."
> — [Vitest Vi API Documentation](https://vitest.dev/api/vi.html#vi-hoisted)

---

## Approaches Explored

### 1. Setup Files Pattern

**Question:** Can we put `vi.mock()` calls in the Vitest setup file?

#### Implementation

```typescript
// src/__tests__/setup.ts
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/en', // ⚠️ Fixed value for ALL tests
}));

// CRITICAL: Must clear module cache
vi.resetModules();
```

#### Findings

✅ **Pros:**
- Truly global - runs once before all tests
- Reduces per-file boilerplate

❌ **Cons:**
- **MUST call `vi.resetModules()`** to clear module cache ([Vitest Issue #1450](https://github.com/vitest-dev/vitest/issues/1450))
- **No per-test flexibility** - all tests use same `pathname`
- **Can't access mock functions** for assertions
- **Performance cost** - module reset on every test file

#### Verdict: ❌ **Not Suitable**

The lack of per-test `pathname` customization is a deal-breaker. Tests need different paths:
- `ProductInfo.test.tsx` → `/en/product/PROD001`
- `ProductCard.test.tsx` → `/en/catalog`
- `CheckoutForm.test.tsx` → `/en/checkout`

**Source:** [Vitest GitHub Issue #1450](https://github.com/vitest-dev/vitest/issues/1450)

---

### 2. `__mocks__` Folders

**Question:** Can we use convention-based `__mocks__` folders like Jest?

#### Implementation

**Directory structure:**
```
project-root/
├── __mocks__/
│   └── next/
│       └── navigation.ts
└── src/
    └── i18n/
        ├── __mocks__/
        │   └── navigation.ts
        └── navigation.ts
```

**Mock file:**
```typescript
// __mocks__/next/navigation.ts
import { vi } from 'vitest';

let currentPathname = '/en';

export const setMockPathname = (pathname: string) => {
  currentPathname = pathname;
};

export const usePathname = () => currentPathname;
export const useSearchParams = () => new URLSearchParams();
export const useRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
});
```

**In test files:**
```typescript
// ❌ STILL need explicit vi.mock() call!
vi.mock('next/navigation');

import { setMockPathname } from 'next/navigation';

beforeEach(() => {
  setMockPathname('/en/product/PROD001');
});
```

#### Findings

✅ **Pros:**
- Centralized mock implementations
- Convention-based structure

❌ **Cons:**
- **Still requires `vi.mock()` in every test** - Vitest doesn't auto-discover mocks
- **Stateful pattern** - must reset pathname in `beforeEach`
- **Path alias complications** - `@/i18n/navigation` mock location is awkward
- **No boilerplate reduction** - same number of lines

**Critical difference from Jest:**

> "Beware that if you don't call `vi.mock`, modules are not mocked automatically."
> — [Vitest Mocking Guide](https://vitest.dev/guide/mocking)

#### Verdict: ❌ **Not Suitable**

Provides no benefit over inline mocks while adding complexity.

**Sources:**
- [Vitest Mocking Guide](https://vitest.dev/guide/mocking)
- [Stack Overflow: Manual mocks in Vitest](https://stackoverflow.com/questions/76214135/how-to-do-manual-mocks-in-vitest)

---

### 3. Single Navigation Library

**Question:** Can we eliminate one library and use only `@/i18n/navigation`?

#### Analysis

**What is `@/i18n/navigation`?**

```typescript
// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

It's a **locale-aware wrapper** around Next.js navigation from `next-intl`.

**Comparison:**

| Hook/Function | `@/i18n/navigation` | `next/navigation` | Can Replace? |
|--------------|---------------------|-------------------|--------------|
| `Link` | ✅ Locale-aware | ✅ Basic | Use i18n |
| `useRouter` | ✅ Locale-aware | ✅ Raw | Use i18n |
| `usePathname` | ✅ Locale-aware | ✅ Raw | Use i18n |
| `redirect` | ✅ Locale-aware | ✅ Raw | Use i18n |
| `getPathname` | ✅ Server-side | - | Use i18n |
| **`useSearchParams`** | ❌ **NOT AVAILABLE** | ✅ | **NO** ⚠️ |
| `notFound` | ❌ **NOT AVAILABLE** | ✅ | **NO** ⚠️ |

#### Findings

**Usage in codebase:**
- **14 files import from `next/navigation`** - primarily for `useSearchParams`
- **37 files import from `@/i18n/navigation`** - primarily for `Link` and `useRouter`
- **3 files use BOTH** - need both `useSearchParams` and locale-aware navigation

**Example: ProductInfo.tsx**

```typescript
import { useSearchParams } from 'next/navigation'; // Required ✅
// @/i18n/navigation doesn't export useSearchParams ❌

const searchParams = useSearchParams();
const categoryParam = searchParams.get('category');
```

#### Verdict: ❌ **Not Possible**

`useSearchParams` is not exported by `next-intl`'s `createNavigation`. This is a fundamental API limitation.

**Sources:**
- [next-intl Documentation](https://next-intl-docs.vercel.app/docs/routing/navigation)
- Project analysis: 10+ components require `useSearchParams`

---

### 4. `vi.mock()` Inside `vi.hoisted()`

**Question:** Can we nest `vi.mock()` calls inside `vi.hoisted()` to reduce boilerplate?

#### Attempted Pattern

```typescript
const navMocks = vi.hoisted(() => {
  const pathname = '/en/product/PROD001';

  // Can we do this? ⬇️
  vi.mock('next/navigation', () => ({
    usePathname: () => pathname,
  }));

  return { pathname };
});
```

#### Findings

❌ **Does NOT work** and is NOT the intended pattern.

**Why:**
- Both `vi.hoisted()` and `vi.mock()` are independently hoisted to the top of the file
- Calling `vi.mock()` inside `vi.hoisted()` creates confusion about execution order
- No benefit over calling them separately at the top level

**Correct Pattern: Variable Sharing**

```typescript
// ✅ CORRECT: Define state in vi.hoisted()
const mocks = vi.hoisted(() => ({
  pathname: '/en/product/PROD001',
  usePathname: vi.fn(),
}));

// ✅ CORRECT: Reference hoisted variables in vi.mock()
vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
}));

// ✅ CORRECT: Modify in tests
beforeEach(() => {
  mocks.pathname = '/en/checkout';
  mocks.usePathname.mockReturnValue('/en/checkout');
});
```

#### Verdict: ❌ **Not Applicable**

The APIs are designed to be used separately, not nested.

**Sources:**
- [Vitest Vi API](https://vitest.dev/api/vi)
- [Vitest Issue #3228 - Introduce vi.hoisted](https://github.com/vitest-dev/vitest/issues/3228)

---

### 5. Global State in Setup Files

**Question:** Can we define `navMocks` in setup.ts using `globalThis` and reference it in tests?

#### Attempted Pattern

```typescript
// src/__tests__/setup.ts
globalThis.navMocksFactory = (pathname = '/en') => ({
  pathname,
  searchParams: new URLSearchParams(),
  // ...
});

// test.tsx
const navMocks = vi.hoisted(() => {
  return globalThis.navMocksFactory('/en/product/PROD001');
  // ❌ ERROR: Cannot access 'navMocksFactory' before initialization
});
```

#### Findings

❌ **Does NOT work** due to execution order.

**Execution sequence:**
```
1. setup.ts runs          → globalThis.navMocksFactory defined
2. vi.hoisted() runs      → Tries to access globalThis (fails!)
3. Imports evaluated
4. Tests run              → globalThis.navMocksFactory accessible ✅
```

**The problem:** `vi.hoisted()` (step 2) executes before it can access values from setup.ts (step 1).

**From official docs:**

> "However, it is discouraged to import anything inside of vi.hoisted because imports are already hoisted - if you need to execute something before the tests are running, just execute it in the imported module itself."
> — [Vitest Mocking Guide](https://vitest.dev/guide/mocking)

#### What WOULD Work (But Doesn't Help)

```typescript
// setup.ts
globalThis.navMocks = { pathname: '/en' };

// test.tsx
it('works', () => {
  console.log(globalThis.navMocks.pathname); // ✅ Works in tests
});
```

But this is useless for mocking because `vi.mock()` needs values from `vi.hoisted()`.

#### Verdict: ❌ **Not Suitable**

Cannot access `globalThis` values inside `vi.hoisted()` where they're needed.

**Sources:**
- [Stack Overflow: Vitest global variables in setupfiles](https://stackoverflow.com/questions/74175246/vitest-global-variables-in-setupfiles)
- [GitHub Discussion #4231: How to use vi.hoisting properly](https://github.com/vitest-dev/vitest/discussions/4231)

---

### 6. Helper Functions and Factories

**Question:** Can we import a factory function from `componentTestUtils.tsx`?

#### Attempted Pattern

```typescript
// componentTestUtils.tsx
export function createNavigationMocks(pathname: string) {
  return {
    pathname,
    searchParams: new URLSearchParams(),
    // ...
  };
}

// test.tsx
import { createNavigationMocks } from '@/__tests__/helpers/componentTestUtils';

const navMocks = vi.hoisted(() =>
  createNavigationMocks('/en/product/PROD001')
  // ❌ ERROR: Cannot access 'createNavigationMocks' before initialization
);
```

#### Findings

❌ **Does NOT work** - cannot import functions to use inside `vi.hoisted()`.

**Why:**
- `vi.hoisted()` executes BEFORE imports are evaluated
- Imported functions are not yet available when `vi.hoisted()` runs
- This is a fundamental constraint of the hoisting mechanism

**From official docs:**

> "vi.hoisted executes BEFORE all imports are evaluated"
> — [Vitest Documentation](https://vitest.dev/api/vi.html#vi-hoisted)

#### Current Solution

The factory function exists as a **template/reference** only:

```typescript
/**
 * Navigation mock pattern for vi.hoisted()
 *
 * ⚠️ IMPORTANT: This function serves as a TEMPLATE/REFERENCE ONLY.
 * Due to Vitest's hoisting mechanism, you CANNOT import and use this function.
 * You MUST copy the pattern inline in your test files.
 *
 * @deprecated This function cannot be used directly. Copy the pattern from the example.
 */
export function createNavigationMocks(options?: { pathname?: string }) {
  // ... implementation serves as reference
}
```

#### Verdict: ❌ **Not Possible**

Helper functions cannot be imported into `vi.hoisted()`. Template documentation is the best alternative.

**Sources:**
- [Vitest Hoisting Documentation](https://vitest.dev/api/vi.html#vi-hoisted)
- [Runebook: Leveraging vi.hoisted](https://runebook.dev/en/articles/vitest/api/vi/vi-hoisted-0-31-0)

---

## Current Recommended Pattern

After exhaustive research, the **inline `vi.hoisted()` pattern remains optimal**.

### Complete Example

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Suspense, type ReactNode } from 'react';

// Create navigation mocks using vi.hoisted() - must be defined inline
const navMocks = vi.hoisted(() => {
  const pathname = '/en/product/PROD001'; // ← Customize per test file
  const searchParams = new URLSearchParams();

  return {
    nextNavigation: {
      searchParams,
      router: {
        push: vi.fn(),
        replace: vi.fn(),
      },
      pathname,
    },
    i18nNavigation: {
      router: {
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
      },
      pathname,
      Link: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
        <a {...props}>{children}</a>
      ),
      redirect: vi.fn(),
      getPathname: vi.fn(() => pathname),
    },
  };
});

// Setup mocks BEFORE other imports
vi.mock('next/navigation', () => ({
  useSearchParams: () => navMocks.nextNavigation.searchParams,
  useRouter: () => navMocks.nextNavigation.router,
  usePathname: () => navMocks.nextNavigation.pathname,
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => navMocks.i18nNavigation.router,
  usePathname: () => navMocks.i18nNavigation.pathname,
  Link: navMocks.i18nNavigation.Link,
  redirect: navMocks.i18nNavigation.redirect,
  getPathname: navMocks.i18nNavigation.getPathname,
}));

// Now import components and test utilities
import { screen, cleanup, waitFor } from '@testing-library/react';
import { createMockProduct, createTestQueryClient, renderWithProviders } from '@/__tests__/helpers/componentTestUtils';
import ProductInfo from '@/components/product/ProductInfo';

describe('ProductInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without crashing', async () => {
    const queryClient = createTestQueryClient();
    const mockProduct = createMockProduct({ custom_id: 'PROD001' });

    // Pre-populate cache with correct tRPC key structure
    queryClient.setQueryData(
      [['products', 'getProductById'], { input: { id: 'PROD001' }, type: 'query' }],
      { product: mockProduct }
    );

    renderWithProviders(
      <Suspense fallback={<div>Loading product...</div>}>
        <ProductInfo id='PROD001' />
      </Suspense>,
      { queryClient }
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading product...')).not.toBeInTheDocument();
    });

    // Assertions...
  });
});
```

### Why This Pattern is Optimal

✅ **Maximum Flexibility**
- Change `pathname` in one place (line 8)
- Different values per test file
- No shared state between tests

✅ **Access to Mock Functions**
- Can assert: `expect(navMocks.i18nNavigation.router.push).toHaveBeenCalledWith('/cart')`
- Can clear: `vi.clearAllMocks()` in `beforeEach`

✅ **Test Isolation**
- No global state
- Each test file is self-contained
- Clear dependencies

✅ **Clear and Explicit**
- Everything visible in the test file
- No hidden behavior from external files
- Easy to debug

❌ **Verbose**
- ~40 lines of boilerplate
- Must be duplicated in each test file
- But this is the trade-off for flexibility and clarity

---

## Future Improvements

### 1. VS Code Snippet

Create a snippet to auto-paste the pattern:

```json
{
  "Vitest Navigation Mocks": {
    "prefix": "vitest-nav-mocks",
    "body": [
      "const navMocks = vi.hoisted(() => {",
      "  const pathname = '${1:/en}';",
      "  const searchParams = new URLSearchParams();",
      "",
      "  return {",
      "    nextNavigation: {",
      "      searchParams,",
      "      router: {",
      "        push: vi.fn(),",
      "        replace: vi.fn(),",
      "      },",
      "      pathname,",
      "    },",
      "    i18nNavigation: {",
      "      router: {",
      "        push: vi.fn(),",
      "        replace: vi.fn(),",
      "        prefetch: vi.fn(),",
      "        back: vi.fn(),",
      "        forward: vi.fn(),",
      "        refresh: vi.fn(),",
      "      },",
      "      pathname,",
      "      Link: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (",
      "        <a {...props}>{children}</a>",
      "      ),",
      "      redirect: vi.fn(),",
      "      getPathname: vi.fn(() => pathname),",
      "    },",
      "  };",
      "});",
      "",
      "vi.mock('next/navigation', () => ({",
      "  useSearchParams: () => navMocks.nextNavigation.searchParams,",
      "  useRouter: () => navMocks.nextNavigation.router,",
      "  usePathname: () => navMocks.nextNavigation.pathname,",
      "}));",
      "",
      "vi.mock('@/i18n/navigation', () => ({",
      "  useRouter: () => navMocks.i18nNavigation.router,",
      "  usePathname: () => navMocks.i18nNavigation.pathname,",
      "  Link: navMocks.i18nNavigation.Link,",
      "  redirect: navMocks.i18nNavigation.redirect,",
      "  getPathname: navMocks.i18nNavigation.getPathname,",
      "}));"
    ],
    "description": "Insert Vitest navigation mocks pattern"
  }
}
```

### 2. Potential Vitest Improvements

Watch for these potential improvements to Vitest:

- **Global mock configuration** with per-test overrides
- **Enhanced `vi.hoisted()` API** that can access setup values
- **Better module mocking DX** overall

Track: [Vitest GitHub Issues](https://github.com/vitest-dev/vitest/issues)

### 3. Alternative Testing Approaches

Consider these alternatives if the boilerplate becomes unmanageable:

- **Mock only at integration level** - Test components without mocking navigation
- **Use Playwright/Cypress** - E2E tests don't need navigation mocks
- **Refactor components** - Separate navigation logic from presentation

---

## Quick Reference

### Decision Tree: "Should I use...?"

```
Need to mock navigation hooks?
│
├─ YES → Use inline vi.hoisted() pattern
│        (40 lines, maximum flexibility)
│
└─ NO → Consider if you really need the test
        (Integration tests might be better)

Want to centralize mocks?
│
├─ setup.ts → ❌ Can't customize per test
├─ __mocks__ → ❌ Still need vi.mock() calls
├─ Helper function → ❌ Can't import into vi.hoisted()
└─ Template docs → ✅ Best you can do
```

### Comparison Table

| Approach | Boilerplate | Flexibility | Test Isolation | Verdict |
|----------|-------------|-------------|----------------|---------|
| Inline `vi.hoisted()` | ~40 lines per test | ✅ Full | ✅ Perfect | ✅ **Recommended** |
| Setup files | ~5 lines per test | ❌ None | ⚠️ Shared state | ❌ Not suitable |
| `__mocks__` folders | ~40 lines total + calls | ⚠️ Stateful | ⚠️ Shared state | ❌ No benefit |
| Single library | N/A | N/A | N/A | ❌ Not possible |
| Nested `vi.mock()` | N/A | N/A | N/A | ❌ Not intended |
| Global `globalThis` | N/A | N/A | N/A | ❌ Execution order |
| Helper functions | N/A | N/A | N/A | ❌ Hoisting constraint |

### When to Use Which Mock

| Need | Use `next/navigation`? | Use `@/i18n/navigation`? |
|------|------------------------|--------------------------|
| `useSearchParams` | ✅ Required | ❌ Not available |
| Locale-aware `Link` | ⚠️ Basic version | ✅ Preferred |
| Locale-aware routing | ⚠️ Manual | ✅ Automatic |
| `notFound()` | ✅ Required | ❌ Not available |

---

## Sources

### Official Documentation

- [Vitest Vi API Documentation](https://vitest.dev/api/vi)
- [Vitest Mocking Guide](https://vitest.dev/guide/mocking)
- [Vitest Mocking Modules](https://vitest.dev/guide/mocking/modules.html)
- [Next.js Testing with Vitest](https://nextjs.org/docs/app/guides/testing/vitest)
- [next-intl Navigation Documentation](https://next-intl-docs.vercel.app/docs/routing/navigation)

### GitHub Issues & Discussions

- [Vitest Issue #1450 - vi.mock ignored if module imported in setup file](https://github.com/vitest-dev/vitest/issues/1450)
- [Vitest Issue #3228 - Introduce vi.hoisted](https://github.com/vitest-dev/vitest/issues/3228)
- [Vitest Discussion #3589 - Different mocks per test](https://github.com/vitest-dev/vitest/discussions/3589)
- [Vitest Discussion #4231 - How to use vi.hoisting properly](https://github.com/vitest-dev/vitest/discussions/4231)
- [Vitest Discussion #4508 - Reusing vi.mock](https://github.com/vitest-dev/vitest/discussions/4508)
- [Vitest Discussion #4927 - Mock with relative path](https://github.com/vitest-dev/vitest/discussions/4927)
- [Vitest Discussion #5334 - vi.mock not working as expected](https://github.com/vitest-dev/vitest/discussions/5334)
- [Vitest Issue #3081 - Mocking module with relative path alias](https://github.com/vitest-dev/vitest/issues/3081)

### Stack Overflow

- [How to mock next/router for unit testing with vitest?](https://stackoverflow.com/questions/75831875/how-to-mock-next-router-for-unit-testing-with-vitest)
- [How to do manual mocks in Vitest?](https://stackoverflow.com/questions/76214135/how-to-do-manual-mocks-in-vitest)
- [Vitest module mock with alias paths](https://stackoverflow.com/questions/75741665/vitest-module-mock-with-alias-paths)
- [Vitest global variables in setupfiles](https://stackoverflow.com/questions/74175246/vitest-global-variables-in-setupfiles)
- [vi.mock factory variables](https://stackoverflow.com/questions/78213334/if-you-are-using-vi-mock-factory-make-sure-there-are-no-top-level-variables-i)

### Blog Posts & Guides

- [Leveraging vi.hoisted in Vitest Tests - Runebook](https://runebook.dev/en/articles/vitest/api/vi/vi-hoisted-0-31-0)
- [Mastering vi.hoisted for Effective Vitest Testing - Runebook](https://runebook.dev/en/articles/vitest/api/vi/vi-hoisted)
- [Advanced guide to Vitest - LogRocket](https://blog.logrocket.com/advanced-guide-vitest-testing-mocking/)
- [Module and environment variable stubbing - Maya Shavin](https://mayashavin.com/articles/mock-module-stub-variable-vitest)
- [The Hidden Power of Your Test Setup and Mocks - DEV Community](https://dev.to/it-wibrc/the-hidden-power-of-your-test-setup-and-mocks-1441)
- [Mock window.matchMedia in Vitest - Rebecca M Deprey](https://rebeccamdeprey.com/blog/mock-windowmatchmedia-in-vitest)

---

## Conclusion

Navigation mocking in Vitest is verbose by design due to the hoisting mechanism. After exploring 6 different approaches, the inline `vi.hoisted()` pattern remains the best solution despite requiring ~40 lines of boilerplate.

**The good news:** This pattern provides maximum flexibility, test isolation, and clarity - exactly what you need for reliable component tests.

**The reality:** The verbosity is a trade-off for these benefits. Accept it, document it, and use IDE snippets to reduce friction.

---

*Document Version: 1.0*
*Last Updated: 2025-01-23*
*Research conducted by: Claude Code*
