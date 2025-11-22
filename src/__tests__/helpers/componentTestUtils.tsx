import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { CartInterface } from '@/lib/types/CartInterface';
import { ProductInterface } from '@/models/product/types/productInterface';
import { StockState } from '@/lib/enums/StockState';

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
 * Mock next-intl useTranslations hook
 */
export function mockUseTranslations() {
  vi.mock('next-intl', async () => {
    const actual = await vi.importActual('next-intl');
    return {
      ...actual,
      useTranslations: () => (key: string) => key,
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
 * Mock Motion components to render as static divs for testing
 */
export function mockMotion() {
  vi.mock('motion/react', () => ({
    motion: {
      div: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
        <div {...props}>{children}</div>
      ),
      button: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
        <button {...props}>{children}</button>
      ),
      span: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
        <span {...props}>{children}</span>
      ),
    },
    AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
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
        locale === 'ro' ? 'Coșul este gol' : locale === 'ru' ? 'Корзина пуста' : 'Cart is empty',
      checkout:
        locale === 'ro' ? 'Finalizare comandă' : locale === 'ru' ? 'Оформить заказ' : 'Checkout',
      remove: locale === 'ro' ? 'Șterge' : locale === 'ru' ? 'Удалить' : 'Remove',
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
 * Wrapper component that provides all necessary context providers
 */
interface AllProvidersProps {
  children: ReactNode;
  locale?: LocaleCode;
  messages?: Record<string, string> | Record<string, Record<string, string>>;
  queryClient?: QueryClient;
}

export function AllProviders({
  children,
  locale = 'en',
  messages,
  queryClient,
}: AllProvidersProps) {
  const testMessages = (messages || createTestMessages(locale)) as Record<
    string,
    string | Record<string, string>
  >;
  const testQueryClient = queryClient || createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      <NextIntlClientProvider locale={locale} messages={testMessages}>
        {children}
      </NextIntlClientProvider>
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
}

export function renderWithProviders(
  ui: ReactElement,
  { locale = 'en', messages, queryClient, ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AllProviders locale={locale} messages={messages} queryClient={queryClient}>
        {children}
      </AllProviders>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
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
export { vi } from 'vitest';
