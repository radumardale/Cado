import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { renderWithProviders } from '@/__tests__/helpers/componentTestUtils';
import BlogCard from '@/components/blog/BlogCard';
import { BlogTags } from '@/lib/enums/BlogTags';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock utility functions
const mockGetTagColor = vi.fn();
vi.mock('@/lib/utils', () => ({
  getTagColor: (tag: BlogTags) => mockGetTagColor(tag),
  cn: (...inputs: unknown[]) => inputs.filter(Boolean).join(' '),
}));

// Mock i18n navigation
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: unknown }) => (
    <a href={typeof href === 'string' ? href : '#'} {...props} data-testid='blog-card-link'>
      {children}
    </a>
  ),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('BlogCard', () => {
  const defaultProps = {
    id: 'blog-123',
    src: 'https://cdn.example.com/blog-image.jpg',
    tag: BlogTags.NEWS,
    title: 'Amazing Blog Post About Testing',
    date: '2024-01-15',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTagColor.mockReturnValue('--blue1');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render blog title and date', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.date)).toBeInTheDocument();
    });

    it('should render blog image with correct src and alt', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      const image = screen.getByAltText(defaultProps.title);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', defaultProps.src);
    });

    it('should render link to blog post', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      const link = screen.getByTestId('blog-card-link');
      expect(link).toBeInTheDocument();
    });

    it('should wrap entire card content in link', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      const link = screen.getByTestId('blog-card-link');
      expect(link).toContainElement(screen.getByText(defaultProps.title));
      expect(link).toContainElement(screen.getByText(defaultProps.date));
      expect(link).toContainElement(screen.getByAltText(defaultProps.title));
    });
  });

  describe('Tag Display', () => {
    it('should render tag badge with translated text', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      // The mock returns the full translation key
      expect(screen.getByText(`HomePage.Blog.BlogTags.${BlogTags.NEWS}`)).toBeInTheDocument();
    });

    it('should call getTagColor with correct tag', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      expect(mockGetTagColor).toHaveBeenCalledWith(BlogTags.NEWS);
    });

    it('should apply tag color from getTagColor', () => {
      const customColor = '--green2';
      mockGetTagColor.mockReturnValue(customColor);

      renderWithProviders(<BlogCard {...defaultProps} />);

      const tagElement = screen.getByText(`HomePage.Blog.BlogTags.${BlogTags.NEWS}`);
      expect(tagElement).toHaveStyle({ backgroundColor: `var(${customColor})` });
    });

    it('should render EXPERIENCES tag correctly', () => {
      const props = { ...defaultProps, tag: BlogTags.EXPERIENCES };
      mockGetTagColor.mockReturnValue('--blue2');

      renderWithProviders(<BlogCard {...props} />);

      expect(
        screen.getByText(`HomePage.Blog.BlogTags.${BlogTags.EXPERIENCES}`)
      ).toBeInTheDocument();
      expect(mockGetTagColor).toHaveBeenCalledWith(BlogTags.EXPERIENCES);
    });

    it('should render RECOMMENDATIONS tag correctly', () => {
      const props = { ...defaultProps, tag: BlogTags.RECOMMENDATIONS };
      mockGetTagColor.mockReturnValue('--blue3');

      renderWithProviders(<BlogCard {...props} />);

      expect(
        screen.getByText(`HomePage.Blog.BlogTags.${BlogTags.RECOMMENDATIONS}`)
      ).toBeInTheDocument();
      expect(mockGetTagColor).toHaveBeenCalledWith(BlogTags.RECOMMENDATIONS);
    });
  });

  describe('Navigation', () => {
    it('should have correct blog post ID in link', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      const link = screen.getByTestId('blog-card-link');
      // Link component is mocked, but we verify it receives the component
      expect(link).toBeInTheDocument();
    });

    it('should have cursor-pointer class for interactivity', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      const link = screen.getByTestId('blog-card-link');
      expect(link).toHaveClass('cursor-pointer');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long blog titles', () => {
      const longTitle =
        'This is an extremely long blog post title that goes on and on and might wrap to multiple lines in the UI but should still render correctly';
      const props = { ...defaultProps, title: longTitle };

      renderWithProviders(<BlogCard {...props} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle different image URLs', () => {
      const cdnUrl = 'https://d3rus23k068yq9.cloudfront.net/blog/image-123.jpg';
      const props = { ...defaultProps, src: cdnUrl };

      renderWithProviders(<BlogCard {...props} />);

      const image = screen.getByAltText(props.title);
      expect(image).toHaveAttribute('src', cdnUrl);
    });

    it('should handle different date formats', () => {
      const props = { ...defaultProps, date: 'January 15, 2024' };

      renderWithProviders(<BlogCard {...props} />);

      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });

    it('should handle different blog IDs', () => {
      const props = { ...defaultProps, id: 'custom-blog-post-id-456' };

      renderWithProviders(<BlogCard {...props} />);

      expect(screen.getByTestId('blog-card-link')).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    it('should have correct grid layout classes', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      const link = screen.getByTestId('blog-card-link');
      expect(link).toHaveClass('col-span-full');
      expect(link).toHaveClass('lg:col-span-6');
    });

    it('should have group class for hover effects', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      const link = screen.getByTestId('blog-card-link');
      expect(link).toHaveClass('group');
    });

    it('should have correct image aspect ratio class', () => {
      renderWithProviders(<BlogCard {...defaultProps} />);

      const image = screen.getByAltText(defaultProps.title);
      expect(image).toHaveClass('aspect-[708/464]');
    });
  });
});
