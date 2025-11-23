# Component Testing Guidelines

> 📝 **Living Document**
> These guidelines evolve as we discover better patterns and practices.
>
> **Claude's Role:**
> - ⚠️ Alert when patterns in this document are outdated or incorrect
> - 💡 Suggest updates when we discover new approaches during development
> - 🔄 Help keep these guidelines aligned with actual working code
>
> **Last Updated:** 2025-01-23

## Quick Start

1. **Use VS Code snippets:**
   - `vitest-imports` → Import statements
   - `vitest-nav-mocks` → Navigation mocking setup

2. **Essential patterns:**
   - Use `renderWithProviders()` for rendering components
   - Use `createMockProduct()` and other factories for test data
   - Pre-populate cache with `queryClient.setQueryData()` for tRPC data
   - Wrap components using `useSuspenseQuery` in `<Suspense>` boundaries

3. **Start from template:**
   - Use `.claude/templates/component.test.tsx` as your starting point

## Testing Philosophy

### The Golden Rules

- ✅ **Integration over Isolation** - Test components with their real dependencies
- ✅ **Mock at the Boundary** - Only mock external APIs, navigation, and external libraries
- ✅ **User Behavior over Implementation** - Test what users see, not how code works internally
- ✅ **Real Providers Always** - Use actual tRPC, QueryClient, NextIntl providers in tests

### What We Learned (The Hard Way)

- **50 lines of navigation mocks is unavoidable** - This is a Vitest architectural constraint
- **Can't import helpers into `vi.hoisted()`** - Navigation mocks must be inline
- **Over-mocking child components = brittle tests** - Mock only what you must
- **Testing tRPC call parameters = testing implementation** - Test user-visible behavior instead

## Available Utilities

### From `@/__tests__/helpers/componentTestUtils`

**Factory Functions:**
- `createMockProduct(overrides)` - Product with sensible defaults
- `createMockProductOnSale(salePrice)` - Product with active sale
- `createMockProductOutOfStock()` - Out of stock product
- `createMockProducts(count)` - Array of products
- `createMockCartItem(productId, quantity)` - Cart item
- `createTestMessages(locale)` - i18n messages for all locales
- `createTestQueryClient()` - Fresh QueryClient for each test
- `createTestTRPCClient()` - tRPC client (for advanced cases)

**Rendering Functions:**
- `renderWithProviders(ui, options)` - Main render function with all providers (QueryClient, TRPCProvider, NextIntlClientProvider)
- `renderFormField(ui, options)` - For testing form inputs with React Hook Form

**Setup Functions:**
- `setupPortalContainer()` - For Radix UI portals (Select, Calendar, Popover) - call in `beforeEach`
- `mockIntersectionObserver()` - For lazy loading tests
- `mockMatchMedia(matches)` - For responsive component tests
- `mockNextImage()` - Mock Next.js Image to avoid layout warnings
- `mockUseTranslations()` - Basic next-intl mock (returns full key path)

**Form Testing:**
- `pressKey(element, key, options)` - Simulate keyboard navigation
- `expectAccessibleInput(element)` - Check ARIA attributes

**Utilities:**
- `waitForAsync(ms)` - Wait for async operations

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
import { screen, cleanup, waitFor } from '@testing-library/react';
import {
  createMockProduct,
  createTestQueryClient,
  renderWithProviders,
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

    renderWithProviders(
      <Suspense fallback={<div>Loading...</div>}>
        <ProductInfo id='PROD001' />
      </Suspense>,
      { queryClient }
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Product');
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });
});
```

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

## Critical Rules

### ❌ NEVER Do These

1. **Don't mock child components you're testing**
   ```typescript
   // ❌ BAD - You just broke what you're testing!
   vi.mock('@/components/product/ProductContent');
   vi.mock('@/components/product/ProductImages');
   render(<ProductInfo />); // Testing nothing real now

   // ✅ GOOD - Test with real child components
   renderWithProviders(<ProductInfo id='PROD001' />, { queryClient });
   expect(screen.getByRole('heading')).toHaveTextContent('Test Product');
   ```

2. **Don't mock tRPC or React Query hooks directly**
   ```typescript
   // ❌ BAD - Breaks the entire testing model
   vi.mock('@tanstack/react-query', () => ({
     useSuspenseQuery: vi.fn().mockReturnValue({ data: mockData })
   }));

   // ✅ GOOD - Pre-populate the cache
   const queryClient = createTestQueryClient();
   queryClient.setQueryData(trpcQueryKey, { product: mockProduct });
   renderWithProviders(<ProductInfo />, { queryClient });
   ```

3. **Don't test implementation details**
   ```typescript
   // ❌ BAD - Testing how it works, not what it does
   expect(mockTRPC.getProductById).toHaveBeenCalledWith(
     { id: 'PROD001' },
     { staleTime: 10000 }
   );

   // ✅ GOOD - Test user-visible behavior
   expect(screen.getByRole('heading')).toHaveTextContent('Test Product');
   expect(document.body.textContent).toContain('100 MDL');
   ```

4. **Don't import helpers into `vi.hoisted()` blocks**
   ```typescript
   // ❌ BAD - WILL FAIL with "Cannot access before initialization"
   import { createMockRouter } from '@/__tests__/helpers/componentTestUtils';
   const mocks = vi.hoisted(() => createMockRouter('/en'));

   // ✅ GOOD - Use VS Code snippet or copy pattern inline
   const mocks = vi.hoisted(() => ({
     pathname: '/en',
     router: { push: vi.fn(), replace: vi.fn() },
   }));
   ```

5. **Don't forget Suspense boundaries for `useSuspenseQuery` components**
   ```typescript
   // ❌ BAD - Will throw error!
   renderWithProviders(<ProductInfo id='PROD001' />, { queryClient });

   // ✅ GOOD - Wrap in Suspense
   renderWithProviders(
     <Suspense fallback={<div>Loading...</div>}>
       <ProductInfo id='PROD001' />
     </Suspense>,
     { queryClient }
   );
   ```

### ✅ ALWAYS Do These

1. **Use VS Code snippets** - Type `vitest-nav-mocks` + Tab for navigation mocks
2. **Pre-populate cache** - Use `queryClient.setQueryData()`, don't mock queries
3. **Use factories** - `createMockProduct()` not inline objects with 30+ fields
4. **Test user behavior** - What users see and interact with, not implementation
5. **Clean up properly** - Always `afterEach(cleanup)` to prevent test pollution

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

### Complete Pattern Available In

- **VS Code snippet** (fastest): `.vscode/vitest-navigation-mocks.code-snippets`
- **Template documentation**: `componentTestUtils.tsx` lines 35-131
- **Live example**: `ProductInfo.test.tsx`
- **Research doc**: `/docs/testing/navigation-mocking-research.md`

## tRPC Data Mocking

### Correct Cache Key Structure

tRPC uses a specific nested array structure for cache keys:

```typescript
const trpcQueryKey = [
  ['routerName', 'procedureName'],
  { input: { /* params */ }, type: 'query' }
];
```

**Example:**

```typescript
const trpcQueryKey = [
  ['products', 'getProductById'],
  { input: { id: 'PROD001' }, type: 'query' }
];

queryClient.setQueryData(trpcQueryKey, { product: mockProduct });
```

### Common Procedures

**Products:**
```typescript
[['products', 'getProductById'], { input: { id: 'PROD001' }, type: 'query' }]
[['products', 'getProducts'], { input: {}, type: 'query' }]
[['products', 'getProductsByCategory'], { input: { category: 'FOR_HER' }, type: 'query' }]
```

**Cart:**
```typescript
[['cart', 'getCart'], { input: undefined, type: 'query' }]
```

**Orders:**
```typescript
[['order', 'getOrders'], { input: undefined, type: 'query' }]
```

## Debugging Tips

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

### The 50-Line Navigation Reality

We explored 6 different approaches to reduce navigation mock boilerplate:
1. ❌ Setup files - can't customize per test
2. ❌ `__mocks__` folders - still need `vi.mock()` calls
3. ❌ Single navigation library - `useSearchParams` not available in `@/i18n/navigation`
4. ❌ `vi.mock()` inside `vi.hoisted()` - not the intended pattern
5. ❌ Global state in setup files - execution order problem
6. ❌ Helper functions - can't import into `vi.hoisted()`

**Conclusion:** The inline pattern is optimal despite verbosity. See `/docs/testing/navigation-mocking-research.md` for full analysis.

## When to Write Different Test Types

### Component Tests (Current Focus)

**When:** Testing React components in isolation or with real dependencies
**What:** User interactions, rendering, state changes, integration with providers
**Tools:** Vitest + React Testing Library + `renderWithProviders()`
**Example:** Testing that ProductInfo displays product data correctly

### E2E Tests (Recommended - See Issue #103)

**When:** Testing complete user flows through the application
**What:** Full application behavior, navigation, data persistence
**Tools:** Playwright (proposed)
**Why:** Less mocking, more confidence, catches integration bugs
**Example:** User adds product to cart, proceeds to checkout, completes purchase

### Unit Tests

**When:** Testing pure functions, utilities, helpers
**What:** Calculations, transformations, business logic
**Tools:** Vitest only (no React, no providers)
**Example:** Testing a price calculation function

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

**Remember:** These guidelines are not dogma. When you discover a better approach, update this document!
