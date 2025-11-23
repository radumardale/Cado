import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { type ReactNode } from 'react';

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
import { screen, cleanup } from '@testing-library/react';
import {
  createMockProduct,
  createTestQueryClient,
  renderSuspenseResolved,
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
    // Create query client and populate cache
    const queryClient = createTestQueryClient();

    const trpcQueryKey = [
      ['products', 'getProductById'],
      { input: { id: 'PROD001' }, type: 'query' },
    ];

    queryClient.setQueryData(trpcQueryKey, {
      product: mockProduct,
    });

    // Render and wait for Suspense to resolve
    await renderSuspenseResolved(<ProductInfo id='PROD001' />, {
      queryClient,
    });

    // Component is ready - test immediately
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Test Product');

    // Verify other content
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/100/);
    expect(document.querySelector('.skeleton')).not.toBeInTheDocument();

    // DON'T DELETE: Debug output to verify rendered DOM!! I want to see it!
    console.log(screen.debug());
  });
});
