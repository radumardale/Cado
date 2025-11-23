import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { type ReactNode } from 'react';

// ============================================================================
// NAVIGATION MOCKS - Must be defined BEFORE imports due to vi.hoisted()
// ============================================================================
// ⚠️ CRITICAL: These MUST be inline - cannot import from helpers
// See: https://vitest.dev/api/vi.html#vi-hoisted
// 💡 Use VS Code snippet: Type 'vitest-nav-mocks' and press Tab

// Next.js core navigation (useSearchParams, useRouter, usePathname)
const nextNav = vi.hoisted(() => {
  const pathname = '/en'; // TODO: Change to match your component's route
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
  const pathname = '/en'; // TODO: Change to match your component's route

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
// TEST UTILITIES AND COMPONENT IMPORTS
// ============================================================================
import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createMockProduct,
  createTestQueryClient,
  renderSuspenseResolved,
} from '@/__tests__/helpers/componentTestUtils';

// TODO: Import your component here
// import YourComponent from '@/components/path/to/YourComponent';

// TODO: Import any enums or types needed
// import { Categories } from '@/lib/enums/Categories';

// ============================================================================
// TEST SUITE
// ============================================================================
describe('YourComponent', () => {
  // ============================================================================
  // MOCK DATA SETUP
  // ============================================================================
  // TODO: Create mock data using factory functions
  // Example with product data:
  const mockProduct = createMockProduct({
    custom_id: 'PROD001',
    title: {
      ro: 'Produs Test',
      ru: 'Тестовый продукт',
      en: 'Test Product',
    },
    // Add other overrides as needed
  });

  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Reset URL search params if your tests modify them
    nextNav.searchParams.delete('category');
    // nextNav.searchParams.delete('other-param');
  });

  afterEach(() => {
    // Clean up DOM after each test
    cleanup();
  });

  // ============================================================================
  // TESTS
  // ============================================================================

  // --------------------------------------------------------------------------
  // Basic Rendering Test
  // --------------------------------------------------------------------------
  it('should render without crashing', async () => {
    // Create query client and populate cache
    const queryClient = createTestQueryClient();

    // TODO: Replace with your actual tRPC procedure
    // Format: [['routerName', 'procedureName'], { input: { params }, type: 'query' }]
    const trpcQueryKey = [
      ['products', 'getProductById'],
      { input: { id: 'PROD001' }, type: 'query' },
    ];

    queryClient.setQueryData(trpcQueryKey, {
      product: mockProduct,
    });

    // Render and wait for Suspense to resolve
    await renderSuspenseResolved(
      /* TODO: Replace with your component */
      /* <YourComponent id="PROD001" /> */
      <div>Your Component Here</div>,
      {
        queryClient,
      }
    );

    // Component is ready - test immediately
    // TODO: Replace with your component's actual content
    // const heading = screen.getByRole('heading', { level: 1 });
    // expect(heading).toHaveTextContent('Test Product');

    // Debug output (remove after test works)
    // console.log(screen.debug());

    // Example assertions:
    // expect(screen.getByText('Test Product')).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // User Interaction Test
  // --------------------------------------------------------------------------
  it('should handle user interaction', async () => {
    // Setup user event
    const user = userEvent.setup();

    // Create query client and set up cache
    const queryClient = createTestQueryClient();
    // TODO: Set up cache as needed

    // Render and wait for component to be ready
    await renderSuspenseResolved(
      /* TODO: Replace with your component */
      <div>Your Component Here</div>,
      {
        queryClient,
      }
    );

    // TODO: Interact with the component
    // Example: Click a button
    // const button = screen.getByRole('button', { name: /add to cart/i });
    // await user.click(button);

    // TODO: Assert the result
    // Example: Check navigation was called
    // expect(i18nNav.router.push).toHaveBeenCalledWith('/cart');

    // Example: Check UI updated
    // expect(screen.getByText('Added to cart!')).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // Navigation Test
  // --------------------------------------------------------------------------
  it('should navigate when link is clicked', async () => {
    const user = userEvent.setup();

    // Create query client and set up cache
    const queryClient = createTestQueryClient();
    // TODO: Set up cache as needed

    // Render and wait for component to be ready
    await renderSuspenseResolved(
      /* TODO: Replace with your component */
      <div>Your Component Here</div>,
      {
        queryClient,
      }
    );

    // TODO: Click a link
    // const link = screen.getByRole('link', { name: /view details/i });
    // await user.click(link);

    // TODO: Verify navigation mock was called
    // expect(i18nNav.router.push).toHaveBeenCalledWith('/products/PROD001');
  });

  // --------------------------------------------------------------------------
  // Form Interaction Test (if component has forms)
  // --------------------------------------------------------------------------
  it('should handle form submission', async () => {
    const user = userEvent.setup();

    // Create query client
    const queryClient = createTestQueryClient();
    // TODO: Set up cache as needed

    // Render and wait for component to be ready
    await renderSuspenseResolved(
      /* TODO: Replace with your component */
      <div>Your Component Here</div>,
      {
        queryClient,
      }
    );

    // TODO: Fill out form
    // const input = screen.getByRole('textbox', { name: /quantity/i });
    // await user.clear(input);
    // await user.type(input, '5');

    // TODO: Submit form
    // const submitButton = screen.getByRole('button', { name: /submit/i });
    // await user.click(submitButton);

    // TODO: Assert result (use findBy for async updates)
    // const successMessage = await screen.findByText('Success!');
    // expect(successMessage).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // Conditional Rendering Test
  // --------------------------------------------------------------------------
  it('should render conditionally based on props/state', async () => {
    // Create query client
    const queryClient = createTestQueryClient();

    // TODO: Set up cache with specific data to trigger condition
    // const trpcQueryKey = [
    //   ['products', 'getProductById'],
    //   { input: { id: 'PROD001' }, type: 'query' },
    // ];
    // queryClient.setQueryData(trpcQueryKey, {
    //   product: { ...mockProduct, inStock: false },
    // });

    // Render and wait for component to be ready
    await renderSuspenseResolved(
      /* TODO: Replace with your component */
      <div>Your Component Here</div>,
      {
        queryClient,
      }
    );

    // TODO: Assert conditional content
    // expect(screen.getByText('Out of stock')).toBeInTheDocument();
    // expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
  });
});

// ============================================================================
// TEMPLATE USAGE GUIDE
// ============================================================================
/*
📝 Quick Start:
1. Replace 'YourComponent' with your actual component name
2. Update navigation mock pathnames to match your route
3. Import your component and any needed types/enums
4. Create appropriate mock data using factory functions
5. Set up tRPC cache keys to match your procedures
6. Write assertions that test user-visible behavior

🔑 Key Points:
- Navigation mocks MUST be inline (before imports) - use vi.hoisted()
- ⭐ Use renderSuspenseResolved() by default (simplest, works for 95% of tests)
- Pre-populate cache with queryClient.setQueryData()
- Test behavior, not implementation details
- Use factory functions for mock data

⚡ Default Testing Pattern:

await renderSuspenseResolved(<Component />, { queryClient });
// Component is ready - test immediately
expect(screen.getByRole('heading')).toHaveTextContent('Expected');

🔧 Alternative Approaches (if needed):

See .claude/testing.guidelines.md "Suspense Testing" section for:
- renderWithSuspense() + findBy (better error messages)
- Testing loading states (rarely needed)

See ProductInfo.test.tsx for commented examples of alternatives.

💡 VS Code Snippets:
- vitest-imports - Common test imports
- vitest-nav-mocks - Full navigation pattern
- vitest-nav-mocks-next - Next.js navigation only
- vitest-nav-mocks-i18n - i18n navigation only

📚 Resources:
- Testing guidelines: .claude/testing.guidelines.md
- Test utilities: src/__tests__/helpers/componentTestUtils.tsx
- Working example: src/__tests__/components/product/ProductInfo.test.tsx
*/
