import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

/**
 * Mock dependencies - MUST be before imports
 */
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
  cubicBezier: vi.fn(() => [0, 0, 0, 0]),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...inputs: unknown[]) => inputs.join(' '),
  easeInOutCubic: [0, 0, 0, 0],
  addToCart: vi.fn(),
  getTagColor: vi.fn(),
  checkboxUpdateUrlParams: vi.fn(),
}));

const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/en/catalog',
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: unknown }) => (
    <a href={typeof href === 'string' ? href : '#'} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

vi.mock('usehooks-ts', () => ({
  useLocalStorage: (key: string, initialValue: unknown) => [initialValue || [], vi.fn()],
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

import { render, screen, cleanup } from '@testing-library/react';
import { createMockProduct, createMockProductOnSale } from '@/__tests__/helpers/componentTestUtils';
import ProductCard from '@/components/catalog/productsGrid/ProductCard';

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render product title and price', () => {
      const product = createMockProduct({
        title: {
          ro: 'Produs Test',
          ru: 'Тестовый продукт',
          en: 'Test Product',
        },
        price: 100,
      });

      render(<ProductCard product={product} />);

      expect(screen.getByText(product.title.en)).toBeInTheDocument();
      expect(screen.getByText(`${product.price} MDL`)).toBeInTheDocument();
    });

    it('should render product images', () => {
      const product = createMockProduct({
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        title: { ro: 'Produs', ru: 'Продукт', en: 'Product' },
      });

      render(<ProductCard product={product} />);

      const images = screen.getAllByAltText(product.title.ro);
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', product.images[0]);
      expect(images[1]).toHaveAttribute('src', product.images[1]);
    });

    it('should render navigation link to product detail page', () => {
      const product = createMockProduct();

      render(<ProductCard product={product} />);

      const productLinks = screen.getAllByRole('link');
      expect(productLinks).toHaveLength(1);
    });
  });

  describe('Sale Display', () => {
    it('should display sale badge when product is on sale', () => {
      const product = createMockProductOnSale(80);

      render(<ProductCard product={product} />);

      // The translation key is rendered due to mock
      expect(screen.getByText(/discount/i)).toBeInTheDocument();
    });
  });

  describe('Price Formatting', () => {
    it('should format large prices with thousand separators', () => {
      const product = createMockProduct({
        price: 1500,
      });

      render(<ProductCard product={product} />);

      expect(screen.getByText(/1,500 MDL/i)).toBeInTheDocument();
    });

    it('should handle zero price', () => {
      const product = createMockProduct({
        price: 0,
      });

      render(<ProductCard product={product} />);

      expect(screen.getByText('0 MDL')).toBeInTheDocument();
    });
  });

  describe('Rendering Variations', () => {
    it('should render correctly', () => {
      const product = createMockProduct();

      const { container } = render(<ProductCard product={product} />);

      expect(container.querySelector('.font-manrope')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long product title', () => {
      const longTitle = 'This is a very long product title that might wrap to multiple lines';
      const product = createMockProduct({
        title: {
          ro: longTitle,
          ru: longTitle,
          en: longTitle,
        },
      });

      render(<ProductCard product={product} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle product with single image', () => {
      const product = createMockProduct({
        images: ['https://example.com/single-image.jpg'],
      });

      render(<ProductCard product={product} />);

      expect(screen.getByText(product.title.en)).toBeInTheDocument();
    });
  });
});
