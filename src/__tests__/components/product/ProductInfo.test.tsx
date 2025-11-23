import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// ALL MOCKS MUST COME BEFORE ANY OTHER IMPORTS

// // Mock tRPC client
// const mockQueryOptions = vi.fn();
// vi.mock('@/app/_trpc/client', () => ({
//   useTRPC: () => ({
//     products: {
//       getProductById: {
//         queryOptions: mockQueryOptions,
//       },
//     },
//   }),
// }));

// // Mock tanstack query
// vi.mock('@tanstack/react-query', () => ({
//   useSuspenseQuery: vi.fn(),
//   QueryClient: vi.fn(() => ({
//     defaultOptions: {},
//     setDefaultOptions: vi.fn(),
//     mount: vi.fn(),
//     unmount: vi.fn(),
//     isFetching: vi.fn(() => 0),
//     isMutating: vi.fn(() => 0),
//     clear: vi.fn(),
//     getQueryCache: vi.fn(),
//     getMutationCache: vi.fn(),
//     getDefaultOptions: vi.fn(() => ({})),
//     setQueryDefaults: vi.fn(),
//     getQueryDefaults: vi.fn(),
//     setMutationDefaults: vi.fn(),
//     getMutationDefaults: vi.fn(),
//   })),
//   QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
// }));

// Mock next/navigation
const mockSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/en/product/PROD001',
}));

// NOW import everything else
import { screen, cleanup } from '@testing-library/react';
import {
  createMockProduct,
  createTestQueryClient,
  renderWithProviders,
} from '@/__tests__/helpers/componentTestUtils';
import ProductInfo from '@/components/product/ProductInfo';
import { Categories } from '@/lib/enums/Categories';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

function mockRouter(overrides = {}) {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    ...overrides,
  };
}

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

  it('should render without crashing', () => {
    const queryClient = createTestQueryClient();
    // mockQueryOptions.mockReturnValue({});
    // vi.mocked(useSuspenseQuery).mockReturnValue({
    //   data: { product: mockProduct },
    // } as never);

    const all = renderWithProviders(
      <AppRouterContext.Provider value={mockRouter({})}>
        <ProductInfo id='PROD001' />
      </AppRouterContext.Provider>,
      {
        queryClient,
      }
    );

    console.log(all.debug());

    // expect(screen.getByTestId('header')).toBeInTheDocument();
    // expect(screen.getByTestId('product-images')).toBeInTheDocument();
    // expect(screen.getByTestId('product-content')).toBeInTheDocument();
  });
});
