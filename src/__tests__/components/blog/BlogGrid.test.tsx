import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { renderWithProviders, createTestQueryClient } from '@/__tests__/helpers/componentTestUtils';
import BlogGrid from '@/components/blog/BlogGrid';
import { createMockBlogs, createMockBlog } from '@/__tests__/helpers/mockFactories';
import { BlogTags } from '@/lib/enums/BlogTags';

// Mock child components to isolate grid logic
vi.mock('@/components/blog/BlogCard', () => ({
  default: ({ title, date, tag, id }: { title: string; date: string; tag: string; id: string }) => (
    <div data-testid='blog-card' data-id={id} data-tag={tag}>
      <span data-testid='blog-title'>{title}</span>
      <span data-testid='blog-date'>{date}</span>
    </div>
  ),
}));

vi.mock('@/components/blog/BlogSkeleton', () => ({
  default: () => <div data-testid='blog-skeleton'>Loading...</div>,
}));

describe('BlogGrid', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Loading State', () => {
    it('should render 4 skeleton loaders when data is loading', () => {
      // No data in cache = loading state
      renderWithProviders(<BlogGrid />, { queryClient });

      const skeletons = screen.getAllByTestId('blog-skeleton');
      expect(skeletons).toHaveLength(4);
    });

    it('should render skeletons when data is null', () => {
      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: null,
      });

      renderWithProviders(<BlogGrid />, { queryClient });

      const skeletons = screen.getAllByTestId('blog-skeleton');
      expect(skeletons).toHaveLength(4);
    });

    it('should render skeletons when data is undefined', () => {
      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: undefined,
      });

      renderWithProviders(<BlogGrid />, { queryClient });

      const skeletons = screen.getAllByTestId('blog-skeleton');
      expect(skeletons).toHaveLength(4);
    });
  });

  describe('Loaded State', () => {
    it('should render blog cards when data is loaded', () => {
      const mockBlogs = createMockBlogs(3);

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<BlogGrid />, { queryClient, locale: 'en' });

      const cards = screen.getAllByTestId('blog-card');
      expect(cards).toHaveLength(3);
    });

    it('should pass correct data to BlogCard components', () => {
      const mockBlogs = createMockBlogs(2);

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<BlogGrid />, { queryClient, locale: 'en' });

      const cards = screen.getAllByTestId('blog-card');

      // Verify each card has correct ID and tag
      mockBlogs.forEach((blog, index) => {
        expect(cards[index]).toHaveAttribute('data-id', blog._id);
        expect(cards[index]).toHaveAttribute('data-tag', blog.tag);
      });
    });

    it('should render correct titles in English locale', () => {
      const mockBlogs = createMockBlogs(3);

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<BlogGrid />, { queryClient, locale: 'en' });

      mockBlogs.forEach(blog => {
        expect(screen.getByText(blog.title.en)).toBeInTheDocument();
      });
    });

    it('should render blog cards with Romanian locale', () => {
      const mockBlogs = createMockBlogs(3);

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<BlogGrid />, { queryClient, locale: 'ro' });

      // Verify cards are rendered (locale-specific title is passed to BlogCard)
      const cards = screen.getAllByTestId('blog-card');
      expect(cards).toHaveLength(3);
    });

    it('should render blog cards with Russian locale', () => {
      const mockBlogs = createMockBlogs(3);

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<BlogGrid />, { queryClient, locale: 'ru' });

      // Verify cards are rendered (locale-specific title is passed to BlogCard)
      const cards = screen.getAllByTestId('blog-card');
      expect(cards).toHaveLength(3);
    });
  });

  describe('Date Formatting', () => {
    it('should format dates with dots separator', () => {
      const mockBlogs = [
        createMockBlog({
          _id: 'blog-1',
          title: { ro: 'Blog Test', ru: 'Тест', en: 'Test Blog' },
          date: new Date('2024-03-15'),
        }),
      ];

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<BlogGrid />, { queryClient, locale: 'en' });

      // Date should be formatted with dots (toLocaleDateString replaces / with .)
      const dateElement = screen.getByTestId('blog-date');
      expect(dateElement.textContent).toContain('.');
      expect(dateElement.textContent).toContain('2024');
    });

    it('should pass formatted date to BlogCard', () => {
      const mockBlogs = [
        createMockBlog({
          _id: 'blog-2',
          title: { ro: 'Blog Test', ru: 'Тест', en: 'Test Blog' },
          date: new Date('2024-12-25'),
        }),
      ];

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<BlogGrid />, { queryClient, locale: 'en' });

      // Verify date is rendered
      const dateElement = screen.getByTestId('blog-date');
      expect(dateElement).toBeInTheDocument();
      expect(dateElement.textContent).toMatch(/\d{2}\.\d{2}\.\d{4}/);
    });
  });

  describe('Grid Layout', () => {
    it('should have correct grid container classes', () => {
      const mockBlogs = createMockBlogs(2);

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      const { container } = renderWithProviders(<BlogGrid />, { queryClient });

      const gridContainer = container.querySelector('.grid.grid-cols-13');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('col-span-full');
      expect(gridContainer).toHaveClass('lg:col-start-2');
      expect(gridContainer).toHaveClass('lg:col-span-13');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty blog array', () => {
      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: [],
      });

      renderWithProviders(<BlogGrid />, { queryClient });

      // Empty array renders no cards (maps over empty array)
      const cards = screen.queryAllByTestId('blog-card');
      expect(cards).toHaveLength(0);

      // Should not show skeletons when data exists (even if empty)
      const skeletons = screen.queryAllByTestId('blog-skeleton');
      expect(skeletons).toHaveLength(0);
    });

    it('should handle single blog post', () => {
      const mockBlogs = createMockBlogs(1);

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<BlogGrid />, { queryClient, locale: 'en' });

      const cards = screen.getAllByTestId('blog-card');
      expect(cards).toHaveLength(1);
      expect(screen.getByText(mockBlogs[0].title.en)).toBeInTheDocument();
    });

    it('should handle many blog posts', () => {
      const mockBlogs = createMockBlogs(10);

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<BlogGrid />, { queryClient, locale: 'en' });

      const cards = screen.getAllByTestId('blog-card');
      expect(cards).toHaveLength(10);
    });

    it('should handle different blog tags', () => {
      const mockBlogs = [
        createMockBlog({ _id: 'blog-1', tag: BlogTags.NEWS }),
        createMockBlog({ _id: 'blog-2', tag: BlogTags.RECOMMENDATIONS }),
        createMockBlog({ _id: 'blog-3', tag: BlogTags.EXPERIENCES }),
      ];

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<BlogGrid />, { queryClient, locale: 'en' });

      const cards = screen.getAllByTestId('blog-card');
      expect(cards[0]).toHaveAttribute('data-tag', BlogTags.NEWS);
      expect(cards[1]).toHaveAttribute('data-tag', BlogTags.RECOMMENDATIONS);
      expect(cards[2]).toHaveAttribute('data-tag', BlogTags.EXPERIENCES);
    });
  });
});
