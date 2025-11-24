import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { type ReactNode } from 'react';

// Navigation mocks organized by concern - must be defined inline due to hoisting constraints
// For the reasoning, see: https://vitest.dev/api/vi.html#vi-hoisted

// Next.js core navigation (useSearchParams, useRouter, usePathname, useParams)
const nextNav = vi.hoisted(() => {
  const pathname = '/en/product/PROD001';
  const searchParams = new URLSearchParams();
  let currentLocale: LocaleCode = 'en'; // Track current locale for useParams

  return {
    pathname,
    searchParams,
    router: {
      push: vi.fn(),
      replace: vi.fn(),
    },
    params: { locale: currentLocale } as { locale: LocaleCode },
    setLocale: (locale: LocaleCode) => {
      currentLocale = locale;
      nextNav.params = { locale };
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
  useParams: () => nextNav.params,
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => i18nNav.router,
  usePathname: () => i18nNav.pathname,
  Link: i18nNav.Link,
  redirect: i18nNav.redirect,
  getPathname: i18nNav.getPathname,
}));

// Mock next-intl with dynamic useLocale
const mockUseLocale = vi.hoisted(() => vi.fn(() => 'en'));

vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl');
  return {
    ...actual,
    useLocale: mockUseLocale,
    useTranslations: vi.fn(() => (key: string) => key),
  };
});

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
    nextNav.setLocale('en'); // Reset to English for each test
    mockUseLocale.mockReturnValue('en' as LocaleCode); // Reset useLocale mock
  });

  afterEach(() => {
    cleanup();
  });

  it('should render without crashing', async () => {
    // Create query client and populate cache
    const queryClient = createTestQueryClient();

    const trpcQueryKey = [
      ['products', 'getProductById'],
      { input: { id: mockProduct.custom_id }, type: 'query' },
    ];

    queryClient.setQueryData(trpcQueryKey, {
      product: mockProduct,
    });

    // Render and wait for Suspense to resolve
    await renderSuspenseResolved(<ProductInfo id={mockProduct.custom_id} />, {
      queryClient,
    });

    // Component is ready - test immediately
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(mockProduct.title.en);

    // Verify other content
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(document.body.textContent).toMatch(new RegExp(mockProduct.price.toString()));
    expect(document.querySelector('.skeleton')).not.toBeInTheDocument();
  });

  it('should display skeleton placeholders when product is loading', async () => {
    const queryClient = createTestQueryClient();

    const trpcQueryKey = [
      ['products', 'getProductById'],
      { input: { id: 'PROD001' }, type: 'query' },
    ];

    // Populate cache with null to simulate loading/no data state
    queryClient.setQueryData(trpcQueryKey, {
      product: null,
    });

    await renderSuspenseResolved(<ProductInfo id='PROD001' />, {
      queryClient,
    });

    // Verify skeleton elements are present (Skeleton component uses data-testid)
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(5);

    // Verify no product content is shown
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });

  it('should display breadcrumb navigation with product title and category', async () => {
    const queryClient = createTestQueryClient();

    const product = createMockProduct({
      custom_id: 'PROD002',
      title: {
        ro: 'Geantă Designer',
        ru: 'Дизайнерская сумка',
        en: 'Designer Bag',
      },
      categories: [Categories.FOR_HER],
    });

    const trpcQueryKey = [
      ['products', 'getProductById'],
      { input: { id: product.custom_id }, type: 'query' },
    ];

    queryClient.setQueryData(trpcQueryKey, {
      product,
    });

    await renderSuspenseResolved(<ProductInfo id={product.custom_id} />, {
      queryClient,
    });

    // Verify product title appears in the page (breadcrumbs are in the DOM)
    expect(document.body.textContent).toContain(product.title.en);

    // Verify breadcrumb link structure exists (Home link should be present)
    const homeLinks = screen.getAllByRole('link', { name: /home|главная|acasă/i });
    expect(homeLinks.length).toBeGreaterThan(0);
  });

  it('should use URL category parameter when present', async () => {
    const queryClient = createTestQueryClient();

    const product = createMockProduct({
      custom_id: 'PROD003',
      title: {
        ro: 'Ceas Unisex',
        ru: 'Унисекс часы',
        en: 'Unisex Watch',
      },
      categories: [Categories.FOR_HER], // Product is in FOR_HER
    });

    const trpcQueryKey = [
      ['products', 'getProductById'],
      { input: { id: product.custom_id }, type: 'query' },
    ];

    queryClient.setQueryData(trpcQueryKey, {
      product,
    });

    // Simulate user coming from FOR_HIM category page via URL parameter
    nextNav.searchParams.set('category', Categories.FOR_HIM);

    await renderSuspenseResolved(<ProductInfo id={product.custom_id} />, {
      queryClient,
    });

    // Verify the component renders successfully with category param
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(product.title.en);

    // Clean up
    nextNav.searchParams.delete('category');
  });

  it('should display product images with navigation controls', async () => {
    const queryClient = createTestQueryClient();

    const product = createMockProduct({
      custom_id: 'PROD004',
      title: {
        ro: 'Portofel Premium',
        ru: 'Премиум кошелек',
        en: 'Premium Wallet',
      },
      images: [
        'https://cdn.example.com/wallet-front.jpg',
        'https://cdn.example.com/wallet-back.jpg',
        'https://cdn.example.com/wallet-side.jpg',
      ],
    });

    const trpcQueryKey = [
      ['products', 'getProductById'],
      { input: { id: product.custom_id }, type: 'query' },
    ];

    queryClient.setQueryData(trpcQueryKey, {
      product,
    });

    await renderSuspenseResolved(<ProductInfo id={product.custom_id} />, {
      queryClient,
    });

    // Verify image counter is displayed (format: "1 / 3")
    expect(document.body.textContent).toMatch(/1\s*\/\s*3/);

    // Verify images are rendered
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should display complete product information and purchase controls', async () => {
    const queryClient = createTestQueryClient();

    const product = createMockProduct({
      custom_id: 'PROD005',
      title: {
        ro: 'Rochie Elegantă',
        ru: 'Элегантное платье',
        en: 'Elegant Dress',
      },
      price: 599,
      sale: {
        active: true,
        sale_price: 449,
      },
      description: {
        ro: '<p>Rochie din mătase naturală</p>',
        ru: '<p>Платье из натурального шелка</p>',
        en: '<p>Natural silk dress</p>',
      },
    });

    const trpcQueryKey = [
      ['products', 'getProductById'],
      { input: { id: product.custom_id }, type: 'query' },
    ];

    queryClient.setQueryData(trpcQueryKey, {
      product,
    });

    await renderSuspenseResolved(<ProductInfo id={product.custom_id} />, {
      queryClient,
    });

    // Verify product title
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(product.title.en);

    // Verify sale price is displayed
    expect(document.body.textContent).toContain('449');

    // Verify original price is displayed (should be crossed out)
    expect(document.body.textContent).toContain('599');

    // Verify description content
    expect(document.body.textContent).toContain('Natural silk dress');

    // Verify buttons exist (quantity controls and add to cart)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should hide similar products section when product has no categories', async () => {
    const queryClient = createTestQueryClient();

    const product = createMockProduct({
      custom_id: 'PROD006',
      title: {
        ro: 'Produs Necategorizat',
        ru: 'Некатегоризированный товар',
        en: 'Uncategorized Item',
      },
      categories: [], // No categories
    });

    const trpcQueryKey = [
      ['products', 'getProductById'],
      { input: { id: product.custom_id }, type: 'query' },
    ];

    queryClient.setQueryData(trpcQueryKey, {
      product,
    });

    await renderSuspenseResolved(<ProductInfo id={product.custom_id} />, {
      queryClient,
    });

    // Verify "Similar Products" heading is NOT present
    expect(screen.queryByText(/similar products/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/similar_products/i)).not.toBeInTheDocument();
  });

  describe('Internationalization', () => {
    it('should display product information in English locale', async () => {
      const queryClient = createTestQueryClient();

      const product = createMockProduct({
        custom_id: 'PROD007',
        title: {
          en: 'Luxury Watch',
          ro: 'Ceas de Lux',
          ru: 'Роскошные Часы',
        },
        description: {
          en: '<p>Premium timepiece</p>',
          ro: '<p>Ceas premium</p>',
          ru: '<p>Премиум часы</p>',
        },
      });

      const trpcQueryKey = [
        ['products', 'getProductById'],
        { input: { id: product.custom_id }, type: 'query' },
      ];

      queryClient.setQueryData(trpcQueryKey, {
        product,
      });

      await renderSuspenseResolved(<ProductInfo id={product.custom_id} />, {
        queryClient,
        locale: 'en',
      });

      // Verify English title is displayed
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Luxury Watch');

      // Verify English description content
      expect(document.body.textContent).toContain('Premium timepiece');
    });

    it('should handle multilingual product data structure', async () => {
      const queryClient = createTestQueryClient();

      // Product with all three languages populated
      const multilingualProduct = createMockProduct({
        custom_id: 'PROD008',
        title: {
          en: 'Elegant Dress',
          ro: 'Rochie Elegantă',
          ru: 'Элегантное платье',
        },
        description: {
          en: '<p>Beautiful evening dress</p>',
          ro: '<p>Rochie frumoasă de seară</p>',
          ru: '<p>Красивое вечернее платье</p>',
        },
      });

      const trpcQueryKey = [
        ['products', 'getProductById'],
        { input: { id: multilingualProduct.custom_id }, type: 'query' },
      ];

      queryClient.setQueryData(trpcQueryKey, {
        product: multilingualProduct,
      });

      await renderSuspenseResolved(<ProductInfo id={multilingualProduct.custom_id} />, {
        queryClient,
      });

      // Component renders successfully with multilingual data
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();

      // Verify English is displayed (default locale in tests)
      expect(heading).toHaveTextContent('Elegant Dress');
      expect(document.body.textContent).toContain('Beautiful evening dress');
    });
  });
});
