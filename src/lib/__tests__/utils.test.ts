import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  getTagColor,
  checkboxUpdateUrlParams,
  updateCategoriesParams,
  resetUrlParams,
} from '@/lib/utils';
import { BlogTags } from '@/lib/enums/BlogTags';
import { Categories } from '@/lib/enums/Categories';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Core Utility Functions Tests
 *
 * Tests for utility functions in src/lib/utils.ts including:
 * - cn() - Class name merging with Tailwind
 * - getTagColor() - Blog tag color mapping
 * - URL parameter manipulation functions
 */

describe('cn() - Class Name Utility', () => {
  it('should merge single class name', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('should merge multiple class names', () => {
    expect(cn('text-red-500', 'bg-blue-500', 'p-4')).toContain('text-red-500');
    expect(cn('text-red-500', 'bg-blue-500', 'p-4')).toContain('bg-blue-500');
    expect(cn('text-red-500', 'bg-blue-500', 'p-4')).toContain('p-4');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class');

    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
    expect(result).not.toContain('disabled-class');
  });

  it('should handle undefined and null values', () => {
    expect(cn('text-red-500', undefined, null, 'bg-blue-500')).toContain('text-red-500');
    expect(cn('text-red-500', undefined, null, 'bg-blue-500')).toContain('bg-blue-500');
  });

  it('should resolve Tailwind conflicts correctly', () => {
    // twMerge should keep the last conflicting class
    const result = cn('p-2', 'p-4');
    expect(result).toBe('p-4');
  });

  it('should handle multiple Tailwind conflicts', () => {
    const result = cn('text-sm', 'text-lg', 'bg-red-500', 'bg-blue-500');
    expect(result).toContain('text-lg');
    expect(result).not.toContain('text-sm');
    expect(result).toContain('bg-blue-500');
    expect(result).not.toContain('bg-red-500');
  });

  it('should handle arrays of class names', () => {
    const result = cn(['text-red-500', 'bg-blue-500']);
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'text-red-500': true,
      'bg-blue-500': false,
      'p-4': true,
    });

    expect(result).toContain('text-red-500');
    expect(result).not.toContain('bg-blue-500');
    expect(result).toContain('p-4');
  });
});

describe('getTagColor() - Blog Tag Color Mapping', () => {
  it('should return correct color for NEWS tag', () => {
    expect(getTagColor(BlogTags.NEWS)).toBe('--blue1');
  });

  it('should return correct color for EXPERIENCES tag', () => {
    expect(getTagColor(BlogTags.EXPERIENCES)).toBe('--blue2');
  });

  it('should return correct color for RECOMMENDATIONS tag', () => {
    expect(getTagColor(BlogTags.RECOMMENDATIONS)).toBe('--blue3');
  });

  it('should handle all blog tags consistently', () => {
    const colors = [
      getTagColor(BlogTags.NEWS),
      getTagColor(BlogTags.EXPERIENCES),
      getTagColor(BlogTags.RECOMMENDATIONS),
    ];

    // All colors should be unique
    expect(new Set(colors).size).toBe(3);

    // All colors should start with --
    colors.forEach(color => {
      expect(color).toMatch(/^--blue\d/);
    });
  });
});

describe('URL Parameter Manipulation Functions', () => {
  let mockRouter: AppRouterInstance;
  let originalLocation: Location;

  beforeEach(() => {
    // Mock router
    mockRouter = {
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as AppRouterInstance;

    // Save original location
    originalLocation = window.location;

    // Mock window.location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).location = {
      ...originalLocation,
      pathname: '/test/path',
      search: '',
    };
  });

  afterEach(() => {
    // Restore original location
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).location = originalLocation;
    vi.clearAllMocks();
  });

  describe('checkboxUpdateUrlParams()', () => {
    it('should add single parameter to empty URL', () => {
      const searchParams = new URLSearchParams();

      checkboxUpdateUrlParams('filter', searchParams, mockRouter, ['value1']);

      expect(mockRouter.push).toHaveBeenCalledWith('/test/path?filter=value1', { scroll: false });
    });

    it('should add multiple parameters with same name', () => {
      const searchParams = new URLSearchParams();

      checkboxUpdateUrlParams('filter', searchParams, mockRouter, ['value1', 'value2', 'value3']);

      expect(mockRouter.push).toHaveBeenCalledWith(
        '/test/path?filter=value1&filter=value2&filter=value3',
        { scroll: false }
      );
    });

    it('should replace existing parameters', () => {
      const searchParams = new URLSearchParams('filter=old1&filter=old2');

      checkboxUpdateUrlParams('filter', searchParams, mockRouter, ['new1', 'new2']);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('filter=new1');
      expect(callArg).toContain('filter=new2');
      expect(callArg).not.toContain('old1');
      expect(callArg).not.toContain('old2');
    });

    it('should preserve other parameters', () => {
      const searchParams = new URLSearchParams('other=value&filter=old&another=param');

      checkboxUpdateUrlParams('filter', searchParams, mockRouter, ['new']);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('other=value');
      expect(callArg).toContain('another=param');
      expect(callArg).toContain('filter=new');
    });

    it('should handle empty values array by removing parameter', () => {
      const searchParams = new URLSearchParams('filter=value1&other=value2');

      checkboxUpdateUrlParams('filter', searchParams, mockRouter, []);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).not.toContain('filter');
      expect(callArg).toContain('other=value2');
    });

    it('should handle special characters in values', () => {
      const searchParams = new URLSearchParams();

      checkboxUpdateUrlParams('filter', searchParams, mockRouter, [
        'value with spaces',
        'value&special',
      ]);

      expect(mockRouter.push).toHaveBeenCalled();
      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('filter=');
    });

    it('should generate URL without query string when no params', () => {
      const searchParams = new URLSearchParams();

      checkboxUpdateUrlParams('filter', searchParams, mockRouter, []);

      expect(mockRouter.push).toHaveBeenCalledWith('/test/path', { scroll: false });
    });
  });

  describe('updateCategoriesParams()', () => {
    it('should add single category', () => {
      const searchParams = new URLSearchParams();

      updateCategoriesParams([Categories.FOR_HER], searchParams, mockRouter);

      expect(mockRouter.push).toHaveBeenCalledWith('/test/path?category=FOR_HER', {
        scroll: false,
      });
    });

    it('should add multiple categories', () => {
      const searchParams = new URLSearchParams();

      updateCategoriesParams(
        [Categories.FOR_HER, Categories.FOR_HIM, Categories.ACCESSORIES],
        searchParams,
        mockRouter
      );

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('category=FOR_HER');
      expect(callArg).toContain('category=FOR_HIM');
      expect(callArg).toContain('category=ACCESSORIES');
    });

    it('should replace existing categories', () => {
      const searchParams = new URLSearchParams('category=OLD_CAT&other=value');

      updateCategoriesParams([Categories.FOR_HER], searchParams, mockRouter);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('category=FOR_HER');
      expect(callArg).not.toContain('OLD_CAT');
      expect(callArg).toContain('other=value');
    });

    it('should preserve other parameters', () => {
      const searchParams = new URLSearchParams('sort=price&filter=active');

      updateCategoriesParams([Categories.FOR_HER], searchParams, mockRouter);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('sort=price');
      expect(callArg).toContain('filter=active');
    });

    it('should handle empty categories array', () => {
      const searchParams = new URLSearchParams('category=FOR_HER&other=value');

      updateCategoriesParams([], searchParams, mockRouter);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).not.toContain('category');
      expect(callArg).toContain('other=value');
    });

    it('should generate clean URL path without query when no params', () => {
      const searchParams = new URLSearchParams();

      updateCategoriesParams([], searchParams, mockRouter);

      expect(mockRouter.push).toHaveBeenCalledWith('/test/path', { scroll: false });
    });

    it('should handle all category types', () => {
      const allCategories = [
        Categories.FOR_HER,
        Categories.FOR_HIM,
        Categories.FOR_KIDS,
        Categories.ACCESSORIES,
        Categories.FLOWERS_AND_BALLOONS,
        Categories.GIFT_SET,
      ];

      const searchParams = new URLSearchParams();
      updateCategoriesParams(allCategories, searchParams, mockRouter);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      allCategories.forEach(cat => {
        expect(callArg).toContain(`category=${cat}`);
      });
    });
  });

  describe('resetUrlParams()', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).location = {
        ...originalLocation,
        pathname: '/test/path',
        search: '?filter=value&sort_by=price&category=FLOWERS&page=2',
      };
    });

    it('should remove all parameters except default keepParams', () => {
      resetUrlParams(mockRouter);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('sort_by=price');
      expect(callArg).not.toContain('filter');
      expect(callArg).not.toContain('category');
      expect(callArg).not.toContain('page');
    });

    it('should keep only specified parameters', () => {
      resetUrlParams(mockRouter, ['category', 'page']);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('category=FLOWERS');
      expect(callArg).toContain('page=2');
      expect(callArg).not.toContain('filter');
      expect(callArg).not.toContain('sort_by');
    });

    it('should handle empty keepParams array', () => {
      resetUrlParams(mockRouter, []);

      expect(mockRouter.push).toHaveBeenCalledWith('/test/path', { scroll: false });
    });

    it('should handle non-existent keepParams', () => {
      resetUrlParams(mockRouter, ['non_existent', 'also_not_there']);

      expect(mockRouter.push).toHaveBeenCalledWith('/test/path', { scroll: false });
    });

    it('should preserve multiple values for same parameter', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).location = {
        ...originalLocation,
        pathname: '/test/path',
        search: '?filter=val1&filter=val2&sort_by=price',
      };

      resetUrlParams(mockRouter, ['filter']);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('filter=val1');
      expect(callArg).toContain('filter=val2');
      expect(callArg).not.toContain('sort_by');
    });

    it('should handle URL with no query parameters', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).location = {
        ...originalLocation,
        pathname: '/test/path',
        search: '',
      };

      resetUrlParams(mockRouter, ['sort_by']);

      expect(mockRouter.push).toHaveBeenCalledWith('/test/path', { scroll: false });
    });

    it('should handle special characters in parameter values', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).location = {
        ...originalLocation,
        pathname: '/test/path',
        search: '?filter=value%20with%20spaces&keep=special%26chars',
      };

      resetUrlParams(mockRouter, ['keep']);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('keep=');
      expect(callArg).not.toContain('filter');
    });

    it('should always disable scroll when pushing', () => {
      resetUrlParams(mockRouter);

      expect(mockRouter.push).toHaveBeenCalledWith(expect.any(String), { scroll: false });
    });
  });

  describe('URL Manipulation - Edge Cases', () => {
    it('should handle very long parameter values', () => {
      const searchParams = new URLSearchParams();
      const longValue = 'a'.repeat(1000);

      checkboxUpdateUrlParams('filter', searchParams, mockRouter, [longValue]);

      expect(mockRouter.push).toHaveBeenCalled();
    });

    it('should handle Unicode characters in parameters', () => {
      const searchParams = new URLSearchParams();

      checkboxUpdateUrlParams('filter', searchParams, mockRouter, ['Прод укт', 'Флоры']);

      expect(mockRouter.push).toHaveBeenCalled();
    });

    it('should handle empty string values', () => {
      const searchParams = new URLSearchParams();

      checkboxUpdateUrlParams('filter', searchParams, mockRouter, ['', 'valid', '']);

      const pushMock = mockRouter.push as ReturnType<typeof vi.fn>;
      const callArg = pushMock.mock.calls[0][0];
      expect(callArg).toContain('filter=');
    });

    it('should handle multiple category values correctly', () => {
      const searchParams = new URLSearchParams();

      updateCategoriesParams(
        [Categories.FOR_HER, Categories.ACCESSORIES],
        searchParams,
        mockRouter
      );

      expect(mockRouter.push).toHaveBeenCalled();
    });
  });
});
