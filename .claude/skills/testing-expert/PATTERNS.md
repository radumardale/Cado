# Testing Patterns Library

> Referenced from SKILL.md - Full implementation examples and detailed patterns

## Table of Contents

1. [Common Patterns](#common-patterns)
   - [Pattern 1: Component with tRPC Data](#pattern-1-component-with-trpc-data-most-common)
   - [Pattern 2: UI Component](#pattern-2-ui-component-minimal-mocking)
   - [Pattern 3: Isolated Child Mocking](#pattern-3-component-with-isolated-child-mocking)
2. [Navigation Mocking](#navigation-mocking)
3. [tRPC Data Mocking](#trpc-data-mocking)
4. [Suspense Testing](#suspense-testing)
5. [Multilingual Testing](#multilingual-testing-patterns)
6. [Debugging Techniques](#debugging-techniques)
7. [Anti-Patterns](#anti-patterns-we-discovered)
8. [Additional Resources](#additional-resources)

---

## Common Patterns

### Pattern 1: Component with tRPC Data (Most Common)

**Use case:** Testing components that fetch data via tRPC

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Suspense, type ReactNode } from 'react';

// ============================================================================
// NAVIGATION MOCKS - USE VS CODE SNIPPET: vitest-nav-mocks
// ============================================================================
// IMPORTANT: Must be defined BEFORE component imports due to Vitest hoisting

// Next.js core navigation (useSearchParams, useRouter, usePathname)
const nextNav = vi.hoisted(() => {
  const pathname = '/en/product/PROD001'; // ← Customize this
  const searchParams = new URLSearchParams();

  return {
    pathname,
    searchParams,
    router: {
      push: vi.fn(),
      replace: vi.fn(),
    },
  };
});

// Internationalized navigation (next-intl wrapper)
const i18nNav = vi.hoisted(() => {
  const pathname = '/en/product/PROD001'; // ← Customize this

  return {
    pathname,
    router: {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    },
    Link: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
      <a {...props}>{children}</a>
    ),
    redirect: vi.fn(),
    getPathname: vi.fn(() => pathname),
  };
});

// Setup mocks BEFORE other imports
vi.mock('next/navigation', () => ({
  useSearchParams: () => nextNav.searchParams,
  useRouter: () => nextNav.router,
  usePathname: () => nextNav.pathname,
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => i18nNav.router,
  usePathname: () => i18nNav.pathname,
  Link: i18nNav.Link,
  redirect: i18nNav.redirect,
  getPathname: i18nNav.getPathname,
}));

// ============================================================================
// IMPORTS (After mocks)
// ============================================================================
import { screen, cleanup } from '@testing-library/react';
import {
  createMockProduct,
  createTestQueryClient,
  renderSuspenseResolved, // ⭐ NEW: Async helper that auto-waits
} from '@/__tests__/helpers/componentTestUtils';
import ProductInfo from '@/components/product/ProductInfo';

describe('ProductInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    nextNav.searchParams.delete('category');
  });

  afterEach(() => {
    cleanup();
  });

  it('should render product information', async () => {
    const queryClient = createTestQueryClient();
    const mockProduct = createMockProduct({ custom_id: 'PROD001' });

    // Pre-populate tRPC cache with EXACT key structure
    queryClient.setQueryData(
      [['products', 'getProductById'], { input: { id: 'PROD001' }, type: 'query' }],
      { product: mockProduct }
    );

    // ⭐ NEW: Render with async helper - waits automatically for Suspense
    await renderSuspenseResolved(<ProductInfo id='PROD001' />, {
      fallback: <div>Loading...</div>,
      fallbackText: 'Loading...',
      queryClient,
    });

    // Component is ready - test immediately (no manual waitFor needed)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Product');
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });
});
```

---

### Pattern 2: UI Component (Minimal Mocking)

**Use case:** Testing Radix UI components, buttons, forms without navigation

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Switch } from '../switch';

describe('Switch Component', () => {
  beforeEach(() => {
    // Mock ResizeObserver for Radix components
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    cleanup();
  });

  it('should render a switch element', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('should toggle checked state on click', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');

    expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    fireEvent.click(switchElement);
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });
});
```

---

### Pattern 3: Component with Isolated Child Mocking

**Use case:** Testing a container component's logic without child complexity

```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { renderWithProviders } from '@/__tests__/helpers/componentTestUtils';
import Header from '@/components/header/Header';

// Mock ONLY child components to isolate the component under test
vi.mock('@/components/header/TopHeader', () => ({
  default: () => <div data-testid='top-header'>TopHeader</div>,
}));

vi.mock('@/components/header/CartIcon', () => ({
  default: () => <div data-testid='cart-icon'>CartIcon</div>,
}));

describe('Header', () => {
  it('should render header structure', () => {
    renderWithProviders(<Header />);

    expect(screen.getByTestId('top-header')).toBeInTheDocument();
    expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
  });
});
```

---

## Navigation Mocking

### The Reality

Due to Vitest's hoisting mechanism, navigation mocks require **~50 lines of boilerplate**. This is unavoidable and is a constraint of how Vitest executes code.

### The Solution

**Use VS Code snippet: `vitest-nav-mocks`**

Type the snippet trigger and press Tab to auto-insert the complete pattern.

### Why Inline is Required

- `vi.hoisted()` executes **BEFORE** all imports are evaluated
- Imported functions are not yet available when `vi.hoisted()` runs
- **You MUST copy the pattern inline** in each test file
- See: https://vitest.dev/api/vi.html#vi-hoisted

### Complete Pattern (Copy-Paste Ready)

```typescript
// Next.js core navigation (useSearchParams, useRouter, usePathname)
const nextNav = vi.hoisted(() => {
  const pathname = '/en/product/PROD001'; // ← Customize this
  const searchParams = new URLSearchParams();

  return {
    pathname,
    searchParams,
    router: {
      push: vi.fn(),
      replace: vi.fn(),
    },
  };
});

// Internationalized navigation (next-intl wrapper)
const i18nNav = vi.hoisted(() => {
  const pathname = '/en/product/PROD001'; // ← Customize this

  return {
    pathname,
    router: {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    },
    Link: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
      <a {...props}>{children}</a>
    ),
    redirect: vi.fn(),
    getPathname: vi.fn(() => pathname),
  };
});

// Setup mocks BEFORE other imports
vi.mock('next/navigation', () => ({
  useSearchParams: () => nextNav.searchParams,
  useRouter: () => nextNav.router,
  usePathname: () => nextNav.pathname,
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => i18nNav.router,
  usePathname: () => i18nNav.pathname,
  Link: i18nNav.Link,
  redirect: i18nNav.redirect,
  getPathname: i18nNav.getPathname,
}));
```

### Why We Can't Simplify This

We explored 6 different approaches to reduce navigation mock boilerplate:

1. ❌ Setup files - can't customize per test
2. ❌ `__mocks__` folders - still need `vi.mock()` calls
3. ❌ Single navigation library - `useSearchParams` not available in `@/i18n/navigation`
4. ❌ `vi.mock()` inside `vi.hoisted()` - not the intended pattern
5. ❌ Global state in setup files - execution order problem
6. ❌ Helper functions - can't import into `vi.hoisted()`

**Conclusion:** The inline pattern is optimal despite verbosity. See `/docs/testing/navigation-mocking-research.md` for full analysis.

---

## tRPC Data Mocking

### Correct Cache Key Structure

tRPC uses a specific nested array structure for cache keys:

```typescript
const trpcQueryKey = [
  ['routerName', 'procedureName'],
  {
    input: {
      /* params */
    },
    type: 'query',
  },
];
```

### Common Procedures

**Products:**

```typescript
// Get single product
[['products', 'getProductById'], { input: { id: 'PROD001' }, type: 'query' }][
  // Get all products
  (['products', 'getProducts'], { input: {}, type: 'query' })
][
  // Get products by category
  (['products', 'getProductsByCategory'], { input: { category: 'FOR_HER' }, type: 'query' })
];
```

**Cart:**

```typescript
[['cart', 'getCart'], { input: undefined, type: 'query' }];
```

**Orders:**

```typescript
[['order', 'getOrders'], { input: undefined, type: 'query' }];
```

### Example Usage

**Manual approach (recommended):**

```typescript
const queryClient = createTestQueryClient();
const mockProduct = createMockProduct({ custom_id: 'PROD001' });

queryClient.setQueryData(
  [['products', 'getProductById'], { input: { id: 'PROD001' }, type: 'query' }],
  { product: mockProduct }
);
```

**Alternative: Using the helper:**

```typescript
import { setTRPCQueryData } from '@/__tests__/helpers/componentTestUtils';

setTRPCQueryData(queryClient, {
  router: 'products',
  procedure: 'getProductById',
  input: { id: mockProduct.custom_id },
  data: { product: mockProduct },
});
```

**When to use the helper:**

- Multiple tRPC cache setups in a single test
- Prefer named parameters for clarity
- Building up patterns (3+ files using this)

**When to use manual approach:**

- Simple, one-off cache setups (recommended)
- Want explicit control over query key structure
- Keep tests more explicit and self-documenting

---

## Suspense Testing

### The Problem

Components using `useSuspenseQuery` require a Suspense boundary. Without proper handling, tests become cluttered with boilerplate:

```typescript
// Old approach - lots of boilerplate
renderWithProviders(
  <Suspense fallback={<div>Loading...</div>}>
    <ProductInfo id='PROD001' />
  </Suspense>,
  { queryClient }
);

await waitFor(() => {
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

// Finally test the actual component
expect(screen.getByRole('heading')).toHaveTextContent('Test Product');
```

### ⭐ The Solution: `renderSuspenseResolved()` (Default/Recommended)

**Use this by default for ~99% of your component tests.** It provides the simplest API with automatic Suspense handling.

```typescript
import { renderSuspenseResolved } from '@/__tests__/helpers/componentTestUtils';

it('should render product information', async () => {
  const queryClient = createTestQueryClient();
  queryClient.setQueryData(trpcQueryKey, { product: mockProduct });

  // Render and wait - component is ready after this line
  await renderSuspenseResolved(<ProductInfo id='PROD001' />, { queryClient });

  // Test immediately - no manual waitFor needed
  expect(screen.getByRole('heading')).toHaveTextContent('Test Product');
  expect(screen.getByAltText('logo')).toBeInTheDocument();
});
```

**Why use this approach:**

- ✅ **"Just works"** - Simplest API, least boilerplate
- ✅ Automatic waiting - no manual `waitFor` or `findBy`
- ✅ Component is ready immediately after `await`
- ✅ Covers 99% of test scenarios

**When NOT to use:**

- ❌ Need to test loading states (use Alternative 2)
- ❌ Want explicit `findBy` error messages (use Alternative 1)

---

### Alternative Approaches

Only use these if `renderSuspenseResolved()` doesn't meet your specific needs.

#### Alternative 1: `renderWithSuspense()` + `findBy` Queries

**Use when:** You want better error messages from `findBy` queries.

```typescript
renderWithSuspense(<ProductInfo id='PROD001' />, { queryClient });

// findBy provides detailed error messages on timeout
const heading = await screen.findByRole('heading', { level: 1 });
expect(heading).toHaveTextContent('Test Product');
```

**Trade-offs:**

- ✅ Better error messages than `renderSuspenseResolved()`
- ⚠️ Slightly more verbose

---

#### Alternative 2: Test Loading States

**Use when:** You need to verify loading states (rare).

```typescript
renderWithSuspense(<ProductInfo id='PROD001' />, { queryClient });

// Test loading state
expect(screen.getByText('Loading...')).toBeInTheDocument();

// Populate cache to trigger resolution
queryClient.setQueryData(trpcQueryKey, { product: mockProduct });

const heading = await screen.findByRole('heading', { level: 1 });
expect(heading).toHaveTextContent('Test Product');
```

**Trade-offs:**

- ✅ Can test loading states
- ❌ More complex setup

---

### Quick Reference

| Scenario                           | Use This                          |
| ---------------------------------- | --------------------------------- |
| **Default (99% of tests)**         | ⭐ `renderSuspenseResolved()`     |
| Need better error messages         | `renderWithSuspense()` + `findBy` |
| Need to test loading states (rare) | `renderWithSuspense()` + manual   |

---

## Multilingual Testing Patterns

### Overview

Testing multilingual components requires a careful balance between thorough coverage and meaningful assertions. This section provides patterns for testing i18n functionality without falling into the "technical debt disguised as coverage" trap.

**Core Principle:** Test what users see (translations), not routing infrastructure (URL prefixes).

---

### Pattern: Real Translation Testing

**Use case:** Testing components that display translated text in multiple locales

**Implementation:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import {
  renderWithProviders,
  createTestQueryClient,
} from '@/__tests__/helpers/componentTestUtils';

// Import actual translation files
import enMessages from '../../../messages/en.json';
import roMessages from '../../../messages/ro.json';
import ruMessages from '../../../messages/ru.json';

import MobileMenu from '@/components/header/MobileMenu';

describe('MobileMenu - Multilingual Support', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  it('should display English translations', () => {
    renderWithProviders(<MobileMenu setSidebarOpen={vi.fn()} />, {
      locale: 'en',
      queryClient,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: enMessages as any, // Type cast for complex nested structures
    });

    // Test actual English text that users will see
    expect(screen.getByText(enMessages.NavBar.home)).toBeInTheDocument(); // "Home"
    expect(screen.getByText(enMessages.NavBar.catalog)).toBeInTheDocument(); // "Catalog"
    expect(screen.getByText(enMessages.Tags.FOR_HER.title)).toBeInTheDocument(); // "For Her"
    expect(screen.getByText(enMessages.Tags.ALL_PRODUCTS.title)).toBeInTheDocument(); // "All Products"
  });

  it('should display Romanian translations', () => {
    renderWithProviders(<MobileMenu setSidebarOpen={vi.fn()} />, {
      locale: 'ro',
      queryClient,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: roMessages as any,
    });

    // Test actual Romanian text that users will see
    expect(screen.getByText(roMessages.NavBar.home)).toBeInTheDocument(); // "Acasă"
    expect(screen.getByText(roMessages.NavBar.catalog)).toBeInTheDocument(); // "Catalog"
    expect(screen.getByText(roMessages.Tags.FOR_HER.title)).toBeInTheDocument(); // "Pentru Ea"
    expect(screen.getByText(roMessages.Tags.ALL_PRODUCTS.title)).toBeInTheDocument(); // "Toate produsele"
  });

  it('should display Russian translations', () => {
    renderWithProviders(<MobileMenu setSidebarOpen={vi.fn()} />, {
      locale: 'ru',
      queryClient,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: ruMessages as any,
    });

    // Test actual Russian text that users will see
    expect(screen.getByText(ruMessages.NavBar.home)).toBeInTheDocument(); // "Главная"
    expect(screen.getByText(ruMessages.NavBar.catalog)).toBeInTheDocument(); // "Каталог"
    expect(screen.getByText(ruMessages.Tags.FOR_HER.title)).toBeInTheDocument(); // "Для неё"
    expect(screen.getByText(ruMessages.Tags.ALL_PRODUCTS.title)).toBeInTheDocument(); // "Все товары"
  });
});
```

**What this tests:**

- ✅ Component renders without errors in each locale
- ✅ Actual translated text appears correctly
- ✅ Translation keys resolve (won't crash on missing keys)
- ✅ Real user-facing behavior

**What this catches:**

- Missing translation keys
- Typos in translation key paths
- Translation file structure changes
- Component crashes with specific locales

---

### Anti-Pattern: Fake Multilingual Coverage

**The Problem:**

```typescript
// ❌ BAD - All three tests are identical and meaningless!
describe('Multilingual Support', () => {
  it('should render in English locale', () => {
    renderWithProviders(<MobileMenu setSidebarOpen={vi.fn()} />, {
      locale: 'en',
      queryClient
    });

    const logoLink = screen.getByAltText('logo').closest('a');
    expect(logoLink).toHaveAttribute('href', '/'); // Same assertion
  });

  it('should render in Romanian locale', () => {
    renderWithProviders(<MobileMenu setSidebarOpen={vi.fn()} />, {
      locale: 'ro',
      queryClient
    });

    const logoLink = screen.getByAltText('logo').closest('a');
    expect(logoLink).toHaveAttribute('href', '/'); // Identical! What's the point?
  });

  it('should render in Russian locale', () => {
    renderWithProviders(<MobileMenu setSidebarOpen={vi.fn()} />, {
      locale: 'ru',
      queryClient
    });

    const logoLink = screen.getByAltText('logo').closest('a');
    expect(logoLink).toHaveAttribute('href', '/'); // Meaningless duplication
  });
});
```

**Why this is "Technical Debt Disguised as Coverage":**

1. **Identical Assertions** - All three tests assert `href='/'` regardless of locale
2. **False Confidence** - Looks like 3 locale tests, but they're actually 1 test copy-pasted 3 times
3. **Zero Value** - Doesn't catch any real i18n bugs (missing translations, wrong locale data, etc.)
4. **Maintenance Burden** - 3x the code to maintain with 0x the benefit
5. **Misleading Metrics** - Shows high test coverage but provides no actual safety

**What should have been done instead:**

- Delete 2 of the 3 tests (they're duplicates)
- OR test actual translations like the pattern above
- OR combine into a single smoke test if only checking "doesn't crash"

---

### Testing Boundaries: Component vs E2E

Understanding what to test at each level prevents duplication and fake coverage.

#### Component-Level Testing (Vitest + RTL)

**✅ Test these concerns:**

| Concern                        | Example                                            |
| ------------------------------ | -------------------------------------------------- |
| **Translation display**        | Romanian "Acasă" appears instead of English "Home" |
| **Locale-specific formatting** | Dates: "23.01.2025" (ro) vs "1/23/2025" (en)       |
| **Component rendering**        | No crashes when switching locales                  |
| **Translation key resolution** | No "NavBar.home" literal text (missing key)        |

**Code example:**

```typescript
it('should display locale-specific date formatting', () => {
  const testDate = new Date('2025-01-23');

  // Romanian locale
  renderWithProviders(<EventCard date={testDate} />, {
    locale: 'ro',
    messages: roMessages
  });
  expect(screen.getByText('23.01.2025')).toBeInTheDocument();

  cleanup();

  // English locale
  renderWithProviders(<EventCard date={testDate} />, {
    locale: 'en',
    messages: enMessages
  });
  expect(screen.getByText('1/23/2025')).toBeInTheDocument();
});
```

#### E2E Testing (Playwright - Future)

**✅ Test these concerns:**

| Concern                        | Why E2E?                                               |
| ------------------------------ | ------------------------------------------------------ |
| **URL locale prefixes**        | `/en/catalog` vs `/ro/catalog` - requires real routing |
| **Locale switching**           | Clicking language switcher changes entire site         |
| **Locale persistence**         | Navigating pages maintains selected locale             |
| **Browser language detection** | Auto-detect user's browser language                    |
| **Full user flows**            | Register account → Browse → Checkout in Romanian       |

**These require:**

- Real Next.js routing
- Real next-intl middleware
- Full application context
- Browser environment

**Don't try to test these at component level** - you'll end up reimplementing next-intl logic in mocks, which is brittle and provides false confidence.

---

### Navigation Mock Strategy

When testing components with i18n navigation, keep mocks simple.

**✅ GOOD - Simple Mock:**

```typescript
const i18nNav = vi.hoisted(() => ({
  pathname: '/en',
  router: { push: vi.fn(), replace: vi.fn() },
  Link: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => i18nNav.pathname,
  useRouter: () => i18nNav.router,
  Link: i18nNav.Link,
}));
```

**Why this works:**

- Provides navigation functionality for components
- Doesn't try to replicate next-intl's locale logic
- Simple to understand and maintain
- Lets you focus on testing translations, not routing

**❌ BAD - Reimplementing next-intl:**

```typescript
// Don't do this!
const Link = ({ href, locale, ...props }) => {
  // Trying to replicate next-intl's complex logic
  const processedHref = typeof href === 'string'
    ? `/${locale}${href}`
    : `/${locale}${href.pathname}${href.query ? '?' + new URLSearchParams(href.query) : ''}`;

  return <a href={processedHref} {...props}>{children}</a>;
};
```

**Why this is bad:**

- You're testing your mock implementation, not real behavior
- next-intl's actual logic is more complex (domain prefixes, middleware, etc.)
- Brittle - breaks when next-intl updates
- False confidence - tests pass but real app might be broken

**Trust the library:** next-intl is already tested. We test **our** translations appear correctly with **their** routing.

---

### Quick Reference

**DO at component level:**

- ✅ Import real translation JSON files
- ✅ Test actual translated text appears
- ✅ Verify no crashes with different locales
- ✅ Test locale-specific formatting if applicable

**DON'T at component level:**

- ❌ Test URL locale prefixes (`/en/`, `/ro/`)
- ❌ Test locale switching flows (belongs in E2E)
- ❌ Reimplement next-intl logic in mocks
- ❌ Write identical tests for each locale (fake coverage)

**Files demonstrating this pattern:**

- `src/__tests__/components/navigation/MobileMenu.test.tsx` - Real translation testing
- Before refactor: Had 4 meaningless tests
- After refactor: 3 meaningful tests checking actual Romanian/Russian/English text

---

## Debugging Techniques

### See Rendered Output

```typescript
// Print the entire DOM
console.log(screen.debug());

// Print specific element
console.log(screen.debug(screen.getByRole('heading')));
```

### Get Query Suggestions

```typescript
// Opens Testing Playground with your rendered component
screen.logTestingPlaygroundURL();
```

### Check Text Not in Accessibility Tree

Some text may not be accessible via `screen.getByText()`:

```typescript
// Check document content directly
expect(document.body.textContent).toContain('Expected text');
expect(document.body.textContent).toMatch(/100 MDL/);
```

### Verify Suspense Resolved

**Option 1: Use helper (recommended)**

```typescript
// Automatically waits for Suspense to resolve
await renderSuspenseResolved(<ProductInfo id='PROD001' />, { queryClient });

// Component is ready - test immediately
expect(screen.getByRole('heading')).toHaveTextContent('Test Product');
```

**Option 2: Manual waiting**

```typescript
await waitFor(() => {
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

// Now safe to test the actual content
expect(screen.getByRole('heading')).toHaveTextContent('Test Product');
```

### Check What Mocks Were Called

```typescript
expect(nextNav.router.push).toHaveBeenCalledWith('/cart');
expect(nextNav.router.push).toHaveBeenCalledTimes(1);
expect(nextNav.searchParams.get('category')).toBe('FOR_HER');
```

---

## Anti-Patterns We Discovered

### The Journey (What We Learned)

**Before (develop branch):** 147 lines of over-mocking

- Mocked Header, ProductImages, ProductContent, SimilarProducts, Skeleton
- Mocked `useSuspenseQuery` directly
- Manually mocked QueryClient
- Created multiple test suites with isolated test data
- Tested tRPC call parameters and implementation details
- **Result:** Brittle, low-value tests that broke on refactoring

**After (current branch):** 88 lines of integration testing

- Real child components render
- Pre-populated QueryClient cache with proper tRPC structure
- Suspense boundaries for async rendering
- Single integration test verifying user-visible behavior
- **Result:** Valuable, maintainable tests that catch real bugs

**Lesson:** More mocks ≠ better tests. Integration > Isolation.

---

### The 50-Line Navigation Reality

We explored 6 different approaches to reduce navigation mock boilerplate:

1. ❌ Setup files - can't customize per test
2. ❌ `__mocks__` folders - still need `vi.mock()` calls
3. ❌ Single navigation library - `useSearchParams` not available in `@/i18n/navigation`
4. ❌ `vi.mock()` inside `vi.hoisted()` - not the intended pattern
5. ❌ Global state in setup files - execution order problem
6. ❌ Helper functions - can't import into `vi.hoisted()`

**Conclusion:** The inline pattern is optimal despite verbosity. See `/docs/testing/navigation-mocking-research.md` for full analysis.

---

### Hardcoded Mock Value Duplicates

**Problem:** Tests duplicated mock values in assertions using hardcoded strings, creating brittle tests that failed when mock data changed.

**Example from ProductInfo.test.tsx:**

```typescript
// Mock defines values
const mockProduct = createMockProduct({
  custom_id: 'PROD001',
  title: { ro: 'Produs', ru: 'Продукт', en: 'Test Product' },
  price: 100,
});

// ❌ Before: Assertions duplicated these values
expect(heading).toHaveTextContent('Test Product'); // Brittle!
expect(screen.getByText('100 MDL')).toBeInTheDocument(); // Brittle!
renderSuspenseResolved(<ProductInfo id='PROD001' />, { queryClient }); // Brittle!

// ✅ After: Assertions reference mock properties
expect(heading).toHaveTextContent(mockProduct.title.en);
expect(screen.getByText(`${mockProduct.price} MDL`)).toBeInTheDocument();
renderSuspenseResolved(<ProductInfo id={mockProduct.custom_id} />, { queryClient });
```

**Why this was a problem:**

- 📛 **Single source of truth violation** - Same data existed in two places (mock + assertion)
- 📛 **False failures** - Tests failed when mock changed, even though component worked correctly
- 📛 **Maintenance burden** - Had to update multiple locations when changing test data
- 📛 **Cognitive load** - Developers had to remember to sync hardcoded values with mocks

**The fix:**

- Always reference mock object properties: `mockProduct.title.en` not `'Test Product'`
- Use template literals for dynamic values: `` `${mockProduct.price} MDL` ``
- Pass mock properties to components: `id={mockProduct.custom_id}` not `id='PROD001'`

**Impact:**

- ✅ Tests now adapt automatically when mock data changes
- ✅ Clear relationship between test data and assertions
- ✅ Fewer false failures
- ✅ Better test maintainability

**Files fixed:**

- `src/__tests__/components/product/ProductInfo.test.tsx`
- `src/__tests__/components/product/ProductContent.test.tsx`
- `src/__tests__/components/product/ProductCard.test.tsx`
- `src/__tests__/components/navigation/Header.test.tsx`

**Lesson:** Mock data should be the **single source of truth**. Never duplicate values in assertions.

---

## Additional Resources

### Documentation

- **Navigation mocking research:** `/docs/testing/navigation-mocking-research.md` - Complete analysis of 6 approaches and why inline pattern is optimal
- **Testing strategy proposal:** GitHub Issue #103 - Recommendation to shift from unit tests to E2E tests

### Code Resources

- **VS Code snippets:** `.vscode/vitest-navigation-mocks.code-snippets` - Auto-insert patterns
- **Test utilities:** `src/__tests__/helpers/componentTestUtils.tsx` - All available helpers
- **Template:** `.claude/templates/component.test.tsx` - Copy-paste starting point

### Live Examples

- **Integration test:** `src/__tests__/components/product/ProductInfo.test.tsx` - Navigation mocking + tRPC + Suspense
- **UI component test:** `src/__tests__/components/ui/form/switch.test.tsx` - Minimal mocking
- **Form test:** `src/__tests__/components/checkout/CheckoutForm.test.tsx` - Complex form testing

---

**Remember:** These patterns are not dogma. When you discover a better approach, update this document!
