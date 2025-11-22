import { describe, it, expect, vi, beforeEach } from 'vitest';

// IMPORTANT: Mocks must be defined BEFORE imports
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/blog/blog');
vi.mock('@/server/procedures/image/generateUploadLinks');
vi.mock('@/server/procedures/image/deleteObjects/deleteMultipleFromBucket');

// Mock Next.js request context - required for NextAuth in tests
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
  cookies: vi.fn(() => ({ get: vi.fn(), set: vi.fn() })),
}));

// Mock NextAuth - must return a valid session for protected procedures
vi.mock('next-auth', async () => {
  const actual = await vi.importActual('next-auth');
  return {
    ...actual,
    getServerSession: vi.fn(() =>
      Promise.resolve({
        user: { email: 'admin@test.com', name: 'Admin' },
        expires: '2025-12-31',
      })
    ),
  };
});

// Now import after mocks are set up
import { createBlogProcedure } from '@/server/procedures/blog/addBlog';
import { updateBlogProcedure } from '@/server/procedures/blog/updateBlog';
import { deleteBlogProcedure } from '@/server/procedures/blog/deleteBlog';
import { getAllBlogsProcedure } from '@/server/procedures/blog/getAllBlogsProcedure';
import { getBlogProcedure } from '@/server/procedures/blog/getBlog';
import { getLimitedBlogsProcedure } from '@/server/procedures/blog/getLimitedBlogs';
import { Blog } from '@/models/blog/blog';
import connectMongo from '@/lib/connect-mongo';
import { createMockDocument } from '@/__tests__/helpers/testUtils';
import { createMockBlog, createMockBlogs } from '@/__tests__/helpers/mockFactories';
import { generateUploadLinks } from '@/server/procedures/image/generateUploadLinks';
import { deleteMultipleFromBucket } from '@/server/procedures/image/deleteObjects/deleteMultipleFromBucket';
import { BlogTags } from '@/lib/enums/BlogTags';

/**
 * Blog Procedures Test Suite
 *
 * Tests all blog-related tRPC procedures including:
 * - createBlog - Blog creation with image upload links
 * - updateBlog - Blog updates with optional image regeneration
 * - deleteBlog - Deletion with S3 cleanup
 * - getAllBlogs - List all blogs
 * - getBlog - Single blog retrieval
 * - getLimitedBlogs - Limited blog listing
 */

describe('Blog Procedures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connectMongo).mockResolvedValue(undefined as never);
  });

  describe('createBlog Procedure', () => {
    const validInput = {
      data: {
        title: { ro: 'Blog Nou', ru: 'Новый блог', en: 'New Blog' },
        tag: BlogTags.NEWS,
        sections: [
          {
            subtitle: { ro: 'Subtitlu 1', ru: 'Подзаголовок 1', en: 'Subtitle 1' },
            content: {
              ro: '<p>Conținut în română</p>',
              ru: '<p>Содержание на русском</p>',
              en: '<p>Content in English</p>',
            },
          },
        ],
        isImageNew: true,
        sectionsImagesCount: 2,
      },
    };

    it('should create blog with image upload links', async () => {
      const mockBlog = createMockDocument({
        ...createMockBlog(),
        _id: '607f1f77bcf86cd799439011',
      });

      vi.mocked(Blog.create).mockResolvedValue(mockBlog as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/upload-link-1',
      });

      const result = await createBlogProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'blog.createBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.blog).toBeDefined();
      expect(result.imagesLinks).toHaveLength(3); // 1 main + 2 section images
      expect(Blog.create).toHaveBeenCalledWith({
        title: validInput.data.title,
        tag: validInput.data.tag,
        sections: validInput.data.sections,
      });
      expect(generateUploadLinks).toHaveBeenCalledTimes(3);
    });

    it('should create blog without main image', async () => {
      const mockBlog = createMockDocument({
        ...createMockBlog(),
        _id: '607f1f77bcf86cd799439012',
      });

      const inputWithoutMainImage = {
        data: {
          ...validInput.data,
          isImageNew: false,
        },
      };

      vi.mocked(Blog.create).mockResolvedValue(mockBlog as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/upload-link',
      });

      const result = await createBlogProcedure({
        getRawInput: async () => inputWithoutMainImage,
        input: inputWithoutMainImage,
        ctx: { session: {}, user: {} },
        path: 'blog.createBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.imagesLinks).toHaveLength(2); // Only section images
      expect(generateUploadLinks).toHaveBeenCalledTimes(2);
    });

    it('should create blog with no section images', async () => {
      const mockBlog = createMockDocument({
        ...createMockBlog(),
        _id: '607f1f77bcf86cd799439013',
      });

      const inputWithNoSectionImages = {
        data: {
          ...validInput.data,
          sectionsImagesCount: 0,
        },
      };

      vi.mocked(Blog.create).mockResolvedValue(mockBlog as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/upload-link',
      });

      const result = await createBlogProcedure({
        getRawInput: async () => inputWithNoSectionImages,
        input: inputWithNoSectionImages,
        ctx: { session: {}, user: {} },
        path: 'blog.createBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.imagesLinks).toHaveLength(1); // Only main image
      expect(generateUploadLinks).toHaveBeenCalledTimes(1);
    });

    it('should handle creation errors', async () => {
      vi.mocked(Blog.create).mockRejectedValue(new Error('Database error'));

      const result = await createBlogProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'blog.createBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.blog).toBeNull();
      expect(result.imagesLinks).toEqual([]);
    });

    it('should validate multilingual fields', async () => {
      const mockBlog = createMockDocument({
        ...createMockBlog(),
        _id: '607f1f77bcf86cd799439014',
      });

      vi.mocked(Blog.create).mockResolvedValue(mockBlog as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/upload-link',
      });

      const result = await createBlogProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'blog.createBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(Blog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.objectContaining({
            ro: expect.any(String),
            ru: expect.any(String),
            en: expect.any(String),
          }),
        })
      );
    });

    it('should validate blog tag enum', async () => {
      const mockBlog = createMockDocument({
        ...createMockBlog({ tag: BlogTags.RECOMMENDATIONS }),
        _id: '607f1f77bcf86cd799439015',
      });

      const inputWithDifferentTag = {
        data: {
          ...validInput.data,
          tag: BlogTags.RECOMMENDATIONS,
        },
      };

      vi.mocked(Blog.create).mockResolvedValue(mockBlog as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/upload-link',
      });

      const result = await createBlogProcedure({
        getRawInput: async () => inputWithDifferentTag,
        input: inputWithDifferentTag,
        ctx: { session: {}, user: {} },
        path: 'blog.createBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(Blog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tag: BlogTags.RECOMMENDATIONS,
        })
      );
    });
  });

  describe('updateBlog Procedure', () => {
    const validUpdateInput = {
      id: '607f1f77bcf86cd799439011',
      data: {
        title: { ro: 'Blog Actualizat', ru: 'Обновленный блог', en: 'Updated Blog' },
        tag: BlogTags.EXPERIENCES,
        sections: [
          {
            subtitle: { ro: 'Nou Subtitlu', ru: 'Новый подзаголовок', en: 'New Subtitle' },
            content: {
              ro: '<p>Conținut actualizat</p>',
              ru: '<p>Обновленное содержание</p>',
              en: '<p>Updated content</p>',
            },
          },
        ],
        isImageNew: false,
        sectionsImagesCount: 0,
      },
    };

    it('should update blog successfully', async () => {
      const oldBlog = {
        _id: { toString: () => '607f1f77bcf86cd799439011' },
        sections: [],
      };

      const updatedBlog = createMockDocument({
        ...createMockBlog({
          _id: '607f1f77bcf86cd799439011',
          title: validUpdateInput.data.title,
          tag: BlogTags.EXPERIENCES,
        }),
      });

      vi.mocked(Blog.findById).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(oldBlog),
        }),
      } as never);

      vi.mocked(Blog.findByIdAndUpdate).mockResolvedValue(updatedBlog as never);

      const result = await updateBlogProcedure({
        getRawInput: async () => validUpdateInput,
        input: validUpdateInput,
        ctx: { session: {}, user: {} },
        path: 'blog.updateBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.blog).toBeDefined();
      expect(result.imagesLinks).toEqual([]);
      expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith(
        validUpdateInput.id,
        validUpdateInput.data,
        { new: true }
      );
    });

    it('should update blog with new main image', async () => {
      const oldBlog = {
        _id: { toString: () => '607f1f77bcf86cd799439011' },
        sections: [],
      };

      const inputWithNewImage = {
        ...validUpdateInput,
        data: {
          ...validUpdateInput.data,
          isImageNew: true,
        },
      };

      const updatedBlog = createMockDocument({
        ...createMockBlog({ _id: '607f1f77bcf86cd799439011' }),
      });

      vi.mocked(Blog.findById).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(oldBlog),
        }),
      } as never);

      vi.mocked(Blog.findByIdAndUpdate).mockResolvedValue(updatedBlog as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/new-upload-link',
      });

      const result = await updateBlogProcedure({
        getRawInput: async () => inputWithNewImage,
        input: inputWithNewImage,
        ctx: { session: {}, user: {} },
        path: 'blog.updateBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.imagesLinks).toHaveLength(1);
      expect(generateUploadLinks).toHaveBeenCalledTimes(1);
    });

    it('should update blog with new section images', async () => {
      const oldBlog = {
        _id: { toString: () => '607f1f77bcf86cd799439011' },
        sections: [],
      };

      const inputWithSectionImages = {
        ...validUpdateInput,
        data: {
          ...validUpdateInput.data,
          sectionsImagesCount: 3,
        },
      };

      const updatedBlog = createMockDocument({
        ...createMockBlog({ _id: '607f1f77bcf86cd799439011' }),
      });

      vi.mocked(Blog.findById).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(oldBlog),
        }),
      } as never);

      vi.mocked(Blog.findByIdAndUpdate).mockResolvedValue(updatedBlog as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/section-upload-link',
      });

      const result = await updateBlogProcedure({
        getRawInput: async () => inputWithSectionImages,
        input: inputWithSectionImages,
        ctx: { session: {}, user: {} },
        path: 'blog.updateBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.imagesLinks).toHaveLength(3);
      expect(generateUploadLinks).toHaveBeenCalledTimes(3);
    });

    it('should handle blog not found during lookup', async () => {
      vi.mocked(Blog.findById).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(null),
        }),
      } as never);

      const result = await updateBlogProcedure({
        getRawInput: async () => validUpdateInput,
        input: validUpdateInput,
        ctx: { session: {}, user: {} },
        path: 'blog.updateBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('This product does not exist');
      expect(result.blog).toBeNull();
    });

    it('should handle blog not found during update', async () => {
      const oldBlog = {
        _id: { toString: () => '607f1f77bcf86cd799439011' },
        sections: [],
      };

      vi.mocked(Blog.findById).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(oldBlog),
        }),
      } as never);

      vi.mocked(Blog.findByIdAndUpdate).mockResolvedValue(null as never);

      const result = await updateBlogProcedure({
        getRawInput: async () => validUpdateInput,
        input: validUpdateInput,
        ctx: { session: {}, user: {} },
        path: 'blog.updateBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('This blog does not exist');
      expect(result.blog).toBeNull();
    });

    it('should handle update errors', async () => {
      vi.mocked(Blog.findById).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockRejectedValue(new Error('Database error')),
        }),
      } as never);

      const result = await updateBlogProcedure({
        getRawInput: async () => validUpdateInput,
        input: validUpdateInput,
        ctx: { session: {}, user: {} },
        path: 'blog.updateBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.blog).toBeNull();
    });
  });

  describe('deleteBlog Procedure', () => {
    const validDeleteInput = {
      id: '607f1f77bcf86cd799439011',
    };

    it('should delete blog without images', async () => {
      const blogWithoutImages = createMockDocument({
        ...createMockBlog({
          _id: '607f1f77bcf86cd799439011',
          image: '', // Empty string - procedure still calls delete
        }),
        section_images: [],
      });

      vi.mocked(Blog.findByIdAndDelete).mockResolvedValue(blogWithoutImages as never);
      vi.mocked(deleteMultipleFromBucket).mockResolvedValue(undefined as never);

      const result = await deleteBlogProcedure({
        getRawInput: async () => validDeleteInput,
        input: validDeleteInput,
        ctx: { session: {}, user: {} },
        path: 'blog.deleteBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(Blog.findByIdAndDelete).toHaveBeenCalledWith(validDeleteInput.id);
      // Note: Empty array for section_images means deleteMultipleFromBucket is called with []
      expect(deleteMultipleFromBucket).toHaveBeenCalledWith([]);
    });

    it('should delete blog with main image', async () => {
      const blogWithImage = createMockDocument({
        ...createMockBlog({
          _id: '607f1f77bcf86cd799439011',
          image: 'https://d3rus23k068yq9.cloudfront.net/BLOG/607f/main.jpg',
        }),
        section_images: [],
      });

      vi.mocked(Blog.findByIdAndDelete).mockResolvedValue(blogWithImage as never);
      vi.mocked(deleteMultipleFromBucket).mockResolvedValue(undefined as never);

      const result = await deleteBlogProcedure({
        getRawInput: async () => validDeleteInput,
        input: validDeleteInput,
        ctx: { session: {}, user: {} },
        path: 'blog.deleteBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(deleteMultipleFromBucket).toHaveBeenCalledWith([blogWithImage.image]);
    });

    it('should delete blog with section images', async () => {
      const blogWithSectionImages = createMockDocument({
        ...createMockBlog({ _id: '607f1f77bcf86cd799439011' }),
        section_images: [
          { image: 'https://d3rus23k068yq9.cloudfront.net/BLOG/607f/section1.jpg' },
          { image: 'https://d3rus23k068yq9.cloudfront.net/BLOG/607f/section2.jpg' },
        ],
      });

      vi.mocked(Blog.findByIdAndDelete).mockResolvedValue(blogWithSectionImages as never);
      vi.mocked(deleteMultipleFromBucket).mockResolvedValue(undefined as never);

      const result = await deleteBlogProcedure({
        getRawInput: async () => validDeleteInput,
        input: validDeleteInput,
        ctx: { session: {}, user: {} },
        path: 'blog.deleteBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(deleteMultipleFromBucket).toHaveBeenCalledWith([
        'https://d3rus23k068yq9.cloudfront.net/BLOG/607f/section1.jpg',
        'https://d3rus23k068yq9.cloudfront.net/BLOG/607f/section2.jpg',
      ]);
    });

    it('should delete blog with both main and section images', async () => {
      const blogWithAllImages = createMockDocument({
        ...createMockBlog({
          _id: '607f1f77bcf86cd799439011',
          image: 'https://d3rus23k068yq9.cloudfront.net/BLOG/607f/main.jpg',
        }),
        section_images: [{ image: 'https://d3rus23k068yq9.cloudfront.net/BLOG/607f/section1.jpg' }],
      });

      vi.mocked(Blog.findByIdAndDelete).mockResolvedValue(blogWithAllImages as never);
      vi.mocked(deleteMultipleFromBucket).mockResolvedValue(undefined as never);

      const result = await deleteBlogProcedure({
        getRawInput: async () => validDeleteInput,
        input: validDeleteInput,
        ctx: { session: {}, user: {} },
        path: 'blog.deleteBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(deleteMultipleFromBucket).toHaveBeenCalledTimes(2);
      expect(deleteMultipleFromBucket).toHaveBeenNthCalledWith(1, [blogWithAllImages.image]);
      expect(deleteMultipleFromBucket).toHaveBeenNthCalledWith(2, [
        'https://d3rus23k068yq9.cloudfront.net/BLOG/607f/section1.jpg',
      ]);
    });

    it('should handle blog not found', async () => {
      vi.mocked(Blog.findByIdAndDelete).mockResolvedValue(null as never);

      const result = await deleteBlogProcedure({
        getRawInput: async () => validDeleteInput,
        input: validDeleteInput,
        ctx: { session: {}, user: {} },
        path: 'blog.deleteBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('This blog does not exist');
    });

    it('should handle deletion errors', async () => {
      vi.mocked(Blog.findByIdAndDelete).mockRejectedValue(new Error('Database error'));

      const result = await deleteBlogProcedure({
        getRawInput: async () => validDeleteInput,
        input: validDeleteInput,
        ctx: { session: {}, user: {} },
        path: 'blog.deleteBlog',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });

  describe('getAllBlogs Procedure', () => {
    it('should return all blogs sorted by date', async () => {
      const mockBlogs = createMockBlogs(5).map(blog =>
        createMockDocument({
          _id: blog._id,
          title: blog.title,
          image: blog.image,
          tag: blog.tag,
          date: blog.date,
        })
      );

      vi.mocked(Blog.find).mockReturnValue({
        sort: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue(mockBlogs),
          }),
        }),
      } as never);

      const result = await getAllBlogsProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'blog.getAllBlogs',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.blogs).toHaveLength(5);
      expect(Blog.find).toHaveBeenCalledWith();
      expect(result.blogs).toEqual(mockBlogs);
    });

    it('should return only optimized fields', async () => {
      const mockBlogs = [
        createMockDocument({
          _id: '607f1f77bcf86cd799439011',
          title: { ro: 'Blog 1', ru: 'Блог 1', en: 'Blog 1' },
          image: 'image1.jpg',
          tag: BlogTags.NEWS,
          date: new Date('2024-01-01'),
        }),
      ];

      vi.mocked(Blog.find).mockReturnValue({
        sort: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue(mockBlogs),
          }),
        }),
      } as never);

      const result = await getAllBlogsProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'blog.getAllBlogs',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.blogs?.[0]).toHaveProperty('_id');
      expect(result.blogs?.[0]).toHaveProperty('title');
      expect(result.blogs?.[0]).toHaveProperty('image');
      expect(result.blogs?.[0]).toHaveProperty('tag');
      expect(result.blogs?.[0]).toHaveProperty('date');
    });

    it('should handle empty blog list', async () => {
      vi.mocked(Blog.find).mockReturnValue({
        sort: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue(null),
          }),
        }),
      } as never);

      const result = await getAllBlogsProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'blog.getAllBlogs',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No blogs found');
      expect(result.blogs).toBeNull();
    });

    it('should handle fetch errors', async () => {
      vi.mocked(Blog.find).mockReturnValue({
        sort: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            lean: vi.fn().mockRejectedValue(new Error('Database error')),
          }),
        }),
      } as never);

      const result = await getAllBlogsProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'blog.getAllBlogs',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.blogs).toBeNull();
    });

    it('should sort blogs by date descending', async () => {
      const mockBlogs = [
        createMockDocument({ date: new Date('2024-03-01') }),
        createMockDocument({ date: new Date('2024-02-01') }),
        createMockDocument({ date: new Date('2024-01-01') }),
      ];

      const sortSpy = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(mockBlogs),
        }),
      });

      vi.mocked(Blog.find).mockReturnValue({
        sort: sortSpy,
      } as never);

      await getAllBlogsProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'blog.getAllBlogs',
        type: 'query',
      } as never);

      expect(sortSpy).toHaveBeenCalledWith({ date: -1 });
    });
  });

  describe('getBlog Procedure', () => {
    const validGetInput = {
      id: '607f1f77bcf86cd799439011',
    };

    it('should return single blog by id', async () => {
      const mockBlog = createMockDocument({
        ...createMockBlog({ _id: '607f1f77bcf86cd799439011' }),
      });

      vi.mocked(Blog.findById).mockResolvedValue(mockBlog as never);

      const result = await getBlogProcedure({
        getRawInput: async () => validGetInput,
        input: validGetInput,
        ctx: {},
        path: 'blog.getBlog',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.blog).toEqual(mockBlog);
      expect(Blog.findById).toHaveBeenCalledWith(validGetInput.id);
    });

    it('should return full blog with all fields', async () => {
      const mockBlog = createMockDocument({
        ...createMockBlog({
          _id: '607f1f77bcf86cd799439011',
          sections: [
            {
              subtitle: { ro: 'Sub 1', ru: 'Под 1', en: 'Sub 1' },
              content: {
                ro: '<p>Content 1</p>',
                ru: '<p>Содержание 1</p>',
                en: '<p>Content 1</p>',
              },
            },
            {
              subtitle: { ro: 'Sub 2', ru: 'Под 2', en: 'Sub 2' },
              content: {
                ro: '<p>Content 2</p>',
                ru: '<p>Содержание 2</p>',
                en: '<p>Content 2</p>',
              },
            },
          ],
          section_images: [{ image: 'image1.jpg' }, { image: 'image2.jpg' }],
        }),
      });

      vi.mocked(Blog.findById).mockResolvedValue(mockBlog as never);

      const result = await getBlogProcedure({
        getRawInput: async () => validGetInput,
        input: validGetInput,
        ctx: {},
        path: 'blog.getBlog',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.blog?.sections).toHaveLength(2);
      expect(result.blog?.section_images).toHaveLength(2);
    });

    it('should handle blog not found', async () => {
      vi.mocked(Blog.findById).mockResolvedValue(null as never);

      const result = await getBlogProcedure({
        getRawInput: async () => validGetInput,
        input: validGetInput,
        ctx: {},
        path: 'blog.getBlog',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('This blog does not exist');
      expect(result.blog).toBeNull();
    });

    it('should handle fetch errors', async () => {
      vi.mocked(Blog.findById).mockRejectedValue(new Error('Database error'));

      const result = await getBlogProcedure({
        getRawInput: async () => validGetInput,
        input: validGetInput,
        ctx: {},
        path: 'blog.getBlog',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.blog).toBeNull();
    });
  });

  describe('getLimitedBlogs Procedure', () => {
    it('should return limited number of blogs', async () => {
      const mockBlogs = createMockBlogs(10).map(blog => createMockDocument(blog));

      vi.mocked(Blog.find).mockReturnValue({
        limit: vi.fn().mockResolvedValue(mockBlogs.slice(0, 3)),
      } as never);

      const result = await getLimitedBlogsProcedure({
        getRawInput: async () => ({ limit: 3 }),
        input: { limit: 3 },
        ctx: {},
        path: 'blog.getLimitedBlogs',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.blogs).toHaveLength(3);
    });

    it('should respect limit parameter', async () => {
      const mockBlogs = createMockBlogs(10).map(blog => createMockDocument(blog));
      const limitSpy = vi.fn().mockResolvedValue(mockBlogs.slice(0, 5));

      vi.mocked(Blog.find).mockReturnValue({
        limit: limitSpy,
      } as never);

      await getLimitedBlogsProcedure({
        getRawInput: async () => ({ limit: 5 }),
        input: { limit: 5 },
        ctx: {},
        path: 'blog.getLimitedBlogs',
        type: 'query',
      } as never);

      expect(limitSpy).toHaveBeenCalledWith(5);
    });

    it('should handle limit of 1', async () => {
      const mockBlogs = [createMockDocument(createMockBlog())];

      vi.mocked(Blog.find).mockReturnValue({
        limit: vi.fn().mockResolvedValue(mockBlogs),
      } as never);

      const result = await getLimitedBlogsProcedure({
        getRawInput: async () => ({ limit: 1 }),
        input: { limit: 1 },
        ctx: {},
        path: 'blog.getLimitedBlogs',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.blogs).toHaveLength(1);
    });

    it('should handle no blogs found', async () => {
      vi.mocked(Blog.find).mockReturnValue({
        limit: vi.fn().mockResolvedValue(null),
      } as never);

      const result = await getLimitedBlogsProcedure({
        getRawInput: async () => ({ limit: 5 }),
        input: { limit: 5 },
        ctx: {},
        path: 'blog.getLimitedBlogs',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No blogs found');
      expect(result.blogs).toBeNull();
    });

    it('should handle fetch errors', async () => {
      vi.mocked(Blog.find).mockReturnValue({
        limit: vi.fn().mockRejectedValue(new Error('Database error')),
      } as never);

      const result = await getLimitedBlogsProcedure({
        getRawInput: async () => ({ limit: 5 }),
        input: { limit: 5 },
        ctx: {},
        path: 'blog.getLimitedBlogs',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
      expect(result.blogs).toBeNull();
    });

    it('should work with large limits', async () => {
      const mockBlogs = createMockBlogs(100).map(blog => createMockDocument(blog));

      vi.mocked(Blog.find).mockReturnValue({
        limit: vi.fn().mockResolvedValue(mockBlogs.slice(0, 50)),
      } as never);

      const result = await getLimitedBlogsProcedure({
        getRawInput: async () => ({ limit: 50 }),
        input: { limit: 50 },
        ctx: {},
        path: 'blog.getLimitedBlogs',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.blogs).toHaveLength(50);
    });
  });
});
