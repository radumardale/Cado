import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { renderWithProviders, createTestQueryClient } from '@/__tests__/helpers/componentTestUtils';
import Hero from '@/components/blog/Hero';
import { createMockBlogs } from '@/__tests__/helpers/mockFactories';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/components/blog/BlogGrid', () => ({
  default: ({ testId }: { testId?: string }) => (
    <div data-testid={testId || 'blog-grid'}>BlogGrid Component</div>
  ),
}));

describe('Hero', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render hero section with title', () => {
      renderWithProviders(<Hero />, { queryClient });

      expect(screen.getByText('BlogsPage.title')).toBeInTheDocument();
    });

    it('should render hero section with description', () => {
      renderWithProviders(<Hero />, { queryClient });

      expect(screen.getByText('BlogsPage.description')).toBeInTheDocument();
    });

    it('should render BlogGrid component', () => {
      renderWithProviders(<Hero />, { queryClient });

      expect(screen.getByTestId('blog-grid')).toBeInTheDocument();
      expect(screen.getByText('BlogGrid Component')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct title container layout classes', () => {
      const { container } = renderWithProviders(<Hero />, { queryClient });

      const titleContainer = container.querySelector(
        '.col-span-full.lg\\:col-start-5.lg\\:col-span-7'
      );
      expect(titleContainer).toBeInTheDocument();
    });

    it('should have 2xl breakpoint classes for title container', () => {
      const { container } = renderWithProviders(<Hero />, { queryClient });

      const titleContainer = container.querySelector(
        '.col-span-full.lg\\:col-start-5.lg\\:col-span-7'
      );
      expect(titleContainer).toBeInTheDocument();
    });

    it('should have correct spacing classes', () => {
      const { container } = renderWithProviders(<Hero />, { queryClient });

      const titleContainer = container.querySelector('.mt-16.relative');
      expect(titleContainer).toBeInTheDocument();
    });

    it('should center-align title text', () => {
      renderWithProviders(<Hero />, { queryClient });

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('text-center');
    });

    it('should center-align description text', () => {
      renderWithProviders(<Hero />, { queryClient });

      const description = screen.getByText('BlogsPage.description');
      expect(description).toHaveClass('text-center');
    });

    it('should have uppercase styling on title', () => {
      renderWithProviders(<Hero />, { queryClient });

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('uppercase');
    });

    it('should have font-semibold on title', () => {
      renderWithProviders(<Hero />, { queryClient });

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('font-semibold');
    });
  });

  describe('Translation Integration', () => {
    it('should call useTranslations with BlogsPage namespace', () => {
      renderWithProviders(<Hero />, { queryClient });

      expect(screen.getByText('BlogsPage.title')).toBeInTheDocument();
      expect(screen.getByText('BlogsPage.description')).toBeInTheDocument();
    });

    it('should render with custom translation messages', () => {
      const customMessages = {
        BlogsPage: {
          title: 'Custom Blog Title',
          description: 'Custom description text',
        },
      };

      renderWithProviders(<Hero />, { queryClient, messages: customMessages });

      expect(screen.getByText('BlogsPage.title')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render both hero content and BlogGrid', () => {
      renderWithProviders(<Hero />, { queryClient });

      expect(screen.getByText('BlogsPage.title')).toBeInTheDocument();
      expect(screen.getByText('BlogsPage.description')).toBeInTheDocument();
      expect(screen.getByTestId('blog-grid')).toBeInTheDocument();
    });

    it('should render as a fragment wrapper', () => {
      const { container } = renderWithProviders(<Hero />, { queryClient });

      const children = container.children;
      expect(children.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive typography classes on title', () => {
      renderWithProviders(<Hero />, { queryClient });

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('text-2xl');
      expect(title).toHaveClass('lg:text-3xl');
    });

    it('should have responsive line height on title', () => {
      renderWithProviders(<Hero />, { queryClient });

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('leading-7');
      expect(title).toHaveClass('lg:leading-11');
    });

    it('should have responsive typography on description', () => {
      renderWithProviders(<Hero />, { queryClient });

      const description = screen.getByText('BlogsPage.description');
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveClass('lg:text-base');
    });

    it('should have responsive spacing on description', () => {
      renderWithProviders(<Hero />, { queryClient });

      const description = screen.getByText('BlogsPage.description');
      expect(description).toHaveClass('mb-4');
      expect(description).toHaveClass('lg:mb-16');
    });

    it('should have responsive spacing on title', () => {
      renderWithProviders(<Hero />, { queryClient });

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('mb-8');
      expect(title).toHaveClass('lg:mb-6');
    });
  });

  describe('Semantic HTML', () => {
    it('should render title as h3 heading', () => {
      renderWithProviders(<Hero />, { queryClient });

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('BlogsPage.title');
    });

    it('should render description as paragraph', () => {
      const { container } = renderWithProviders(<Hero />, { queryClient });

      const description = container.querySelector('p');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent('BlogsPage.description');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderWithProviders(<Hero />, { queryClient });

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('should render all text content', () => {
      renderWithProviders(<Hero />, { queryClient });

      expect(document.body.textContent).toContain('BlogsPage.title');
      expect(document.body.textContent).toContain('BlogsPage.description');
    });
  });

  describe('BlogGrid Data Flow', () => {
    it('should allow BlogGrid to fetch its own data', () => {
      const mockBlogs = createMockBlogs(3);

      queryClient.setQueryData([['blog', 'getAllBlogs'], { input: undefined, type: 'query' }], {
        blogs: mockBlogs,
      });

      renderWithProviders(<Hero />, { queryClient });

      expect(screen.getByTestId('blog-grid')).toBeInTheDocument();
    });

    it('should render BlogGrid without passing props', () => {
      renderWithProviders(<Hero />, { queryClient });

      const blogGrid = screen.getByTestId('blog-grid');
      expect(blogGrid).toBeInTheDocument();
      expect(blogGrid).toHaveTextContent('BlogGrid Component');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rendering without query data', () => {
      renderWithProviders(<Hero />, { queryClient });

      expect(screen.getByText('BlogsPage.title')).toBeInTheDocument();
      expect(screen.getByTestId('blog-grid')).toBeInTheDocument();
    });

    it('should render consistently with different locales', () => {
      const { container: enContainer } = renderWithProviders(<Hero />, {
        queryClient,
        locale: 'en',
      });

      expect(enContainer.innerHTML).toBeTruthy();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();

      cleanup();

      const { container: roContainer } = renderWithProviders(<Hero />, {
        queryClient: createTestQueryClient(),
        locale: 'ro',
      });

      expect(roContainer.innerHTML).toBeTruthy();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    it('should maintain structure with empty translation keys', () => {
      const emptyMessages = {
        BlogsPage: {
          title: '',
          description: '',
        },
      };

      renderWithProviders(<Hero />, { queryClient, messages: emptyMessages });

      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByTestId('blog-grid')).toBeInTheDocument();
    });
  });

  describe('CSS Grid Layout', () => {
    it('should use CSS grid layout system', () => {
      const { container } = renderWithProviders(<Hero />, { queryClient });

      const gridContainer = container.querySelector('.col-span-full');
      expect(gridContainer).toBeInTheDocument();
    });

    it('should have proper grid column spans for different breakpoints', () => {
      const { container } = renderWithProviders(<Hero />, { queryClient });

      const titleContainer = container.querySelector(
        '.col-span-full.lg\\:col-span-7.\\32xl\\:col-span-5'
      );
      expect(titleContainer).toBeInTheDocument();
    });

    it('should have proper grid column starts for different breakpoints', () => {
      const { container } = renderWithProviders(<Hero />, { queryClient });

      const titleContainer = container.querySelector('.lg\\:col-start-5.\\32xl\\:col-start-6');
      expect(titleContainer).toBeInTheDocument();
    });
  });
});
