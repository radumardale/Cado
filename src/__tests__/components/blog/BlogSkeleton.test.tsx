import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BlogSkeleton from '@/components/blog/BlogSkeleton';

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className, ...props }: { className?: string }) => (
    <div data-testid='skeleton' className={className} {...props} />
  ),
}));

describe('BlogSkeleton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Core Rendering', () => {
    it('should render skeleton container with correct layout class', () => {
      const { container } = render(<BlogSkeleton />);

      const skeletonContainer = container.firstChild;
      expect(skeletonContainer).toBeInTheDocument();
      expect(skeletonContainer).toHaveClass('col-span-6');
    });

    it('should render all skeleton elements', () => {
      render(<BlogSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Image Skeleton', () => {
    it('should render image skeleton with correct aspect ratio', () => {
      render(<BlogSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const imageSkeleton = skeletons.find(s => s.classList.contains('aspect-[708/464]'));

      expect(imageSkeleton).toBeInTheDocument();
      expect(imageSkeleton).toHaveClass('w-full');
      expect(imageSkeleton).toHaveClass('rounded-2xl');
      expect(imageSkeleton).toHaveClass('mb-4');
    });
  });

  describe('Tag and Date Skeletons', () => {
    it('should render tag skeleton with correct size', () => {
      render(<BlogSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const tagSkeleton = skeletons.find(s => s.classList.contains('h-12'));

      expect(tagSkeleton).toBeInTheDocument();
      expect(tagSkeleton).toHaveClass('w-38');
      expect(tagSkeleton).toHaveClass('rounded-3xl');
    });

    it('should render date skeleton with correct size', () => {
      render(<BlogSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const dateSkeleton = skeletons.find(
        s => s.classList.contains('h-5') && s.classList.contains('w-20')
      );

      expect(dateSkeleton).toBeInTheDocument();
      expect(dateSkeleton).toHaveClass('rounded-3xl');
    });
  });

  describe('Title Skeleton', () => {
    it('should render title skeleton with correct dimensions', () => {
      render(<BlogSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      const titleSkeleton = skeletons.find(
        s => s.classList.contains('w-full') && s.classList.contains('h-7')
      );

      expect(titleSkeleton).toBeInTheDocument();
      expect(titleSkeleton).toHaveClass('rounded-3xl');
    });
  });

  describe('Layout Structure', () => {
    it('should have flex container for tag and date', () => {
      const { container } = render(<BlogSkeleton />);

      const flexContainer = container.querySelector('.flex.justify-between.items-center.mb-4');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should render skeletons in correct order: image, tag/date row, title', () => {
      const { container } = render(<BlogSkeleton />);

      const mainContainer = container.firstChild as HTMLElement;
      const children = Array.from(mainContainer.children);

      expect(children).toHaveLength(3);

      expect(children[0]).toHaveClass('aspect-[708/464]');

      expect(children[1]).toHaveClass('flex');
      expect(children[1]).toHaveClass('justify-between');

      expect(children[2]).toHaveClass('w-full');
      expect(children[2]).toHaveClass('h-7');
    });
  });

  describe('Accessibility', () => {
    it('should render without accessibility violations', () => {
      render(<BlogSkeleton />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
});
