import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

/**
 * Mock dependencies - MUST be before imports
 */

// Mock Swiper CSS
vi.mock('swiper/css', () => ({}));

// Mock tRPC client
const mockQueryOptions = vi.fn();
vi.mock('@/app/_trpc/client', () => ({
  useTRPC: () => ({
    products: {
      getProductById: {
        queryOptions: mockQueryOptions,
      },
    },
  }),
}));

// Mock tanstack query - use factory function to avoid hoisting issues
vi.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: vi.fn(),
  QueryClient: vi.fn(() => ({
    defaultOptions: {},
    setDefaultOptions: vi.fn(),
    mount: vi.fn(),
    unmount: vi.fn(),
    isFetching: vi.fn(() => 0),
    isMutating: vi.fn(() => 0),
    clear: vi.fn(),
    getQueryCache: vi.fn(),
    getMutationCache: vi.fn(),
    getDefaultOptions: vi.fn(() => ({})),
    setQueryDefaults: vi.fn(),
    getQueryDefaults: vi.fn(),
    setMutationDefaults: vi.fn(),
    getMutationDefaults: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
}));

// Mock next/navigation
const mockSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/en/product/PROD001',
}));

// Mock child components
vi.mock('@/components/header/Header', () => ({
  default: ({
    category,
    breadcrumbs,
    productInfo,
  }: {
    category?: string;
    breadcrumbs?: boolean;
    productInfo?: { id: string; title: string };
  }) => (
    <div data-testid='header'>
      <div data-testid='header-category'>{String(category)}</div>
      <div data-testid='header-breadcrumbs'>{breadcrumbs ? 'true' : 'false'}</div>
      <div data-testid='header-product-id'>{String(productInfo?.id || '')}</div>
      <div data-testid='header-product-title'>{String(productInfo?.title || '')}</div>
    </div>
  ),
}));

vi.mock('@/components/product/ProductImages', () => ({
  default: ({ product }: { product: { custom_id: string } }) => (
    <div data-testid='product-images'>Images for {product.custom_id}</div>
  ),
}));

vi.mock('@/components/product/ProductContent', () => ({
  default: ({ product }: { product: { custom_id: string } }) => (
    <div data-testid='product-content'>Content for {product.custom_id}</div>
  ),
}));

vi.mock('@/components/product/SimilarProducts', () => ({
  default: ({ category, productId }: { category: string; productId: string }) => (
    <div data-testid='similar-products'>
      Similar to {productId} in {category}
    </div>
  ),
}));

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid='skeleton' className={className}>
      Loading...
    </div>
  ),
}));

import { render, screen, cleanup } from '@testing-library/react';
import { createMockProduct } from '@/__tests__/helpers/componentTestUtils';
import ProductInfo from '@/components/product/ProductInfo';
import { Categories } from '@/lib/enums/Categories';
import { useSuspenseQuery } from '@tanstack/react-query';

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
    mockSearchParams.delete('category');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Loading State', () => {
    it('should render skeleton when product data is null', () => {
      mockQueryOptions.mockReturnValue({});
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: { product: null },
      } as never);

      render(<ProductInfo id='PROD001' />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render skeleton when product data is undefined', () => {
      mockQueryOptions.mockReturnValue({});
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: { product: undefined },
      } as never);

      render(<ProductInfo id='PROD001' />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Product Display', () => {
    beforeEach(() => {
      mockQueryOptions.mockReturnValue({});
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: { product: mockProduct },
      } as never);
    });

    it('should render Header with product information', () => {
      render(<ProductInfo id='PROD001' />);

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('header-breadcrumbs')).toHaveTextContent('true');
      expect(screen.getByTestId('header-product-id')).toHaveTextContent('PROD001');
      expect(screen.getByTestId('header-product-title')).toHaveTextContent('Test Product');
    });

    it('should pass category from product categories to Header when no category param', () => {
      render(<ProductInfo id='PROD001' />);

      expect(screen.getByTestId('header-category')).toHaveTextContent(Categories.FOR_HER);
    });

    it('should pass category param to Header when available', () => {
      mockSearchParams.set('category', Categories.FOR_HIM);

      render(<ProductInfo id='PROD001' />);

      expect(screen.getByTestId('header-category')).toHaveTextContent(Categories.FOR_HIM);
    });

    it('should render ProductImages component with product data', () => {
      render(<ProductInfo id='PROD001' />);

      expect(screen.getByTestId('product-images')).toBeInTheDocument();
      expect(screen.getByTestId('product-images')).toHaveTextContent('Images for PROD001');
    });

    it('should render ProductContent component with product data', () => {
      render(<ProductInfo id='PROD001' />);

      expect(screen.getByTestId('product-content')).toBeInTheDocument();
      expect(screen.getByTestId('product-content')).toHaveTextContent('Content for PROD001');
    });

    it('should not render SimilarProducts when product has no categories', () => {
      const productWithoutCategories = createMockProduct({
        custom_id: 'PROD002',
        categories: [],
      });

      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: { product: productWithoutCategories },
      } as never);

      render(<ProductInfo id='PROD002' />);

      expect(screen.queryByTestId('similar-products')).not.toBeInTheDocument();
    });
  });

  describe('tRPC Integration', () => {
    it('should call tRPC getProductById with correct ID', () => {
      mockQueryOptions.mockReturnValue({});
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: { product: mockProduct },
      } as never);

      render(<ProductInfo id='PROD001' />);

      expect(mockQueryOptions).toHaveBeenCalledWith(
        { id: 'PROD001' },
        { staleTime: 10000, refetchOnMount: false, refetchOnWindowFocus: false }
      );
    });

    it('should use useSuspenseQuery with query options', () => {
      const mockOptions = { queryKey: ['product', 'PROD001'], queryFn: vi.fn() };
      mockQueryOptions.mockReturnValue(mockOptions);
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: { product: mockProduct },
      } as never);

      render(<ProductInfo id='PROD001' />);

      expect(useSuspenseQuery).toHaveBeenCalledWith(mockOptions);
    });
  });

  describe('Locale Support', () => {
    it('should display product title in current locale (en)', () => {
      mockQueryOptions.mockReturnValue({});
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: { product: mockProduct },
      } as never);

      render(<ProductInfo id='PROD001' />);

      expect(screen.getByTestId('header-product-title')).toHaveTextContent('Test Product');
    });
  });
});
