import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { renderWithProviders, createTestQueryClient } from '@/__tests__/helpers/componentTestUtils';
import BlogSection from '@/components/blog/BlogSection';
import { createMockBlog } from '@/__tests__/helpers/mockFactories';
import { BlogTags } from '@/lib/enums/BlogTags';

const mockRedirect = vi.fn((url: string) => {
  throw new Error(`REDIRECT: ${url}`);
});

vi.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

const mockGetTagColor = vi.fn();
vi.mock('@/lib/utils', () => ({
  getTagColor: (tag: BlogTags) => mockGetTagColor(tag),
  cn: (...inputs: unknown[]) => inputs.filter(Boolean).join(' '),
}));

const mockUseLocale = vi.fn(() => 'en');

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => mockUseLocale(),
}));

vi.mock('@/components/blog/BlogSectionSkeleton', () => ({
  default: () => <div data-testid='blog-section-skeleton'>Loading blog...</div>,
}));

describe('BlogSection', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
    mockGetTagColor.mockReturnValue('--blue1');
    mockUseLocale.mockReturnValue('en');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Loading State', () => {
    it('should render BlogSectionSkeleton when data is loading', () => {
      renderWithProviders(<BlogSection id='blog-123' />, { queryClient });

      expect(screen.getByTestId('blog-section-skeleton')).toBeInTheDocument();
      expect(screen.getByText('Loading blog...')).toBeInTheDocument();
    });

    it('should not render blog content while loading', () => {
      renderWithProviders(<BlogSection id='blog-123' />, { queryClient });

      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    });
  });

  describe('Redirect Behavior', () => {
    it('should redirect to /blogs when blog is not found', () => {
      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'non-existent' }, type: 'query' }],
        { blog: null }
      );

      expect(() => {
        renderWithProviders(<BlogSection id='non-existent' />, { queryClient });
      }).toThrow('REDIRECT: /blogs');

      expect(mockRedirect).toHaveBeenCalledWith('/blogs');
    });

    it('should redirect when data exists but blog is undefined', () => {
      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'undefined-blog' }, type: 'query' }],
        { blog: undefined }
      );

      expect(() => {
        renderWithProviders(<BlogSection id='undefined-blog' />, { queryClient });
      }).toThrow('REDIRECT: /blogs');

      expect(mockRedirect).toHaveBeenCalledWith('/blogs');
    });
  });

  describe('Blog Content Rendering', () => {
    it('should render blog title in correct locale', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-1',
        title: {
          ro: 'Titlu Blog',
          ru: 'Заголовок блога',
          en: 'Blog Title',
        },
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-1' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-1' />, { queryClient, locale: 'en' });

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Blog Title');
    });

    it('should render blog with multilingual title structure', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-2',
        title: {
          ro: 'Titlu în Română',
          ru: 'Русский заголовок',
          en: 'English Title',
        },
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-2' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-2' />, { queryClient, locale: 'en' });

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('English Title');
    });
  });

  describe('Tag Display', () => {
    it('should render blog tag with translated text', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-4',
        tag: BlogTags.NEWS,
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-4' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-4' />, { queryClient });

      expect(screen.getByText(`HomePage.Blog.BlogTags.${BlogTags.NEWS}`)).toBeInTheDocument();
    });

    it('should call getTagColor with correct tag', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-5',
        tag: BlogTags.EXPERIENCES,
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-5' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-5' />, { queryClient });

      expect(mockGetTagColor).toHaveBeenCalledWith(BlogTags.EXPERIENCES);
    });

    it('should apply tag color from getTagColor', () => {
      const customColor = '--green2';
      mockGetTagColor.mockReturnValue(customColor);

      const mockBlog = createMockBlog({
        _id: 'blog-6',
        tag: BlogTags.RECOMMENDATIONS,
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-6' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-6' />, { queryClient });

      const tagElement = screen.getByText(`HomePage.Blog.BlogTags.${BlogTags.RECOMMENDATIONS}`);
      expect(tagElement).toHaveStyle({ backgroundColor: `var(${customColor})` });
    });
  });

  describe('Reading Information', () => {
    it('should display reading length in minutes', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-7',
        sections: [
          {
            subtitle: { ro: 'S1', ru: 'S1', en: 'Section 1' },
            content: { ro: '', ru: '', en: '' },
          },
          {
            subtitle: { ro: 'S2', ru: 'S2', en: 'Section 2' },
            content: { ro: '', ru: '', en: '' },
          },
          {
            subtitle: { ro: 'S3', ru: 'S3', en: 'Section 3' },
            content: { ro: '', ru: '', en: '' },
          },
        ],
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-7' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-7' />, { queryClient });

      expect(screen.getByText('3 MIN. READ')).toBeInTheDocument();
    });

    it('should format date correctly with dots', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-8',
        date: new Date('2024-03-15'),
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-8' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-8' />, { queryClient });

      const dateText = screen.getByText(/\d{2}\.\d{2}\.\d{4}/);
      expect(dateText).toBeInTheDocument();
      expect(dateText.textContent).toContain('.');
    });
  });

  describe('Main Image', () => {
    it('should render main blog image with correct src', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-9',
        image: 'https://d3rus23k068yq9.cloudfront.net/blog-image.jpg',
        title: { ro: 'Test', ru: 'Test', en: 'Test Blog' },
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-9' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-9' />, { queryClient, locale: 'en' });

      const image = screen.getByAltText('Test Blog');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://d3rus23k068yq9.cloudfront.net/blog-image.jpg');
    });

    it('should have correct aspect ratio class', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-10',
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-10' }, type: 'query' }],
        { blog: mockBlog }
      );

      const { container } = renderWithProviders(<BlogSection id='blog-10' />, { queryClient });

      const image = container.querySelector('.aspect-\\[824\\/544\\]');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Blog Sections', () => {
    it('should render all blog sections', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-11',
        sections: [
          {
            subtitle: { ro: 'Prima secțiune', ru: 'Первый раздел', en: 'First Section' },
            content: { ro: 'Conținut 1', ru: 'Содержание 1', en: 'Content 1' },
          },
          {
            subtitle: { ro: 'A doua secțiune', ru: 'Второй раздел', en: 'Second Section' },
            content: { ro: 'Conținut 2', ru: 'Содержание 2', en: 'Content 2' },
          },
        ],
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-11' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-11' />, { queryClient, locale: 'en' });

      expect(screen.getByRole('heading', { level: 2, name: 'First Section' })).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Second Section' })).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should render section subtitles in uppercase', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-12',
        sections: [
          {
            subtitle: { ro: 'subtitlu', ru: 'подзаголовок', en: 'subtitle' },
            content: { ro: 'content', ru: 'content', en: 'content' },
          },
        ],
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-12' }, type: 'query' }],
        { blog: mockBlog }
      );

      const { container } = renderWithProviders(<BlogSection id='blog-12' />, { queryClient });

      const subtitle = container.querySelector('.uppercase');
      expect(subtitle).toBeInTheDocument();
    });

    it('should render section content with whitespace preserved', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-13',
        sections: [
          {
            subtitle: { ro: 'Section', ru: 'Section', en: 'Section' },
            content: {
              ro: 'Line 1\nLine 2\nLine 3',
              ru: 'Line 1\nLine 2\nLine 3',
              en: 'Line 1\nLine 2\nLine 3',
            },
          },
        ],
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-13' }, type: 'query' }],
        { blog: mockBlog }
      );

      const { container } = renderWithProviders(<BlogSection id='blog-13' />, { queryClient });

      const contentElement = container.querySelector('.whitespace-pre-line');
      expect(contentElement).toBeInTheDocument();
      expect(contentElement?.textContent).toContain('Line 1');
    });
  });

  describe('Section Images', () => {
    it('should render section image when it exists', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-14',
        sections: [
          {
            subtitle: { ro: 'Section', ru: 'Section', en: 'Section with Image' },
            content: { ro: 'content', ru: 'content', en: 'content' },
          },
        ],
        section_images: [
          {
            image: 'https://d3rus23k068yq9.cloudfront.net/section-image.jpg',
            index: 0,
          },
        ],
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-14' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-14' />, { queryClient });

      const sectionImages = screen.getAllByAltText('blog');
      expect(sectionImages.length).toBeGreaterThan(0);

      const sectionImage = sectionImages.find(img =>
        img.getAttribute('src')?.includes('section-image.jpg')
      );
      expect(sectionImage).toBeInTheDocument();
    });

    it('should not render section image when it does not exist', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-15',
        sections: [
          {
            subtitle: { ro: 'Section', ru: 'Section', en: 'Section without Image' },
            content: { ro: 'content', ru: 'content', en: 'content' },
          },
        ],
        section_images: [],
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-15' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-15' />, { queryClient });

      const allImages = screen.getAllByRole('img');
      expect(allImages).toHaveLength(1);
    });

    it('should match section images by index', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-16',
        sections: [
          {
            subtitle: { ro: 'S1', ru: 'S1', en: 'Section 1' },
            content: { ro: 'c1', ru: 'c1', en: 'c1' },
          },
          {
            subtitle: { ro: 'S2', ru: 'S2', en: 'Section 2' },
            content: { ro: 'c2', ru: 'c2', en: 'c2' },
          },
        ],
        section_images: [
          {
            image: 'https://d3rus23k068yq9.cloudfront.net/image-section-1.jpg',
            index: 1,
          },
        ],
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-16' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-16' />, { queryClient });

      const sectionImages = screen.getAllByAltText('blog');

      const matchingImage = sectionImages.find(img =>
        img.getAttribute('src')?.includes('image-section-1.jpg')
      );
      expect(matchingImage).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct container layout classes', () => {
      const mockBlog = createMockBlog({ _id: 'blog-17' });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-17' }, type: 'query' }],
        { blog: mockBlog }
      );

      const { container } = renderWithProviders(<BlogSection id='blog-17' />, { queryClient });

      const mainContainer = container.querySelector(
        '.col-span-full.lg\\:col-span-7.lg\\:col-start-5'
      );
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('mt-16');
      expect(mainContainer).toHaveClass('mb-24');
      expect(mainContainer).toHaveClass('lg:mb-42');
    });
  });

  describe('Edge Cases', () => {
    it('should handle blog with no sections', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-18',
        sections: [],
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-18' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-18' />, { queryClient });

      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
      expect(screen.getByText('0 MIN. READ')).toBeInTheDocument();
    });

    it('should handle single section blog', () => {
      const mockBlog = createMockBlog({
        _id: 'blog-19',
        sections: [
          {
            subtitle: { ro: 'Singură', ru: 'Единственный', en: 'Only Section' },
            content: { ro: 'Conținut', ru: 'Содержание', en: 'Content' },
          },
        ],
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-19' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-19' />, { queryClient, locale: 'en' });

      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent('Only Section');
    });

    it('should handle very long blog content', () => {
      const longContent = 'A'.repeat(5000);
      const mockBlog = createMockBlog({
        _id: 'blog-20',
        sections: [
          {
            subtitle: { ro: 'Long', ru: 'Long', en: 'Long Section' },
            content: { ro: longContent, ru: longContent, en: longContent },
          },
        ],
      });

      queryClient.setQueryData(
        [['blog', 'getBlogById'], { input: { id: 'blog-20' }, type: 'query' }],
        { blog: mockBlog }
      );

      renderWithProviders(<BlogSection id='blog-20' />, { queryClient });

      expect(screen.getByText(longContent)).toBeInTheDocument();
    });
  });
});
