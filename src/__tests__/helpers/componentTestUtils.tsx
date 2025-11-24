import { render, RenderOptions, waitForElementToBeRemoved, screen } from '@testing-library/react';
import { ReactElement, ReactNode, Suspense } from 'react';
import { vi, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { CartInterface } from '@/lib/types/CartInterface';
import { ProductInterface } from '@/models/product/types/productInterface';
import { StockState } from '@/lib/enums/StockState';
import { TRPCProvider } from '@/app/_trpc/client';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/server';

/**
 * Component testing utilities for React components
 * Provides wrappers with all necessary providers (tRPC, next-intl, router, etc.)
 */

/**
 * Mock Next.js navigation hooks
 * Note: Due to Vitest hoisting, this should be called manually in test files
 * before importing components, not used as a utility function.
 */
export function createMockRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  };
}

/**
 * Navigation Mock Pattern Guide for vi.hoisted()
 *
 * ⚠️ IMPORTANT: Navigation mocks MUST be defined inline in your test files.
 * Due to Vitest's hoisting mechanism, you CANNOT import helper functions.
 * You MUST copy this pattern inline in each test file that needs navigation mocking.
 *
 * ## Why inline is required:
 * Vitest's `vi.hoisted()` executes BEFORE all imports are evaluated.
 * Imported functions are not yet available when vi.hoisted() runs.
 * See: https://vitest.dev/api/vi.html#vi-hoisted
 *
 * ## Pattern to copy:
 *
 * @example
 * // ✅ RECOMMENDED: Separate hoisted blocks by concern (better organization)
 * import { vi } from 'vitest';
 * import { Suspense, type ReactNode } from 'react';
 *
 * // Next.js core navigation (useSearchParams, useRouter, usePathname)
 * const nextNav = vi.hoisted(() => {
 *   const pathname = '/en/product/PROD001'; // ← Customize this
 *   const searchParams = new URLSearchParams();
 *
 *   return {
 *     pathname,
 *     searchParams,
 *     router: {
 *       push: vi.fn(),
 *       replace: vi.fn(),
 *     },
 *   };
 * });
 *
 * // Internationalized navigation (next-intl wrapper)
 * const i18nNav = vi.hoisted(() => {
 *   const pathname = '/en/product/PROD001';
 *
 *   return {
 *     pathname,
 *     router: {
 *       push: vi.fn(),
 *       replace: vi.fn(),
 *       prefetch: vi.fn(),
 *       back: vi.fn(),
 *       forward: vi.fn(),
 *       refresh: vi.fn(),
 *     },
 *     Link: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
 *       <a {...props}>{children}</a>
 *     ),
 *     redirect: vi.fn(),
 *     getPathname: vi.fn(() => pathname),
 *   };
 * });
 *
 * // Setup mocks BEFORE other imports
 * vi.mock('next/navigation', () => ({
 *   useSearchParams: () => nextNav.searchParams,
 *   useRouter: () => nextNav.router,
 *   usePathname: () => nextNav.pathname,
 * }));
 *
 * vi.mock('@/i18n/navigation', () => ({
 *   useRouter: () => i18nNav.router,
 *   usePathname: () => i18nNav.pathname,
 *   Link: i18nNav.Link,
 *   redirect: i18nNav.redirect,
 *   getPathname: i18nNav.getPathname,
 * }));
 *
 * // NOW import components
 * import { screen } from '@testing-library/react';
 * import ProductInfo from '@/components/product/ProductInfo';
 *
 * describe('ProductInfo', () => {
 *   beforeEach(() => {
 *     vi.clearAllMocks();
 *     nextNav.searchParams.delete('category');
 *   });
 *   // ... tests
 * });
 *
 * @example
 * // Different pathname examples:
 * const pathname = '/en/product/PROD001';  // Product page
 * const pathname = '/en/checkout';         // Checkout page
 * const pathname = '/en';                  // Home page
 *
 * // With search params:
 * const searchParams = new URLSearchParams('category=FOR_HER&page=2');
 *
 * ## Quick Start:
 * Use the VS Code snippet for fastest setup:
 * - Type: vitest-nav-mocks
 * - Press: Tab
 * - Customize the pathname as needed
 */

/**
 * Mock next-intl useTranslations hook
 * Note: This is a basic mock that returns the full key path.
 * For actual translations, use renderWithProviders which includes NextIntlClientProvider.
 */
export function mockUseTranslations() {
  vi.mock('next-intl', async () => {
    const actual = await vi.importActual('next-intl');
    return {
      ...actual,
      useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
      useLocale: () => 'en',
    };
  });
}

/**
 * Mock Next.js Image component to avoid layout warnings in tests
 */
export function mockNextImage() {
  vi.mock('next/image', () => ({
    default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} {...props} />;
    },
  }));
}

/**
 * Mock localStorage hook from usehooks-ts
 * Note: Due to Vitest hoisting, this should be set up in individual test files,
 * not as a utility function.
 */
export function createLocalStorageMock<T>(initialValue: T) {
  const setValue = vi.fn();
  return { value: initialValue, setValue };
}

/**
 * Create test translations for a given locale
 */
export function createTestMessages(locale: LocaleCode = 'en') {
  const baseMessages = {
    common: {
      add_to_cart:
        locale === 'ro' ? 'Adaugă în coș' : locale === 'ru' ? 'Добавить в корзину' : 'Add to Cart',
      remove: locale === 'ro' ? 'Șterge' : locale === 'ru' ? 'Удалить' : 'Remove',
      out_of_stock:
        locale === 'ro' ? 'Stoc epuizat' : locale === 'ru' ? 'Нет в наличии' : 'Out of Stock',
      discount: locale === 'ro' ? 'Reducere' : locale === 'ru' ? 'Скидка' : 'Discount',
      total: locale === 'ro' ? 'Total' : locale === 'ru' ? 'Итого' : 'Total',
    },
    Cart: {
      title: locale === 'ro' ? 'Coș' : locale === 'ru' ? 'Корзина' : 'Cart',
      empty:
        locale === 'ro'
          ? 'Coșul tău este gol. Vizitează magazinul pentru inspirație și recomandări personalizate.'
          : locale === 'ru'
            ? 'Ваша корзина пуста. Посетите магазин для вдохновения и персональных рекомендаций.'
            : 'Your cart is empty. Visit the shop for inspiration and personalized recommendations.',
      back:
        locale === 'ro'
          ? 'Înapoi la magazin'
          : locale === 'ru'
            ? 'Вернуться в магазин'
            : 'Back to shop',
      checkout:
        locale === 'ro' ? 'Finalizare comandă' : locale === 'ru' ? 'Оформить заказ' : 'Checkout',
      remove: locale === 'ro' ? 'Șterge' : locale === 'ru' ? 'Удалить' : 'Remove',
      subtotal: locale === 'ro' ? 'Subtotal' : locale === 'ru' ? 'Промежуточный итог' : 'Subtotal',
      to_checkout:
        locale === 'ro'
          ? 'Continuați la finalizare'
          : locale === 'ru'
            ? 'Перейти к оформлению'
            : 'Proceed to checkout',
    },
    CheckoutPage: {
      CheckoutForm: {
        method:
          locale === 'ro'
            ? 'Metodă de livrare'
            : locale === 'ru'
              ? 'Способ доставки'
              : 'Delivery Method',
        delivery:
          locale === 'ro'
            ? 'Livrare la domiciliu'
            : locale === 'ru'
              ? 'Доставка на дом'
              : 'Home Delivery',
        pickup:
          locale === 'ro' ? 'Ridicare de la magazin' : locale === 'ru' ? 'Самовывоз' : 'Pickup',
        email: locale === 'ro' ? 'Email' : locale === 'ru' ? 'Электронная почта' : 'Email',
        phone: locale === 'ro' ? 'Telefon' : locale === 'ru' ? 'Телефон' : 'Phone',
        first_name: locale === 'ro' ? 'Prenume' : locale === 'ru' ? 'Имя' : 'First Name',
        last_name: locale === 'ro' ? 'Nume' : locale === 'ru' ? 'Фамилия' : 'Last Name',
      },
      CheckoutCart: {
        summary:
          locale === 'ro' ? 'Sumar comandă' : locale === 'ru' ? 'Итог заказа' : 'Order Summary',
        subtotal:
          locale === 'ro' ? 'Subtotal' : locale === 'ru' ? 'Промежуточный итог' : 'Subtotal',
        delivery_cost:
          locale === 'ro'
            ? 'Cost livrare'
            : locale === 'ru'
              ? 'Стоимость доставки'
              : 'Delivery Cost',
        total: locale === 'ro' ? 'Total' : locale === 'ru' ? 'Итого' : 'Total',
        continue: locale === 'ro' ? 'Continuă' : locale === 'ru' ? 'Продолжить' : 'Continue',
        empty:
          locale === 'ro' ? 'Coșul este gol' : locale === 'ru' ? 'Корзина пуста' : 'Cart is empty',
        remove: locale === 'ro' ? 'Șterge' : locale === 'ru' ? 'Удалить' : 'Remove',
      },
    },
    HomePage: {
      Recommendations: {
        add_to_cart:
          locale === 'ro'
            ? 'Adaugă în coș'
            : locale === 'ru'
              ? 'Добавить в корзину'
              : 'Add to Cart',
        out_of_stock:
          locale === 'ro' ? 'Stoc epuizat' : locale === 'ru' ? 'Нет в наличии' : 'Out of Stock',
        on_command: locale === 'ro' ? 'La comandă' : locale === 'ru' ? 'Под заказ' : 'On Order',
        discount: locale === 'ro' ? 'Reducere' : locale === 'ru' ? 'Скидка' : 'Discount',
      },
    },
    ProductPage: {
      stock_state: {
        IN_STOCK: locale === 'ro' ? 'ÎN STOC' : locale === 'ru' ? 'В НАЛИЧИИ' : 'IN STOCK',
        ON_COMMAND: locale === 'ro' ? 'LA COMANDĂ' : locale === 'ru' ? 'ПОД ЗАКАЗ' : 'ON ORDER',
        NOT_IN_STOCK:
          locale === 'ro' ? 'STOC EPUIZAT' : locale === 'ru' ? 'НЕТ В НАЛИЧИИ' : 'OUT OF STOCK',
      },
      add_to_cart:
        locale === 'ro' ? 'Adaugă în coș' : locale === 'ru' ? 'Добавить в корзину' : 'Add to cart',
      includes:
        locale === 'ro' ? 'Cadoul include' : locale === 'ru' ? 'Подарок включает' : 'Gift includes',
      description: locale === 'ro' ? 'Descriere' : locale === 'ru' ? 'Описание' : 'Description',
      features:
        locale === 'ro' ? 'Caracteristici' : locale === 'ru' ? 'Характеристики' : 'Features',
    },
  };

  return baseMessages;
}

/**
 * Create a fresh QueryClient for each test to avoid state leakage
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Create a test tRPC client that doesn't make real network requests
 */
export function createTestTRPCClient() {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/api/trpc', // Doesn't matter - we won't make actual requests
      }),
    ],
  });
}

/**
 * Pre-populate tRPC query cache for testing
 *
 * Helper function to set up tRPC query data in the QueryClient cache.
 * This is useful for testing components that use `useSuspenseQuery` or `useQuery`
 * from tRPC without making actual network requests.
 *
 * **Note:** This helper is available for convenience but not required.
 * You can also manually construct the query key and call `queryClient.setQueryData()` directly.
 *
 * @template T - The type of data being cached
 * @param queryClient - The QueryClient instance (from createTestQueryClient())
 * @param config - Configuration object
 * @param config.router - tRPC router name (e.g., 'products', 'order', 'cart')
 * @param config.procedure - tRPC procedure name (e.g., 'getProductById', 'getProducts')
 * @param config.input - Input parameters for the procedure (optional)
 * @param config.data - The mock data to cache
 *
 * @example
 * ```typescript
 * // Single product by ID
 * setTRPCQueryData(queryClient, {
 *   router: 'products',
 *   procedure: 'getProductById',
 *   input: { id: mockProduct.custom_id },
 *   data: { product: mockProduct },
 * });
 *
 * // Product list (no input needed)
 * setTRPCQueryData(queryClient, {
 *   router: 'products',
 *   procedure: 'getProducts',
 *   input: {},
 *   data: { products: [mockProduct1, mockProduct2] },
 * });
 *
 * // Cart (undefined input)
 * setTRPCQueryData(queryClient, {
 *   router: 'cart',
 *   procedure: 'getCart',
 *   data: { cart: mockCartItems },
 * });
 * ```
 */
export function setTRPCQueryData<T>(
  queryClient: QueryClient,
  config: {
    router: string;
    procedure: string;
    input?: Record<string, unknown> | undefined;
    data: T;
  }
): void {
  const trpcQueryKey = [
    [config.router, config.procedure],
    { input: config.input, type: 'query' as const },
  ];

  queryClient.setQueryData(trpcQueryKey, config.data);
}

/**
 * Wrapper component that provides all necessary context providers
 */
interface AllProvidersProps {
  children: ReactNode;
  locale?: LocaleCode;
  messages?: Record<string, string> | Record<string, Record<string, string>>;
  queryClient?: QueryClient;
  trpcClient?: ReturnType<typeof createTestTRPCClient>;
  includeTRPC?: boolean;
}

export function AllProviders({
  children,
  locale = 'en',
  messages,
  queryClient,
  trpcClient,
  includeTRPC = true,
}: AllProvidersProps) {
  const testMessages = (messages || createTestMessages(locale)) as Record<
    string,
    string | Record<string, string>
  >;
  const testQueryClient = queryClient || createTestQueryClient();
  const testTRPCClient = trpcClient || createTestTRPCClient();

  // If includeTRPC is false, just render without TRPCProvider for backward compatibility
  if (!includeTRPC) {
    return (
      <QueryClientProvider client={testQueryClient}>
        <NextIntlClientProvider locale={locale} messages={testMessages}>
          {children}
        </NextIntlClientProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={testQueryClient}>
      <TRPCProvider trpcClient={testTRPCClient} queryClient={testQueryClient}>
        <NextIntlClientProvider locale={locale} messages={testMessages}>
          {children}
        </NextIntlClientProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
}

/**
 * Custom render function that wraps components with all providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: LocaleCode;
  messages?: Record<string, string> | Record<string, Record<string, string>>;
  queryClient?: QueryClient;
  trpcClient?: ReturnType<typeof createTestTRPCClient>;
  includeTRPC?: boolean;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    locale = 'en',
    messages,
    queryClient,
    trpcClient,
    includeTRPC = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AllProviders
        locale={locale}
        messages={messages}
        queryClient={queryClient}
        trpcClient={trpcClient}
        includeTRPC={includeTRPC}
      >
        {children}
      </AllProviders>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Render component with Suspense boundary and all providers
 *
 * ⚠️ Most tests should use `renderSuspenseResolved()` instead (simpler API).
 * Only use this when you need more control (e.g., testing loading states).
 *
 * @example
 * // Basic usage - then use findBy to wait
 * renderWithSuspense(<ProductInfo id="PROD001" />, { queryClient });
 * const heading = await screen.findByRole('heading', { level: 1 });
 *
 * @see renderSuspenseResolved - **RECOMMENDED** - Async version that auto-waits (use by default)
 * @see https://react.dev/reference/react/Suspense
 */
export function renderWithSuspense(
  ui: ReactElement,
  {
    fallback = <div>Loading...</div>,
    ...options
  }: CustomRenderOptions & { fallback?: ReactNode } = {}
) {
  return renderWithProviders(<Suspense fallback={fallback}>{ui}</Suspense>, options);
}

/**
 * ⭐ **RECOMMENDED** - Render component with Suspense and wait for resolution
 *
 * Use this by default for ~95% of component tests. This async helper automatically
 * waits for the Suspense fallback to disappear, so your component is ready to test
 * immediately after the `await`.
 *
 * @example
 * // Default usage - simplest API
 * await renderSuspenseResolved(<ProductInfo id="PROD001" />, { queryClient });
 *
 * // Component is ready - test immediately (no findBy needed)
 * expect(screen.getByRole('heading')).toHaveTextContent('Test Product');
 * expect(screen.getByAltText('logo')).toBeInTheDocument();
 *
 * @throws {Error} If Suspense component does not resolve within timeout (default 3000ms)
 * @see renderWithSuspense - Alternative for testing loading states or when you need more control
 * @see https://testing-library.com/docs/dom-testing-library/api-async/#waitforelementtoberemoved
 */
export async function renderSuspenseResolved(
  ui: ReactElement,
  {
    fallback = <div>Loading...</div>,
    fallbackText = 'Loading...',
    timeout = 3000,
    ...options
  }: CustomRenderOptions & {
    fallback?: ReactNode;
    fallbackText?: string;
    timeout?: number;
  } = {}
) {
  // Render with Suspense boundary
  const result = renderWithSuspense(ui, { fallback, ...options });

  try {
    // Check if fallback exists before waiting for removal
    const fallbackElement = screen.queryByText(fallbackText);

    if (fallbackElement) {
      // Wait for fallback to be removed (component has resolved)
      await waitForElementToBeRemoved(() => screen.queryByText(fallbackText), {
        timeout,
      });
    }
    // If fallback doesn't exist, data was already cached - no need to wait
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Suspense component did not resolve within ${timeout}ms.\n` +
        `Expected fallback "${fallbackText}" to be removed.\n` +
        `Original error: ${errorMsg}\n\n` +
        `💡 Tip: Ensure query cache is populated before rendering:\n` +
        `   queryClient.setQueryData(trpcQueryKey, { data: mockData });\n\n` +
        `💡 Alternative: Use findBy queries for better error messages:\n` +
        `   const element = await screen.findByRole('heading', { level: 1 });`
    );
  }

  return result;
}

/**
 * Mock tRPC utilities
 */
export function mockTRPCQuery<T>(data: T) {
  return {
    data,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    refetch: vi.fn(),
  };
}

export function mockTRPCMutation() {
  const mutate = vi.fn();
  const mutateAsync = vi.fn();

  return {
    mutate,
    mutateAsync,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    reset: vi.fn(),
  };
}

/**
 * Factory: Create mock cart item
 */
export function createMockCartItem(
  productId: string = 'PROD001',
  quantity: number = 1
): CartInterface {
  return {
    productId,
    quantity,
  };
}

/**
 * Factory: Create mock product with sensible defaults
 */
export function createMockProduct(overrides: Partial<ProductInterface> = {}): ProductInterface {
  return {
    _id: '507f1f77bcf86cd799439011',
    custom_id: 'PROD001',
    title: {
      ro: 'Produs Test',
      ru: 'Тестовый продукт',
      en: 'Test Product',
    },
    description: {
      ro: 'Descriere produs',
      ru: 'Описание продукта',
      en: 'Product description',
    },
    long_description: {
      ro: 'Descriere lungă a produsului',
      ru: 'Длинное описание продукта',
      en: 'Long product description',
    },
    product_content: [
      {
        ro: '<p>Conținut produs</p>',
        ru: '<p>Содержимое продукта</p>',
        en: '<p>Product content</p>',
      },
    ],
    ocasions: [],
    price: 100,
    stock_availability: {
      state: StockState.IN_STOCK,
      stock: 10,
    },
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    tags: [],
    categories: [],
    sale: {
      active: false,
      sale_price: 0,
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  } as ProductInterface;
}

/**
 * Factory: Create product with sale
 */
export function createMockProductOnSale(salePrice: number = 80): ProductInterface {
  return createMockProduct({
    sale: {
      active: true,
      sale_price: salePrice,
    },
  });
}

/**
 * Factory: Create out of stock product
 */
export function createMockProductOutOfStock(): ProductInterface {
  return createMockProduct({
    stock_availability: {
      state: StockState.NOT_IN_STOCK,
      stock: 0,
    },
  });
}

/**
 * Factory: Create multiple products
 */
export function createMockProducts(count: number): ProductInterface[] {
  return Array.from({ length: count }, (_, i) =>
    createMockProduct({
      custom_id: `PROD${String(i + 1).padStart(3, '0')}`,
      title: {
        ro: `Produs ${i + 1}`,
        ru: `Продукт ${i + 1}`,
        en: `Product ${i + 1}`,
      },
      price: 100 + i * 10,
    })
  );
}

/**
 * Mock Intersection Observer for lazy loading tests
 */
export function mockIntersectionObserver() {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
}

/**
 * Mock window.matchMedia for responsive tests
 */
export function mockMatchMedia(matches: boolean = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

/**
 * Wait for async operations (useful for testing async side effects)
 */
export function waitForAsync(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Re-export common testing utilities
 */
export * from '@testing-library/react';
export { vi, expect } from 'vitest';

/**
 * Convenience aliases for factory functions
 */
export const mockProduct = createMockProduct;
export const mockCartItem = createMockCartItem;

/**
 * Form Testing Utilities
 */

/**
 * Setup portal container for Radix UI components (Select, Popover, Calendar, etc.)
 * Call this in beforeEach to ensure portals render correctly in tests
 */
export function setupPortalContainer() {
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'portal-root');
  document.body.appendChild(portalRoot);
  return () => {
    document.body.removeChild(portalRoot);
  };
}

/**
 * Render a form field with React Hook Form context
 * Useful for testing individual form inputs with validation
 *
 * Note: Import useForm and FormProvider in your test file, then pass them
 * or simply use this helper with FormProvider already imported
 */
export function renderFormField(
  ui: ReactElement,
  options?: {
    defaultValues?: Record<string, unknown>;
    mode?: 'onChange' | 'onBlur' | 'onSubmit';
  }
) {
  // Import react-hook-form at runtime to use in wrapper
  // This is a test utility, so dynamic import is acceptable here
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useForm, FormProvider } = require('react-hook-form');

  function Wrapper({ children }: { children: ReactNode }) {
    const methods = useForm({
      defaultValues: options?.defaultValues || {},
      mode: options?.mode || 'onChange',
    });

    return <FormProvider {...methods}>{children}</FormProvider>;
  }

  return render(ui, { wrapper: Wrapper });
}

/**
 * Simulate keyboard navigation
 * Useful for testing accessibility of form components
 */
export function pressKey(element: Element, key: string, options?: KeyboardEventInit) {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    })
  );
}

/**
 * Check if element has proper ARIA attributes
 */
export function expectAccessibleInput(element: Element) {
  expect(element).toHaveAttribute('aria-invalid');
  // Most inputs should have either aria-label or associated label
  const hasAriaLabel = element.hasAttribute('aria-label');
  const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
  const hasId = element.hasAttribute('id');

  expect(hasAriaLabel || hasAriaLabelledBy || hasId).toBe(true);
}

/**
 * Standard external dependency mocks for form component tests
 * These should be called at the top of each test file (before imports)
 */
export const STANDARD_FORM_MOCKS = `
// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock lucide icons (if needed)
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    // Add specific icon mocks as needed
  };
});
`;
