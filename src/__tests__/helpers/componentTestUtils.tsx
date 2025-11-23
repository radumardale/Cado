import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { vi, expect } from 'vitest';
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
 * Mock Motion components to render as static divs for testing
 */
export function mockMotion() {
  // vi.mock('motion/react', () => ({
  //   motion: {
  //     div: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
  //       <div {...props}>{children}</div>
  //     ),
  //     button: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
  //       <button {...props}>{children}</button>
  //     ),
  //     span: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => (
  //       <span {...props}>{children}</span>
  //     ),
  //   },
  //   AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  //   cubicBezier: () => [0.65, 0, 0.35, 1], // Mock easing function
  // }));
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
