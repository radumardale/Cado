import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BlogSectionSkeleton from '@/components/blog/BlogSectionSkeleton';

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className, ...props }: { className?: string }) => (
    <div data-testid='skeleton' className={className} {...props} />
  ),
}));

describe('BlogSectionSkeleton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render skeleton container with correct layout classes', () => {
      const { container } = render(<BlogSectionSkeleton />);

      const skeletonContainer = container.firstChild;
      expect(skeletonContainer).toBeInTheDocument();
      expect(skeletonContainer).toHaveClass('col-span-7');
      expect(skeletonContainer).toHaveClass('col-start-5');
      expect(skeletonContainer).toHaveClass('mt-16');
      expect(skeletonContainer).toHaveClass('mb-42');
    });

    it('should render all skeleton elements', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Title Skeleton', () => {
    it('should render title skeleton with correct dimensions', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const titleSkeleton = skeletons.find(
        s => s.classList.contains('h-12') && s.classList.contains('w-3/4')
      );

      expect(titleSkeleton).toBeInTheDocument();
      expect(titleSkeleton).toHaveClass('mb-6');
      expect(titleSkeleton).toHaveClass('rounded-md');
    });
  });

  describe('Tag and Reading Info Section', () => {
    it('should render tag skeleton', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const tagSkeleton = skeletons.find(
        s => s.classList.contains('h-12') && s.classList.contains('w-36')
      );

      expect(tagSkeleton).toBeInTheDocument();
      expect(tagSkeleton).toHaveClass('rounded-3xl');
    });

    it('should render reading time skeleton', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const readingTimeSkeleton = skeletons.find(
        s => s.classList.contains('h-6') && s.classList.contains('w-24')
      );

      expect(readingTimeSkeleton).toBeInTheDocument();
      expect(readingTimeSkeleton).toHaveClass('rounded-md');
    });

    it('should render date skeleton', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const dateSkeleton = skeletons.find(
        s => s.classList.contains('h-6') && s.classList.contains('w-32')
      );

      expect(dateSkeleton).toBeInTheDocument();
      expect(dateSkeleton).toHaveClass('rounded-md');
    });

    it('should have flex container for tag and info', () => {
      const { container } = render(<BlogSectionSkeleton />);

      const flexContainer = container.querySelector('.flex.justify-between.items-center.mb-12');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Main Image Skeleton', () => {
    it('should render main image skeleton with correct aspect ratio', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const imageSkeleton = skeletons.find(s => s.classList.contains('aspect-[824/544]'));

      expect(imageSkeleton).toBeInTheDocument();
      expect(imageSkeleton).toHaveClass('w-full');
      expect(imageSkeleton).toHaveClass('rounded-2xl');
      expect(imageSkeleton).toHaveClass('mb-4');
    });
  });

  describe('Content Section Skeletons', () => {
    it('should render first section subtitle skeleton', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const firstSubtitleSkeleton = skeletons.find(
        s => s.classList.contains('h-10') && s.classList.contains('w-1/2')
      );

      expect(firstSubtitleSkeleton).toBeInTheDocument();
      expect(firstSubtitleSkeleton).toHaveClass('my-8');
      expect(firstSubtitleSkeleton).toHaveClass('rounded-md');
    });

    it('should render first section content skeleton', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const firstContentSkeleton = skeletons.find(
        s => s.classList.contains('h-24') && s.classList.contains('w-full')
      );

      expect(firstContentSkeleton).toBeInTheDocument();
      expect(firstContentSkeleton).toHaveClass('mb-8');
    });

    it('should render second section subtitle skeleton', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const secondSubtitleSkeleton = skeletons.find(
        s => s.classList.contains('h-10') && s.classList.contains('w-2/3')
      );

      expect(secondSubtitleSkeleton).toBeInTheDocument();
      expect(secondSubtitleSkeleton).toHaveClass('my-8');
    });

    it('should render second section content skeleton', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const secondContentSkeleton = skeletons.find(
        s => s.classList.contains('h-36') && s.classList.contains('w-full')
      );

      expect(secondContentSkeleton).toBeInTheDocument();
      expect(secondContentSkeleton).toHaveClass('mb-8');
    });
  });

  describe('Layout Structure', () => {
    it('should render skeleton elements in correct order', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');

      expect(skeletons.length).toBeGreaterThanOrEqual(8);
    });

    it('should maintain correct spacing between sections', () => {
      const { container } = render(<BlogSectionSkeleton />);

      const skeletonContainer = container.firstChild as HTMLElement;
      expect(skeletonContainer).toHaveClass('mt-16');
      expect(skeletonContainer).toHaveClass('mb-42');
    });
  });

  describe('Accessibility', () => {
    it('should render without accessibility violations', () => {
      render(<BlogSectionSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});
