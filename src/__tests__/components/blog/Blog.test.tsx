import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import Blog from '@/components/blog/Blog';
import { renderWithProviders } from '@/__tests__/helpers/componentTestUtils';

// Mock BlogCarousel component
vi.mock('@/components/home/blog/BlogCarousel', () => ({
  default: () => <div data-testid='blog-carousel'>BlogCarousel Mock</div>,
}));

describe('Blog', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render blog container with correct styling', () => {
      renderWithProviders(<Blog />);

      const container = screen.getByTestId('blog-carousel').parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('col-span-full');
      expect(container).toHaveClass('grid');
      expect(container).toHaveClass('grid-cols-full');
      expect(container).toHaveClass('pt-6');
      expect(container).toHaveClass('border-t');
      expect(container).toHaveClass('border-black');
    });

    it('should render BlogCarousel component', () => {
      renderWithProviders(<Blog />);

      expect(screen.getByTestId('blog-carousel')).toBeInTheDocument();
    });
  });
});
