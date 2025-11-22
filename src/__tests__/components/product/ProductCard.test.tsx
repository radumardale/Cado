import { describe, it, expect, vi, beforeEach } from 'vitest';
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

import { render, screen } from '@testing-library/react';
import { createMockProduct, createMockProductOnSale } from '@/__tests__/helpers/componentTestUtils';
import ProductCard from '@/components/catalog/productsGrid/ProductCard';
import { Categories } from '@/lib/enums/Categories';

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('100 MDL')).toBeInTheDocument();
    });

    it('should render product images', () => {
      const product = createMockProduct({
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        title: { ro: 'Produs', ru: 'Продукт', en: 'Product' },
      });

      render(<ProductCard product={product} />);

      const images = screen.getAllByAltText('Produs');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
    });

    it('should render navigation link to product detail page', () => {
      const product = createMockProduct();

      render(<ProductCard product={product} />);

      const productLinks = screen.getAllByRole('link');
      expect(productLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Sale Display', () => {
    it('should display sale badge when product is on sale', () => {
      const product = createMockProductOnSale(80);

      render(<ProductCard product={product} />);

      expect(screen.getByText('discount')).toBeInTheDocument();
    });

    it('should not display sale badge when product is not on sale', () => {
      const product = createMockProduct({
        sale: {
          active: false,
          sale_price: 0,
        },
      });

      render(<ProductCard product={product} />);

      expect(screen.queryByText('discount')).not.toBeInTheDocument();
    });

    it('should show both original and sale price when on sale', () => {
      const product = createMockProduct({
        price: 100,
        sale: {
          active: true,
          sale_price: 80,
        },
      });

      render(<ProductCard product={product} />);

      expect(screen.getByText('100 MDL')).toHaveClass('line-through');
      const prices = screen.getAllByText(/MDL/i);
      expect(prices.length).toBeGreaterThan(1);
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

  describe('Category Integration', () => {
    it('should work with category prop', () => {
      const product = createMockProduct({ custom_id: 'PROD123' });

      render(<ProductCard product={product} category={'BOQUETS' as unknown as Categories} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should work without category prop', () => {
      const product = createMockProduct();

      render(<ProductCard product={product} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
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

      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });
});
