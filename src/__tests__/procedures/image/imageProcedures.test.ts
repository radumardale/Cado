import { describe, it, expect, vi, beforeEach } from 'vitest';

// IMPORTANT: Mocks must be defined BEFORE imports
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/product/product');
vi.mock('@/models/blog/blog');
vi.mock('@/models/home_banner/HomeBanner');
vi.mock('@aws-sdk/client-s3');
vi.mock('@aws-sdk/s3-request-presigner');
vi.mock('@/server/procedures/image/deleteObjects/deleteFromBucket');
vi.mock('@/server/procedures/image/deleteObjects/selectObjectToDelete');

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
import {
  generateUploadLinks,
  DestinationEnum,
} from '@/server/procedures/image/generateUploadLinks';
import { UploadProductImagesProcedure } from '@/server/procedures/image/uploadProductImages';
import { UploadBlogImagesProcedure } from '@/server/procedures/image/uploadBlogImages';
import { uploadBannerImageProcedure } from '@/server/procedures/image/uploadBannerImage';
import { deleteImageProcedure } from '@/server/procedures/image/deleteImage';
import { Product } from '@/models/product/product';
import { Blog } from '@/models/blog/blog';
import { HomeBanner } from '@/models/home_banner/HomeBanner';
import connectMongo from '@/lib/connect-mongo';
import { createMockDocument } from '@/__tests__/helpers/testUtils';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { deleteFromBucket } from '@/server/procedures/image/deleteObjects/deleteFromBucket';
import { selectObjectToDelete } from '@/server/procedures/image/deleteObjects/selectObjectToDelete';

/**
 * Image Procedures Test Suite
 *
 * Tests all image-related tRPC procedures including:
 * - generateUploadLinks - S3 presigned URL generation
 * - uploadProductImages - Product image upload with S3 cleanup
 * - uploadBlogImages - Blog image upload with section images
 * - uploadBannerImage - Multilingual banner image upload
 * - deleteImage - Image deletion from S3 and database
 */

describe('Image Procedures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connectMongo).mockResolvedValue(undefined as never);

    // Setup AWS SDK mocks
    process.env.AWS_PUBLIC_ACCESS_KEY = 'test-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';

    // Mock S3Client
    vi.mocked(S3Client).mockImplementation(
      () =>
        ({
          send: vi.fn().mockResolvedValue({}),
        }) as never
    );

    // Mock getSignedUrl
    vi.mocked(getSignedUrl).mockResolvedValue('https://presigned-url.s3.amazonaws.com/test.jpg');
  });

  describe('generateUploadLinks', () => {
    it('should generate presigned URL for product upload', async () => {
      const result = await generateUploadLinks({
        id: 'test-product-id',
        destination: DestinationEnum.PRODUCT,
      });

      expect(result.success).toBe(true);
      expect(result.imageUrl).toContain('https://presigned-url');
      expect(connectMongo).toHaveBeenCalled();
      expect(getSignedUrl).toHaveBeenCalled();
    });

    it('should generate presigned URL for blog upload', async () => {
      const result = await generateUploadLinks({
        id: 'test-blog-id',
        destination: DestinationEnum.BLOG,
      });

      expect(result.success).toBe(true);
      expect(result.imageUrl).toBeTruthy();
    });

    it('should generate presigned URL for banner upload', async () => {
      const result = await generateUploadLinks({
        id: 'test-banner-id',
        destination: DestinationEnum.BANNER,
      });

      expect(result.success).toBe(true);
      expect(result.imageUrl).toBeTruthy();
    });

    it('should fail when AWS credentials are missing', async () => {
      delete process.env.AWS_PUBLIC_ACCESS_KEY;

      const result = await generateUploadLinks({
        id: 'test-id',
        destination: DestinationEnum.PRODUCT,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('AWS credentials not provided');
      expect(result.imageUrl).toBe('');
    });

    it('should create S3Client with correct region', async () => {
      await generateUploadLinks({
        id: 'test-id',
        destination: DestinationEnum.PRODUCT,
      });

      expect(S3Client).toHaveBeenCalledWith({
        region: 'eu-north-1',
        credentials: {
          accessKeyId: 'test-key',
          secretAccessKey: 'test-secret',
        },
      });
    });

    it('should handle S3 errors gracefully', async () => {
      vi.mocked(getSignedUrl).mockRejectedValue(new Error('S3 Error'));

      const result = await generateUploadLinks({
        id: 'test-id',
        destination: DestinationEnum.PRODUCT,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('S3 Error');
    });
  });

  describe('UploadProductImagesProcedure', () => {
    const mockProductDoc = createMockDocument({
      _id: '507f1f77bcf86cd799439011',
      custom_id: 'PROD001',
      title: { ro: 'Produs', ru: 'Продукт', en: 'Product' },
      images: ['https://d3rus23k068yq9.cloudfront.net/old-image.jpg'],
      save: vi.fn().mockResolvedValue(true),
    });

    it('should upload product images and update CDN URLs', async () => {
      vi.mocked(Product.findById).mockResolvedValue(mockProductDoc as never);

      const input = {
        id: '507f1f77bcf86cd799439011',
        filenames: ['PRODUCT/PROD001/abc123.png', 'PRODUCT/PROD001/def456.png'],
      };

      const result = await UploadProductImagesProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadProductImages',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.images).toHaveLength(2);
      expect(result.images[0]).toBe(
        'https://d3rus23k068yq9.cloudfront.net/PRODUCT/PROD001/abc123.png'
      );
      expect(mockProductDoc.save).toHaveBeenCalled();
    });

    it('should handle empty filenames', async () => {
      vi.mocked(Product.findById).mockResolvedValue(mockProductDoc as never);

      const input = {
        id: '507f1f77bcf86cd799439011',
        filenames: ['PRODUCT/PROD001/abc.png', '', 'PRODUCT/PROD001/def.png'],
      };

      const result = await UploadProductImagesProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadProductImages',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.images).toHaveLength(3);
      expect(result.images[1]).toBe(''); // Empty filename preserved
    });

    it('should fail when product not found', async () => {
      vi.mocked(Product.findById).mockResolvedValue(null);

      const input = {
        id: '507f1f77bcf86cd799439999', // Valid 24-char MongoDB ID
        filenames: ['test.png'],
      };

      const result = await UploadProductImagesProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadProductImages',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Product not found');
      expect(result.images).toEqual([]);
    });

    it('should handle database errors', async () => {
      vi.mocked(Product.findById).mockRejectedValue(new Error('Database error'));

      const input = {
        id: '507f1f77bcf86cd799439011',
        filenames: ['test.png'],
      };

      const result = await UploadProductImagesProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadProductImages',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });

    it('should delete old images when updating', async () => {
      const mockProduct = createMockDocument({
        _id: '507f1f77bcf86cd799439011',
        images: [
          'https://d3rus23k068yq9.cloudfront.net/old-image-1.jpg',
          'https://d3rus23k068yq9.cloudfront.net/old-image-2.jpg',
        ],
        save: vi.fn().mockResolvedValue(true),
      });

      vi.mocked(Product.findById).mockResolvedValue(mockProduct as never);

      const input = {
        id: '507f1f77bcf86cd799439011',
        filenames: ['PRODUCT/PROD001/new.png'], // Only one new image
      };

      await UploadProductImagesProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadProductImages',
        type: 'mutation',
      } as never);

      // Old images should be marked for deletion
      expect(mockProduct.images).toEqual([
        'https://d3rus23k068yq9.cloudfront.net/PRODUCT/PROD001/new.png',
      ]);
    });
  });

  describe('UploadBlogImagesProcedure', () => {
    const mockBlogDoc = createMockDocument({
      _id: '507f1f77bcf86cd799439012',
      custom_id: 'BLOG001',
      title: { ro: 'Blog', ru: 'Блог', en: 'Blog' },
      image: 'https://d3rus23k068yq9.cloudfront.net/old-main.jpg',
      section_images: [
        { index: 0, image: 'https://d3rus23k068yq9.cloudfront.net/old-section.jpg' },
      ],
      save: vi.fn().mockResolvedValue(true),
    });

    it('should upload blog section images', async () => {
      vi.mocked(Blog.findById).mockResolvedValue(mockBlogDoc as never);

      const input = {
        id: '507f1f77bcf86cd799439012',
        filenames: [
          { index: 0, image: 'BLOG/BLOG001/section-1.jpg' },
          { index: 1, image: 'BLOG/BLOG001/section-2.jpg' },
        ],
        newMainImageKey: null, // Required field, can be null
      };

      const result = await UploadBlogImagesProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadBlogImages',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.sectionImages).toHaveLength(2);
      expect(result.sectionImages[0].image).toBe(
        'https://d3rus23k068yq9.cloudfront.net/BLOG/BLOG001/section-1.jpg'
      );
      expect(mockBlogDoc.save).toHaveBeenCalled();
    });

    it('should update main image when provided', async () => {
      vi.mocked(Blog.findById).mockResolvedValue(mockBlogDoc as never);

      const input = {
        id: '507f1f77bcf86cd799439012',
        filenames: [{ index: 0, image: 'BLOG/BLOG001/section.jpg' }],
        newMainImageKey: 'BLOG/BLOG001/new-main.jpg',
      };

      const result = await UploadBlogImagesProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadBlogImages',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.mainImage).toBe(
        'https://d3rus23k068yq9.cloudfront.net/BLOG/BLOG001/new-main.jpg'
      );
    });

    it('should fail when blog not found', async () => {
      vi.mocked(Blog.findById).mockResolvedValue(null);

      const input = {
        id: '507f1f77bcf86cd799439999', // Valid 24-char MongoDB ID
        filenames: [{ index: 0, image: 'test.jpg' }],
        newMainImageKey: null,
      };

      const result = await UploadBlogImagesProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadBlogImages',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Blog not found');
      expect(result.sectionImages).toEqual([]);
    });

    it('should handle database errors', async () => {
      vi.mocked(Blog.findById).mockRejectedValue(new Error('Database error'));

      const input = {
        id: '507f1f77bcf86cd799439012',
        filenames: [{ index: 0, image: 'test.jpg' }],
        newMainImageKey: null,
      };

      const result = await UploadBlogImagesProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadBlogImages',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });

    it('should preserve section image order by index', async () => {
      vi.mocked(Blog.findById).mockResolvedValue(mockBlogDoc as never);

      const input = {
        id: '507f1f77bcf86cd799439012',
        filenames: [
          { index: 2, image: 'BLOG/BLOG001/section-2.jpg' },
          { index: 0, image: 'BLOG/BLOG001/section-0.jpg' },
          { index: 1, image: 'BLOG/BLOG001/section-1.jpg' },
        ],
        newMainImageKey: null,
      };

      const result = await UploadBlogImagesProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadBlogImages',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.sectionImages).toHaveLength(3);
      expect(result.sectionImages[0].index).toBe(2);
      expect(result.sectionImages[1].index).toBe(0);
      expect(result.sectionImages[2].index).toBe(1);
    });
  });

  describe('uploadBannerImageProcedure', () => {
    const mockBannerDoc = createMockDocument({
      _id: '507f1f77bcf86cd799439013',
      images: {
        ro: 'https://d3rus23k068yq9.cloudfront.net/old-ro.jpg',
        ru: 'https://d3rus23k068yq9.cloudfront.net/old-ru.jpg',
        en: 'https://d3rus23k068yq9.cloudfront.net/old-en.jpg',
      },
    });

    it('should upload banner images for all languages', async () => {
      vi.mocked(HomeBanner.findById).mockResolvedValue(mockBannerDoc as never);
      vi.mocked(HomeBanner.findByIdAndUpdate).mockResolvedValue(mockBannerDoc as never);

      const input = {
        id: '507f1f77bcf86cd799439013',
        newImageKeys: {
          ro: 'BANNER/banner-id/new-ro.jpg',
          ru: 'BANNER/banner-id/new-ru.jpg',
          en: 'BANNER/banner-id/new-en.jpg',
        },
      };

      const result = await uploadBannerImageProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadBannerImage',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.images.ro).toBe(
        'https://d3rus23k068yq9.cloudfront.net/BANNER/banner-id/new-ro.jpg'
      );
      expect(result.images.ru).toBe(
        'https://d3rus23k068yq9.cloudfront.net/BANNER/banner-id/new-ru.jpg'
      );
      expect(result.images.en).toBe(
        'https://d3rus23k068yq9.cloudfront.net/BANNER/banner-id/new-en.jpg'
      );
    });

    it('should update only specified language images', async () => {
      vi.mocked(HomeBanner.findById).mockResolvedValue(mockBannerDoc as never);
      vi.mocked(HomeBanner.findByIdAndUpdate).mockResolvedValue(mockBannerDoc as never);

      const input = {
        id: '507f1f77bcf86cd799439013',
        newImageKeys: {
          ro: 'BANNER/banner-id/new-ro.jpg',
          ru: '', // Empty - should not update
          en: '', // Empty - should not update
        },
      };

      const result = await uploadBannerImageProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadBannerImage',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.images.ro).toBe(
        'https://d3rus23k068yq9.cloudfront.net/BANNER/banner-id/new-ro.jpg'
      );
      expect(result.images.ru).toBe(''); // Empty preserved
      expect(result.images.en).toBe(''); // Empty preserved
    });

    it('should fail when banner not found', async () => {
      vi.mocked(HomeBanner.findById).mockResolvedValue(null);

      const input = {
        id: '507f1f77bcf86cd799439999', // Valid 24-char MongoDB ID
        newImageKeys: { ro: 'test.jpg', ru: 'test.jpg', en: 'test.jpg' },
      };

      const result = await uploadBannerImageProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadBannerImage',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Banner not found');
      expect(result.images).toEqual({ ro: '', ru: '', en: '' });
    });

    it('should handle database errors', async () => {
      vi.mocked(HomeBanner.findById).mockRejectedValue(new Error('Database error'));

      const input = {
        id: '507f1f77bcf86cd799439013',
        newImageKeys: { ro: 'test.jpg', ru: '', en: '' },
      };

      const result = await uploadBannerImageProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadBannerImage',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });

    it('should call HomeBanner.findByIdAndUpdate with correct update object', async () => {
      vi.mocked(HomeBanner.findById).mockResolvedValue(mockBannerDoc as never);
      vi.mocked(HomeBanner.findByIdAndUpdate).mockResolvedValue(mockBannerDoc as never);

      const input = {
        id: '507f1f77bcf86cd799439013',
        newImageKeys: {
          ro: 'BANNER/banner-id/ro.jpg',
          ru: '',
          en: 'BANNER/banner-id/en.jpg',
        },
      };

      await uploadBannerImageProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.uploadBannerImage',
        type: 'mutation',
      } as never);

      expect(HomeBanner.findByIdAndUpdate).toHaveBeenCalledWith('507f1f77bcf86cd799439013', {
        $set: {
          'images.ro': 'https://d3rus23k068yq9.cloudfront.net/BANNER/banner-id/ro.jpg',
          'images.en': 'https://d3rus23k068yq9.cloudfront.net/BANNER/banner-id/en.jpg',
        },
      });
    });
  });

  describe('deleteImageProcedure', () => {
    it('should delete product image from S3 and database', async () => {
      vi.mocked(deleteFromBucket).mockResolvedValue({ success: true } as never);
      vi.mocked(selectObjectToDelete).mockResolvedValue({ success: true } as never);

      const input = {
        image: 'https://d3rus23k068yq9.cloudfront.net/image-1.jpg',
        id: '507f1f77bcf86cd799439011',
        destination: 'PRODUCT' as const,
      };

      const result = await deleteImageProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.deleteImage',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(deleteFromBucket).toHaveBeenCalledWith(
        'https://d3rus23k068yq9.cloudfront.net/image-1.jpg'
      );
      expect(selectObjectToDelete).toHaveBeenCalledWith(input);
    });

    it('should delete blog image from S3 and database', async () => {
      vi.mocked(deleteFromBucket).mockResolvedValue({ success: true } as never);
      vi.mocked(selectObjectToDelete).mockResolvedValue({ success: true } as never);

      const input = {
        image: 'https://d3rus23k068yq9.cloudfront.net/section-1.jpg',
        id: '507f1f77bcf86cd799439012',
        destination: 'BLOG' as const,
      };

      const result = await deleteImageProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.deleteImage',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(deleteFromBucket).toHaveBeenCalledWith(
        'https://d3rus23k068yq9.cloudfront.net/section-1.jpg'
      );
      expect(selectObjectToDelete).toHaveBeenCalledWith(input);
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(deleteFromBucket).mockRejectedValue(new Error('S3 error'));

      const input = {
        image: 'https://d3rus23k068yq9.cloudfront.net/image.jpg',
        id: '507f1f77bcf86cd799439011',
        destination: 'PRODUCT' as const,
      };

      const result = await deleteImageProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.deleteImage',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('S3 error');
    });

    it('should fail when product not found for deletion', async () => {
      vi.mocked(deleteFromBucket).mockResolvedValue({ success: true } as never);
      vi.mocked(selectObjectToDelete).mockResolvedValue({
        success: false,
        error: 'Product not found',
      } as never);

      const input = {
        image: 'https://d3rus23k068yq9.cloudfront.net/image.jpg',
        id: '507f1f77bcf86cd799439999',
        destination: 'PRODUCT' as const,
      };

      const result = await deleteImageProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.deleteImage',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Product not found');
    });

    it('should fail when blog not found for deletion', async () => {
      vi.mocked(deleteFromBucket).mockResolvedValue({ success: true } as never);
      vi.mocked(selectObjectToDelete).mockResolvedValue({
        success: false,
        error: 'Blog not found',
      } as never);

      const input = {
        image: 'https://d3rus23k068yq9.cloudfront.net/image.jpg',
        id: '507f1f77bcf86cd799439999',
        destination: 'BLOG' as const,
      };

      const result = await deleteImageProcedure({
        getRawInput: async () => input,
        input,
        ctx: { session: {}, user: {} },
        path: 'image.deleteImage',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Blog not found');
    });
  });
});
