import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Suspense, type ReactNode } from 'react';

// Navigation mocks organized by concern - must be defined inline due to hoisting constraints
// For the reasoning, see: https://vitest.dev/api/vi.html#vi-hoisted

// Next.js core navigation (useSearchParams, useRouter, usePathname)
const nextNav = vi.hoisted(() => {
  const pathname = '/en/product/PROD001';
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
  const pathname = '/en/product/PROD001';

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

// Import test utilities and component
import { screen, cleanup, waitFor } from '@testing-library/react';
import {
  createMockProduct,
  createTestQueryClient,
  renderWithProviders,
} from '@/__tests__/helpers/componentTestUtils';
import ProductInfo from '@/components/product/ProductInfo';
import { Categories } from '@/lib/enums/Categories';

describe('ProductInfo', () => {
  const mockProduct = createMockProduct({
    custom_id: 'PROD001',
    title: {
      ro: 'Produs Test',
      ru: 'Тестовый продукт',
      en: 'Test Product',
    },
    categories: [Categories.FOR_HER],
  });

  beforeEach(() => {
    vi.clearAllMocks();
    nextNav.searchParams.delete('category');
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without crashing', async () => {
    // Create a fresh query client for this test
    const queryClient = createTestQueryClient();

    // Use the correct tRPC cache key structure: [['products', 'getProductById'], { input: { id }, type: 'query' }]
    const trpcQueryKey = [
      ['products', 'getProductById'],
      { input: { id: 'PROD001' }, type: 'query' },
    ];

    // Pre-populate the cache with the product data
    queryClient.setQueryData(trpcQueryKey, {
      product: mockProduct,
    });

    // Render the component with Suspense boundary to handle useSuspenseQuery
    renderWithProviders(
      <Suspense fallback={<div>Loading product...</div>}>
        <ProductInfo id='PROD001' />
      </Suspense>,
      {
        queryClient,
      }
    );

    // Wait for the component to finish rendering
    await waitFor(() => {
      // Verify the loading fallback is not shown
      expect(screen.queryByText('Loading product...')).not.toBeInTheDocument();
    });

    // DON'T DELETE: Debug output to verify rendered DOM!! I want to see it!
    console.log(screen.debug());

    // Verify the component renders with product data
    // Check for the product title (appears in multiple places - breadcrumb and h1)
    const productTitles = screen.getAllByText('Test Product');
    expect(productTitles.length).toBeGreaterThan(0);

    // Specifically check for the h1 element with the product title
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Test Product');

    // Check for the logo in the header
    expect(screen.getByAltText('logo')).toBeInTheDocument();

    // Verify the price is shown somewhere on the page (might be formatted as "100 MDL")
    expect(document.body.textContent).toMatch(/100/);

    // Verify that no loading skeleton is shown
    expect(document.querySelector('.skeleton')).not.toBeInTheDocument();

    // Verify key content exists
    expect(document.body.textContent).toContain('Test Product');
    expect(document.body.textContent).toContain('Product description'); // From mockProduct
  });
});
