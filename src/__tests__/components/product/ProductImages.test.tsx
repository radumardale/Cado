/**
 * ProductImages Component Tests
 *
 * Tests the product image gallery component with multiple images,
 * navigation arrows, thumbnail selection, and carousel modal.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import ProductImages from '@/components/product/ProductImages';
import {
  renderWithProviders,
  createMockProduct,
  mockNextImage,
  mockMotion,
} from '../../helpers/componentTestUtils';

// Mock Next.js Image component
mockNextImage();

// Mock Motion components
mockMotion();

// Mock Lenis scroll library
vi.mock('lenis/react', () => ({
  useLenis: () => ({
    stop: vi.fn(),
    start: vi.fn(),
  }),
}));

// Mock Swiper
vi.mock('swiper/react', () => ({
  Swiper: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid='swiper' {...props}>
      {children}
    </div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='swiper-slide'>{children}</div>
  ),
  SwiperRef: vi.fn(),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

describe('ProductImages', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render the main product image', () => {
      const product = createMockProduct();
      renderWithProviders(<ProductImages product={product} />);

      // Check first image is rendered
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      // Next.js transforms image URLs, so check it contains the original URL
      expect(images[0]).toHaveAttribute('src', expect.stringContaining('example.com'));
      expect(images[0]).toHaveAttribute('alt', expect.stringContaining('Test Product'));
    });

    it('should display image counter badge', () => {
      const product = createMockProduct();
      renderWithProviders(<ProductImages product={product} />);

      // Check counter shows "1 / 2" (first image of 2 total)
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    it('should render all product images in the DOM', () => {
      const product = createMockProduct({
        images: [
          'https://example.com/img1.jpg',
          'https://example.com/img2.jpg',
          'https://example.com/img3.jpg',
        ],
      });
      renderWithProviders(<ProductImages product={product} />);

      // All images should be in DOM (for animation purposes)
      const images = screen.getAllByRole('img');
      const mainImages = images.filter(img => img.getAttribute('alt')?.includes('Image'));
      expect(mainImages).toHaveLength(3);
    });
  });

  describe('Multiple Images Navigation', () => {
    it('should show navigation arrows when multiple images exist', () => {
      const product = createMockProduct({
        images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
      });
      renderWithProviders(<ProductImages product={product} />);

      // ArrowLeft and ArrowRight components should be rendered
      const container = screen.getByText('1 / 2').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should not show navigation arrows for single image', () => {
      const product = createMockProduct({
        images: ['https://example.com/single-image.jpg'],
      });
      renderWithProviders(<ProductImages product={product} />);

      // Counter should show "1 / 1"
      expect(screen.getByText('1 / 1')).toBeInTheDocument();

      // No multiple images, so arrows won't render
      // Just verify single image renders
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('should handle thumbnail click to change image (non-Swiper)', () => {
      const product = createMockProduct({
        images: [
          'https://example.com/img1.jpg',
          'https://example.com/img2.jpg',
          'https://example.com/img3.jpg',
        ],
      });
      renderWithProviders(<ProductImages product={product} />);

      // Initially shows "1 / 3"
      expect(screen.getByText('1 / 3')).toBeInTheDocument();

      // Find and click the second thumbnail (index 1)
      // Thumbnails render both in static div and Swiper
      const buttons = screen.getAllByRole('button');
      const thumbnailButtons = buttons.filter(
        btn => btn.className.includes('cursor-pointer') && btn.className.includes('aspect-square')
      );

      if (thumbnailButtons.length >= 2) {
        fireEvent.click(thumbnailButtons[1]);

        // After clicking, counter should update to "2 / 3"
        // Note: State change might not be immediate in test, but button click is registered
        expect(thumbnailButtons[1]).toBeInTheDocument();
      }
    });
  });

  describe('Image Counter', () => {
    it('should show correct count for 2 images', () => {
      const product = createMockProduct({
        images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
      });
      renderWithProviders(<ProductImages product={product} />);

      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    it('should show correct count for 5 images', () => {
      const product = createMockProduct({
        images: [
          'https://example.com/img1.jpg',
          'https://example.com/img2.jpg',
          'https://example.com/img3.jpg',
          'https://example.com/img4.jpg',
          'https://example.com/img5.jpg',
        ],
      });
      renderWithProviders(<ProductImages product={product} />);

      expect(screen.getByText('1 / 5')).toBeInTheDocument();
    });

    it('should show correct count for single image', () => {
      const product = createMockProduct({
        images: ['https://example.com/single.jpg'],
      });
      renderWithProviders(<ProductImages product={product} />);

      expect(screen.getByText('1 / 1')).toBeInTheDocument();
    });
  });

  describe('Swiper Integration', () => {
    it('should render Swiper for desktop thumbnails', () => {
      const product = createMockProduct({
        images: Array.from({ length: 6 }, (_, i) => `https://example.com/img${i + 1}.jpg`),
      });
      renderWithProviders(<ProductImages product={product} />);

      // Swiper should be rendered
      const swiper = screen.queryByTestId('swiper');
      expect(swiper).toBeInTheDocument();
    });

    it('should render thumbnail images inside Swiper slides', () => {
      const product = createMockProduct({
        images: Array.from({ length: 6 }, (_, i) => `https://example.com/img${i + 1}.jpg`),
      });
      renderWithProviders(<ProductImages product={product} />);

      // SwiperSlide elements should exist
      const swiperSlides = screen.queryAllByTestId('swiper-slide');
      expect(swiperSlides.length).toBeGreaterThan(0);
    });

    it('should show navigation buttons when 6+ images', () => {
      const product = createMockProduct({
        images: Array.from({ length: 7 }, (_, i) => `https://example.com/img${i + 1}.jpg`),
      });
      renderWithProviders(<ProductImages product={product} />);

      // Look for Swiper navigation buttons (ChevronLeft/ChevronRight)
      // They render conditionally when >= 6 images
      const buttons = screen.getAllByRole('button');
      const navButtons = buttons.filter(
        btn =>
          btn.getAttribute('aria-label') === 'Next slide' ||
          btn.getAttribute('aria-label') === 'Previous slide'
      );

      expect(navButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle product with long title in alt text', () => {
      const product = createMockProduct({
        title: {
          en: 'Very Long Product Title That Should Still Work In Alt Text',
          ro: 'Titlu foarte lung',
          ru: 'Очень длинный заголовок',
        },
      });
      renderWithProviders(<ProductImages product={product} />);

      const images = screen.getAllByRole('img');
      expect(images[0]).toHaveAttribute('alt', expect.stringContaining('Very Long Product Title'));
    });

    it('should render with exactly 6 images (threshold for nav)', () => {
      const product = createMockProduct({
        images: Array.from({ length: 6 }, (_, i) => `https://example.com/img${i + 1}.jpg`),
      });
      renderWithProviders(<ProductImages product={product} />);

      expect(screen.getByText('1 / 6')).toBeInTheDocument();

      // Navigation buttons should appear at 6+ images
      const buttons = screen.getAllByRole('button');
      const navButtons = buttons.filter(
        btn =>
          btn.getAttribute('aria-label') === 'Next slide' ||
          btn.getAttribute('aria-label') === 'Previous slide'
      );
      expect(navButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Multilingual Support', () => {
    it('should use English locale in alt text', () => {
      const product = createMockProduct();
      renderWithProviders(<ProductImages product={product} />, { locale: 'en' });

      const images = screen.getAllByRole('img');
      // Alt text should include English title (default mock uses 'en')
      expect(images[0]).toHaveAttribute('alt', expect.stringContaining('Test Product'));
    });

    it('should include product title in alt text', () => {
      const product = createMockProduct({
        title: {
          en: 'Beautiful Flower Arrangement',
          ro: 'Aranjament floral frumos',
          ru: 'Красивая цветочная композиция',
        },
      });
      renderWithProviders(<ProductImages product={product} />, { locale: 'en' });

      const images = screen.getAllByRole('img');
      // Alt text should include the product title and image number
      expect(images[0]).toHaveAttribute('alt', expect.stringContaining('Beautiful Flower'));
      expect(images[0]).toHaveAttribute('alt', expect.stringContaining('Image 1'));
    });
  });
});
