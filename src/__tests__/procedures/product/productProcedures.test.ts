import { describe, it, expect, vi, beforeEach } from 'vitest';

// IMPORTANT: Mocks must be defined BEFORE imports
vi.mock('@/lib/connect-mongo');
vi.mock('@/models/product/product');
vi.mock('@/models/reccProduct/ReccProduct');
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
import { addProductProcedure } from '@/server/procedures/product/addProduct';
import { getProductProcedure } from '@/server/procedures/product/getProduct';
import { deleteProductProcedure } from '@/server/procedures/product/deleteProduct';
import { getAllProductsProcedure } from '@/server/procedures/product/getAllProducts';
import { updateProductProcedure } from '@/server/procedures/product/updateProduct';
import { getProductsProcedure } from '@/server/procedures/product/getProducts';
import { getAdminProductsProcedure } from '@/server/procedures/product/getAdminProducts';
import { getProductsByIdsProcedure } from '@/server/procedures/product/getProductsByIds';
import { getSimilarProducts } from '@/server/procedures/product/getSimilarProducts';
import { getMinMaxPriceProcedure } from '@/server/procedures/product/getMinMaxPrice';
import { Product } from '@/models/product/product';
import { ReccProduct } from '@/models/reccProduct/ReccProduct';
import connectMongo from '@/lib/connect-mongo';
import { createMockDocument } from '@/__tests__/helpers/testUtils';
import { createMockProduct, mockProduct } from '@/__tests__/helpers/mockFactories';
import { generateUploadLinks } from '@/server/procedures/image/generateUploadLinks';
import { deleteMultipleFromBucket } from '@/server/procedures/image/deleteObjects/deleteMultipleFromBucket';
import SortBy from '@/lib/enums/SortBy';

/**
 * Product Procedures Test Suite
 *
 * Tests all product-related tRPC procedures including:
 * - addProduct - Creation with S3 image link generation
 * - getProduct - Single product retrieval
 * - getAllProducts - List all products
 * - updateProduct - Product updates with optional image regeneration
 * - deleteProduct - Deletion with S3 cleanup
 */

describe('Product Procedures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(connectMongo).mockResolvedValue(undefined as never);
  });

  describe('addProduct Procedure', () => {
    const validInput = {
      data: {
        title: { ro: 'Produs Nou', ru: 'Новый продукт', en: 'New Product' },
        description: { ro: 'Descriere', ru: 'Описание', en: 'Description' },
        long_description: { ro: 'Lung', ru: 'Длинный', en: 'Long' },
        image_description: { ro: 'Imagine', ru: 'Изображение', en: 'Image' },
        price: 100,
        nr_of_items: 1,
        categories: ['FOR_HER'],
        ocasions: ['VALENTINES_DAY'],
        product_content: ['CHOCOLATE_BISCUITS_CANDY'],
        stock_availability: { state: 'IN_STOCK', stock: 10 },
        imagesNumber: 3,
        optional_info: {
          length: 10,
          width: 5,
          height: 8,
          weight: '200',
          material: { ro: 'Material', ru: 'Материал', en: 'Material' },
          color: { ro: 'Roșu', ru: 'Красный', en: 'Red' },
        },
      },
    };

    it('should create product with normalized title', async () => {
      const mockDoc = createMockDocument({
        ...mockProduct,
        _id: 'new-product-id',
      });

      vi.mocked(Product.create).mockResolvedValue(mockDoc as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/presigned-url',
      } as never);

      const result = await addProductProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'products.addProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(Product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: validInput.data.title,
          normalized_title: {
            ro: 'produs nou',
            ru: 'новыи продукт',
            en: 'new product',
          },
          images: [],
        })
      );
    });

    it('should generate correct number of image upload links', async () => {
      const mockDoc = createMockDocument({
        ...mockProduct,
        _id: 'product-id',
      });

      vi.mocked(Product.create).mockResolvedValue(mockDoc as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/presigned-url',
      } as never);

      const result = await addProductProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'products.addProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.imagesLinks).toHaveLength(3);
      expect(generateUploadLinks).toHaveBeenCalledTimes(3);
    });

    it('should call generateUploadLinks with correct destination', async () => {
      const mockDoc = createMockDocument({
        ...mockProduct,
        _id: 'product-id',
      });

      vi.mocked(Product.create).mockResolvedValue(mockDoc as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/presigned-url',
      } as never);

      await addProductProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'products.addProduct',
        type: 'mutation',
      } as never);

      expect(generateUploadLinks).toHaveBeenCalledWith({
        id: 'product-id',
        destination: 'PRODUCT',
      });
    });

    it('should handle creation errors gracefully', async () => {
      vi.mocked(Product.create).mockRejectedValue(new Error('Database error'));

      const result = await addProductProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'products.addProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Database error');
      expect(result.product).toBeNull();
      expect(result.imagesLinks).toEqual([]);
    });

    it('should normalize titles with diacritics correctly', async () => {
      const inputWithDiacritics = {
        data: {
          ...validInput.data,
          title: { ro: 'Ciocolată', ru: 'Шоколад', en: 'Chocolate' },
        },
      };

      const mockDoc = createMockDocument(mockProduct);
      vi.mocked(Product.create).mockResolvedValue(mockDoc as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/url',
      } as never);

      await addProductProcedure({
        getRawInput: async () => inputWithDiacritics,
        input: inputWithDiacritics,
        ctx: { session: {}, user: {} },
        path: 'products.addProduct',
        type: 'mutation',
      } as never);

      expect(Product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          normalized_title: {
            ro: 'ciocolata',
            ru: 'шоколад',
            en: 'chocolate',
          },
        })
      );
    });

    it('should connect to MongoDB before operations', async () => {
      const mockDoc = createMockDocument(mockProduct);
      vi.mocked(Product.create).mockResolvedValue(mockDoc as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/url',
      } as never);

      await addProductProcedure({
        getRawInput: async () => validInput,
        input: validInput,
        ctx: { session: {}, user: {} },
        path: 'products.addProduct',
        type: 'mutation',
      } as never);

      expect(connectMongo).toHaveBeenCalled();
    });
  });

  describe('getProduct Procedure', () => {
    it('should retrieve product by custom_id', async () => {
      vi.mocked(Product.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockProduct),
      } as never);

      const result = await getProductProcedure({
        getRawInput: async () => ({ id: 'PROD001' }),
        input: { id: 'PROD001' },
        ctx: {},
        path: 'products.getProduct',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.product).toBeDefined();
      expect(Product.findOne).toHaveBeenCalledWith({ custom_id: 'PROD001' });
    });

    it('should return error when product not found', async () => {
      vi.mocked(Product.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      } as never);

      const result = await getProductProcedure({
        getRawInput: async () => ({ id: 'NONEXISTENT' }),
        input: { id: 'NONEXISTENT' },
        ctx: {},
        path: 'products.getProduct',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('This product does not exist');
      expect(result.product).toBeNull();
    });

    it('should serialize product data correctly', async () => {
      const productWithDate = {
        ...mockProduct,
        createdAt: new Date('2024-01-01'),
      };

      vi.mocked(Product.findOne).mockReturnValue({
        lean: vi.fn().mockResolvedValue(productWithDate),
      } as never);

      const result = await getProductProcedure({
        getRawInput: async () => ({ id: 'PROD001' }),
        input: { id: 'PROD001' },
        ctx: {},
        path: 'products.getProduct',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.product).toBeDefined();
    });

    it('should handle database errors', async () => {
      vi.mocked(Product.findOne).mockReturnValue({
        lean: vi.fn().mockRejectedValue(new Error('DB Connection lost')),
      } as never);

      const result = await getProductProcedure({
        getRawInput: async () => ({ id: 'PROD001' }),
        input: { id: 'PROD001' },
        ctx: {},
        path: 'products.getProduct',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toContain('DB Connection lost');
    });

    it('should use lean() for performance', async () => {
      const leanMock = vi.fn().mockResolvedValue(mockProduct);
      vi.mocked(Product.findOne).mockReturnValue({
        lean: leanMock,
      } as never);

      await getProductProcedure({
        getRawInput: async () => ({ id: 'PROD001' }),
        input: { id: 'PROD001' },
        ctx: {},
        path: 'products.getProduct',
        type: 'query',
      } as never);

      expect(leanMock).toHaveBeenCalled();
    });
  });

  describe('getAllProducts Procedure', () => {
    it('should retrieve all products', async () => {
      const mockProducts = [createMockProduct(), createMockProduct({ custom_id: 'PROD002' })];

      vi.mocked(Product.find).mockResolvedValue(mockProducts as never);

      const result = await getAllProductsProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'products.getAllProducts',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.products).toHaveLength(2);
    });

    it('should return empty array when no products exist', async () => {
      vi.mocked(Product.find).mockResolvedValue([] as never);

      const result = await getAllProductsProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'products.getAllProducts',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.products).toEqual([]);
    });

    it('should handle database errors', async () => {
      vi.mocked(Product.find).mockRejectedValue(new Error('Query failed'));

      const result = await getAllProductsProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'products.getAllProducts',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Query failed');
      expect(result.products).toEqual([]);
    });

    it('should connect to MongoDB before fetching', async () => {
      vi.mocked(Product.find).mockResolvedValue([] as never);

      await getAllProductsProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'products.getAllProducts',
        type: 'query',
      } as never);

      expect(connectMongo).toHaveBeenCalled();
    });
  });

  describe('deleteProduct Procedure', () => {
    it('should delete product and cleanup S3 images', async () => {
      const productWithImages = {
        ...mockProduct,
        images: [
          'https://d3rus23k068yq9.cloudfront.net/PRODUCT/123/img1.jpg',
          'https://d3rus23k068yq9.cloudfront.net/PRODUCT/123/img2.jpg',
        ],
      };

      vi.mocked(Product.findByIdAndDelete).mockResolvedValue(productWithImages as never);
      vi.mocked(deleteMultipleFromBucket).mockResolvedValue(undefined as never);

      const result = await deleteProductProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: { session: {}, user: {} },
        path: 'products.deleteProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(deleteMultipleFromBucket).toHaveBeenCalledWith(productWithImages.images);
    });

    it('should return error when product not found', async () => {
      vi.mocked(Product.findByIdAndDelete).mockResolvedValue(null);

      const result = await deleteProductProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439099' }),
        input: { id: '507f1f77bcf86cd799439099' },
        ctx: { session: {}, user: {} },
        path: 'products.deleteProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('This product does not exist');
    });

    it('should not call S3 cleanup if product not found', async () => {
      vi.mocked(Product.findByIdAndDelete).mockResolvedValue(null);

      await deleteProductProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439099' }),
        input: { id: '507f1f77bcf86cd799439099' },
        ctx: { session: {}, user: {} },
        path: 'products.deleteProduct',
        type: 'mutation',
      } as never);

      expect(deleteMultipleFromBucket).not.toHaveBeenCalled();
    });

    it('should handle S3 deletion errors', async () => {
      const productWithImages = {
        ...mockProduct,
        images: ['https://d3rus23k068yq9.cloudfront.net/PRODUCT/123/img.jpg'],
      };

      vi.mocked(Product.findByIdAndDelete).mockResolvedValue(productWithImages as never);
      vi.mocked(deleteMultipleFromBucket).mockRejectedValue(new Error('S3 error'));

      const result = await deleteProductProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: { session: {}, user: {} },
        path: 'products.deleteProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toContain('S3 error');
    });

    it('should handle products with empty image arrays', async () => {
      const productNoImages = {
        ...mockProduct,
        images: [],
      };

      vi.mocked(Product.findByIdAndDelete).mockResolvedValue(productNoImages as never);
      vi.mocked(deleteMultipleFromBucket).mockResolvedValue(undefined as never);

      const result = await deleteProductProcedure({
        getRawInput: async () => ({ id: '507f1f77bcf86cd799439011' }),
        input: { id: '507f1f77bcf86cd799439011' },
        ctx: { session: {}, user: {} },
        path: 'products.deleteProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(deleteMultipleFromBucket).toHaveBeenCalledWith([]);
    });
  });

  describe('updateProduct Procedure', () => {
    const updateInput = {
      id: '507f1f77bcf86cd799439011',
      data: {
        title: { ro: 'Produs Actualizat', ru: 'Обновленный продукт', en: 'Updated Product' },
        description: { ro: 'Descriere nouă', ru: 'Новое описание', en: 'New description' },
        long_description: { ro: 'Lung', ru: 'Длинный', en: 'Long' },
        image_description: { ro: 'Imagine', ru: 'Изображение', en: 'Image' },
        price: 150,
        nr_of_items: 1,
        categories: ['FOR_HER'],
        ocasions: ['VALENTINES_DAY'],
        product_content: ['CHOCOLATE_BISCUITS_CANDY'],
        stock_availability: { state: 'IN_STOCK', stock: 15 },
        imagesNumber: 2,
        optional_info: {
          length: 10,
          width: 5,
          height: 8,
          weight: '200',
          material: { ro: 'Material', ru: 'Материал', en: 'Material' },
          color: { ro: 'Roșu', ru: 'Красный', en: 'Red' },
        },
      },
    };

    beforeEach(() => {
      // Mock the findById chain (select -> lean)
      const mockOldProduct = {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        images: ['old-image.jpg'],
      };

      vi.mocked(Product.findById).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(mockOldProduct),
        }),
      } as never);
    });

    it('should update product successfully', async () => {
      const updatedProduct = {
        ...mockProduct,
        ...updateInput.data,
      };

      vi.mocked(Product.findByIdAndUpdate).mockResolvedValue(updatedProduct as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/url',
      } as never);

      const result = await updateProductProcedure({
        getRawInput: async () => updateInput,
        input: updateInput,
        ctx: { session: {}, user: {} },
        path: 'products.updateProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        expect.objectContaining({
          $set: expect.objectContaining({
            title: updateInput.data.title,
          }),
        }),
        { new: true }
      );
    });

    it('should generate new image links when requested', async () => {
      vi.mocked(Product.findByIdAndUpdate).mockResolvedValue(mockProduct as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/url',
      } as never);

      const result = await updateProductProcedure({
        getRawInput: async () => updateInput,
        input: updateInput,
        ctx: { session: {}, user: {} },
        path: 'products.updateProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(true);
      expect(result.imagesLinks).toHaveLength(2);
      expect(generateUploadLinks).toHaveBeenCalledTimes(2);
    });

    it('should fetch old product before updating', async () => {
      vi.mocked(Product.findByIdAndUpdate).mockResolvedValue(mockProduct as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/url',
      } as never);

      await updateProductProcedure({
        getRawInput: async () => updateInput,
        input: updateInput,
        ctx: { session: {}, user: {} },
        path: 'products.updateProduct',
        type: 'mutation',
      } as never);

      expect(Product.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should handle update errors', async () => {
      vi.mocked(Product.findByIdAndUpdate).mockRejectedValue(new Error('Update failed'));

      const result = await updateProductProcedure({
        getRawInput: async () => updateInput,
        input: updateInput,
        ctx: { session: {}, user: {} },
        path: 'products.updateProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Update failed');
    });

    it('should use {new: true} option for findByIdAndUpdate', async () => {
      vi.mocked(Product.findByIdAndUpdate).mockResolvedValue(mockProduct as never);
      vi.mocked(generateUploadLinks).mockResolvedValue({
        success: true,
        imageUrl: 'https://s3.amazonaws.com/url',
      } as never);

      await updateProductProcedure({
        getRawInput: async () => updateInput,
        input: updateInput,
        ctx: { session: {}, user: {} },
        path: 'products.updateProduct',
        type: 'mutation',
      } as never);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        { new: true }
      );
    });

    it('should handle errors when product not found', async () => {
      vi.mocked(Product.findById).mockReturnValue({
        select: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(null),
        }),
      } as never);

      const result = await updateProductProcedure({
        getRawInput: async () => updateInput,
        input: updateInput,
        ctx: { session: {}, user: {} },
        path: 'products.updateProduct',
        type: 'mutation',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getProducts Procedure', () => {
    const mockAggregateResult = [
      {
        products: [
          createMockProduct(),
          createMockProduct({ custom_id: 'PROD002' }),
          createMockProduct({ custom_id: 'PROD003' }),
        ],
        totalCount: [{ count: 10 }],
        relevantCount: [{ count: 3 }],
      },
    ];

    beforeEach(() => {
      vi.mocked(ReccProduct.find).mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      } as never);
    });

    it('should fetch products with pagination', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue(mockAggregateResult as never);

      const result = await getProductsProcedure({
        getRawInput: async () => ({ title: null, category: null, limit: 3, cursor: 0 }),
        input: { title: null, category: null, limit: 3, cursor: 0 },
        ctx: {},
        path: 'products.getProducts',
        type: 'query',
      } as never);

      expect(result.products).toHaveLength(3);
      expect(result.productsCount).toBe(3);
      expect(result.totalCount).toBe(10);
    });

    it('should handle title search with normalization', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue(mockAggregateResult as never);

      await getProductsProcedure({
        getRawInput: async () => ({ title: 'Ciocolată+Roșu', category: null, limit: 10 }),
        input: { title: 'Ciocolată+Roșu', category: null, limit: 10 },
        ctx: {},
        path: 'products.getProducts',
        type: 'query',
      } as never);

      expect(Product.aggregate).toHaveBeenCalled();
      const aggregateCall = vi.mocked(Product.aggregate).mock.calls[0][0];
      expect(aggregateCall).toBeDefined();
    });

    it('should filter by price range', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue(mockAggregateResult as never);

      await getProductsProcedure({
        getRawInput: async () => ({
          title: null,
          category: null,
          price: { min: 50, max: 150 },
          limit: 10,
        }),
        input: { title: null, category: null, price: { min: 50, max: 150 }, limit: 10 },
        ctx: {},
        path: 'products.getProducts',
        type: 'query',
      } as never);

      const aggregateCall = vi.mocked(Product.aggregate).mock.calls[0][0];
      expect(aggregateCall[0]).toHaveProperty('$match');
      expect((aggregateCall[0] as { $match: unknown }).$match).toEqual({
        price: { $gte: 50, $lte: 150 },
      });
    });

    it('should sort by price ascending', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue(mockAggregateResult as never);

      await getProductsProcedure({
        getRawInput: async () => ({
          title: null,
          category: null,
          sortBy: SortBy.PRICE_ASC,
          limit: 10,
        }),
        input: { title: null, category: null, sortBy: SortBy.PRICE_ASC, limit: 10 },
        ctx: {},
        path: 'products.getProducts',
        type: 'query',
      } as never);

      expect(Product.aggregate).toHaveBeenCalled();
    });

    it('should calculate next cursor correctly', async () => {
      const mockResultWithMore = [
        {
          products: [
            createMockProduct(),
            createMockProduct({ custom_id: 'PROD002' }),
            createMockProduct({ custom_id: 'PROD003' }),
            createMockProduct({ custom_id: 'PROD004' }),
          ],
          totalCount: [{ count: 20 }],
          relevantCount: [{ count: 20 }],
        },
      ];

      vi.mocked(Product.aggregate).mockResolvedValue(mockResultWithMore as never);

      const result = await getProductsProcedure({
        getRawInput: async () => ({ title: null, category: null, limit: 3, cursor: 0 }),
        input: { title: null, category: null, limit: 3, cursor: 0 },
        ctx: {},
        path: 'products.getProducts',
        type: 'query',
      } as never);

      expect(result.nextCursor).toBe(3);
      expect(result.products).toHaveLength(3);
    });

    it('should return null cursor when no more pages', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue(mockAggregateResult as never);

      const result = await getProductsProcedure({
        getRawInput: async () => ({ title: null, category: null, limit: 10, cursor: 0 }),
        input: { title: null, category: null, limit: 10, cursor: 0 },
        ctx: {},
        path: 'products.getProducts',
        type: 'query',
      } as never);

      expect(result.nextCursor).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(Product.aggregate).mockRejectedValue(new Error('Aggregation failed'));

      await expect(
        getProductsProcedure({
          getRawInput: async () => ({ title: null, category: null, limit: 10 }),
          input: { title: null, category: null, limit: 10 },
          ctx: {},
          path: 'products.getProducts',
          type: 'query',
        } as never)
      ).rejects.toThrow('Failed to fetch products');
    });

    it('should handle recommended sorting', async () => {
      vi.mocked(ReccProduct.find).mockReturnValue({
        lean: vi.fn().mockResolvedValue([{ product: '507f1f77bcf86cd799439011' }]),
      } as never);
      vi.mocked(Product.aggregate).mockResolvedValue(mockAggregateResult as never);

      await getProductsProcedure({
        getRawInput: async () => ({
          title: null,
          category: null,
          sortBy: SortBy.RECOMMENDED,
          limit: 10,
        }),
        input: { title: null, category: null, sortBy: SortBy.RECOMMENDED, limit: 10 },
        ctx: {},
        path: 'products.getProducts',
        type: 'query',
      } as never);

      expect(ReccProduct.find).toHaveBeenCalled();
      expect(Product.aggregate).toHaveBeenCalled();
    });
  });

  describe('getAdminProducts Procedure', () => {
    const mockAdminAggregateResult = [
      {
        products: [createMockProduct(), createMockProduct({ custom_id: 'PROD002' })],
        totalCount: [{ count: 2 }],
      },
    ];

    it('should fetch admin products with pagination', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue(mockAdminAggregateResult as never);

      const result = await getAdminProductsProcedure({
        getRawInput: async () => ({ title: null, limit: 10, cursor: 0 }),
        input: { title: null, limit: 10, cursor: 0 },
        ctx: { session: {}, user: {} },
        path: 'products.getAdminProducts',
        type: 'query',
      } as never);

      expect(result.products).toHaveLength(2);
      expect(result.totalCount).toBe(2);
    });

    it('should search by normalized title', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue(mockAdminAggregateResult as never);

      await getAdminProductsProcedure({
        getRawInput: async () => ({ title: 'Test+Product', limit: 10 }),
        input: { title: 'Test+Product', limit: 10 },
        ctx: { session: {}, user: {} },
        path: 'products.getAdminProducts',
        type: 'query',
      } as never);

      const aggregateCall = vi.mocked(Product.aggregate).mock.calls[0][0];
      expect(aggregateCall[0]).toHaveProperty('$match');
    });

    it('should search by custom_id', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue(mockAdminAggregateResult as never);

      await getAdminProductsProcedure({
        getRawInput: async () => ({ title: 'PROD', limit: 10 }),
        input: { title: 'PROD', limit: 10 },
        ctx: { session: {}, user: {} },
        path: 'products.getAdminProducts',
        type: 'query',
      } as never);

      expect(Product.aggregate).toHaveBeenCalled();
    });

    it('should sort by price', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue(mockAdminAggregateResult as never);

      await getAdminProductsProcedure({
        getRawInput: async () => ({ title: null, sortBy: SortBy.PRICE_DESC, limit: 10 }),
        input: { title: null, sortBy: SortBy.PRICE_DESC, limit: 10 },
        ctx: { session: {}, user: {} },
        path: 'products.getAdminProducts',
        type: 'query',
      } as never);

      expect(Product.aggregate).toHaveBeenCalled();
    });

    it('should calculate pagination correctly', async () => {
      const mockWithMore = [
        {
          products: Array.from({ length: 11 }, (_, i) =>
            createMockProduct({ custom_id: `PROD${i}` })
          ),
          totalCount: [{ count: 11 }],
        },
      ];

      vi.mocked(Product.aggregate).mockResolvedValue(mockWithMore as never);

      const result = await getAdminProductsProcedure({
        getRawInput: async () => ({ title: null, limit: 10, cursor: 0 }),
        input: { title: null, limit: 10, cursor: 0 },
        ctx: { session: {}, user: {} },
        path: 'products.getAdminProducts',
        type: 'query',
      } as never);

      expect(result.products).toHaveLength(10);
      expect(result.nextCursor).toBe(10);
    });

    it('should handle errors', async () => {
      vi.mocked(Product.aggregate).mockRejectedValue(new Error('DB error'));

      await expect(
        getAdminProductsProcedure({
          getRawInput: async () => ({ title: null, limit: 10 }),
          input: { title: null, limit: 10 },
          ctx: { session: {}, user: {} },
          path: 'products.getAdminProducts',
          type: 'query',
        } as never)
      ).rejects.toThrow('Failed to fetch products');
    });
  });

  describe('getProductsByIds Procedure', () => {
    it('should fetch products by custom IDs', async () => {
      const mockProducts = [
        createMockProduct({ custom_id: 'PROD001' }),
        createMockProduct({ custom_id: 'PROD002' }),
      ];

      vi.mocked(Product.find).mockReturnValue({
        lean: vi.fn().mockResolvedValue(mockProducts),
      } as never);

      const result = await getProductsByIdsProcedure({
        getRawInput: async () => ({ ids: ['PROD001', 'PROD002'] }),
        input: { ids: ['PROD001', 'PROD002'] },
        ctx: {},
        path: 'products.getProductsByIds',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.products).toHaveLength(2);
      expect(Product.find).toHaveBeenCalledWith({
        custom_id: { $in: ['PROD001', 'PROD002'] },
      });
    });

    it('should handle empty array input', async () => {
      const result = await getProductsByIdsProcedure({
        getRawInput: async () => ({ ids: [] }),
        input: { ids: [] },
        ctx: {},
        path: 'products.getProductsByIds',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.products).toEqual([]);
      expect(Product.find).not.toHaveBeenCalled();
    });

    it('should return error when no products found', async () => {
      vi.mocked(Product.find).mockReturnValue({
        lean: vi.fn().mockResolvedValue([]),
      } as never);

      const result = await getProductsByIdsProcedure({
        getRawInput: async () => ({ ids: ['NONEXISTENT'] }),
        input: { ids: ['NONEXISTENT'] },
        ctx: {},
        path: 'products.getProductsByIds',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No products found with the provided IDs');
      expect(result.products).toEqual([]);
    });

    it('should handle database errors', async () => {
      vi.mocked(Product.find).mockReturnValue({
        lean: vi.fn().mockRejectedValue(new Error('Connection lost')),
      } as never);

      const result = await getProductsByIdsProcedure({
        getRawInput: async () => ({ ids: ['PROD001'] }),
        input: { ids: ['PROD001'] },
        ctx: {},
        path: 'products.getProductsByIds',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Connection lost');
    });

    it('should use lean for performance', async () => {
      const leanMock = vi.fn().mockResolvedValue([createMockProduct()]);
      vi.mocked(Product.find).mockReturnValue({ lean: leanMock } as never);

      await getProductsByIdsProcedure({
        getRawInput: async () => ({ ids: ['PROD001'] }),
        input: { ids: ['PROD001'] },
        ctx: {},
        path: 'products.getProductsByIds',
        type: 'query',
      } as never);

      expect(leanMock).toHaveBeenCalled();
    });
  });

  describe('getSimilarProducts Procedure', () => {
    it('should find similar products by category', async () => {
      const mockProducts = [
        { ...createMockProduct(), categories: ['FOR_HER'] },
        { ...createMockProduct({ custom_id: 'PROD002' }), categories: ['FOR_HER'] },
      ];

      vi.mocked(Product.aggregate).mockResolvedValue(mockProducts as never);

      const result = await getSimilarProducts({
        getRawInput: async () => ({ category: 'FOR_HER', productId: 'PROD001' }),
        input: { category: 'FOR_HER', productId: 'PROD001' },
        ctx: {},
        path: 'products.getSimilarProducts',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.products).toHaveLength(2);
    });

    it('should exclude current product from results', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue([createMockProduct()] as never);

      await getSimilarProducts({
        getRawInput: async () => ({ category: 'FOR_HER', productId: 'PROD001' }),
        input: { category: 'FOR_HER', productId: 'PROD001' },
        ctx: {},
        path: 'products.getSimilarProducts',
        type: 'query',
      } as never);

      const aggregateCall = vi.mocked(Product.aggregate).mock.calls[0][0];
      expect(aggregateCall[0]).toHaveProperty('$match');
      expect((aggregateCall[0] as { $match: unknown }).$match).toEqual({
        custom_id: { $ne: 'PROD001' },
      });
    });

    it('should limit results to 5 products', async () => {
      const mockProducts = Array.from({ length: 10 }, (_, i) => ({
        ...createMockProduct({ custom_id: `PROD${i}` }),
        categories: ['FOR_HER'],
      }));

      vi.mocked(Product.aggregate).mockResolvedValue(mockProducts as never);

      await getSimilarProducts({
        getRawInput: async () => ({ category: 'FOR_HER', productId: 'PROD001' }),
        input: { category: 'FOR_HER', productId: 'PROD001' },
        ctx: {},
        path: 'products.getSimilarProducts',
        type: 'query',
      } as never);

      const aggregateCall = vi.mocked(Product.aggregate).mock.calls[0][0];
      const limitStage = aggregateCall.find((stage: unknown) => '$limit' in (stage as object));
      expect(limitStage).toEqual({ $limit: 5 });
    });

    it('should fallback to any products when no similar found', async () => {
      const fallbackProducts = [createMockProduct()];

      vi.mocked(Product.aggregate).mockResolvedValue([] as never);
      vi.mocked(Product.find).mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue(fallbackProducts),
        }),
      } as never);

      const result = await getSimilarProducts({
        getRawInput: async () => ({ category: 'FOR_HER', productId: 'PROD001' }),
        input: { category: 'FOR_HER', productId: 'PROD001' },
        ctx: {},
        path: 'products.getSimilarProducts',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.products).toEqual(fallbackProducts);
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(Product.aggregate).mockRejectedValue(new Error('Aggregation failed'));

      const result = await getSimilarProducts({
        getRawInput: async () => ({ category: 'FOR_HER', productId: 'PROD001' }),
        input: { category: 'FOR_HER', productId: 'PROD001' },
        ctx: {},
        path: 'products.getSimilarProducts',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Aggregation failed');
      expect(result.products).toEqual([]);
    });

    it('should project out unnecessary fields', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue([createMockProduct()] as never);

      await getSimilarProducts({
        getRawInput: async () => ({ category: 'FOR_HER', productId: 'PROD001' }),
        input: { category: 'FOR_HER', productId: 'PROD001' },
        ctx: {},
        path: 'products.getSimilarProducts',
        type: 'query',
      } as never);

      const aggregateCall = vi.mocked(Product.aggregate).mock.calls[0][0];
      const projectStage = aggregateCall.find((stage: unknown) => '$project' in (stage as object));
      expect(projectStage).toEqual({
        $project: {
          description: 0,
          long_description: 0,
          set_description: 0,
        },
      });
    });
  });

  describe('getMinMaxPrice Procedure', () => {
    it('should return min and max prices', async () => {
      const mockPriceStats = [{ _id: null, minPrice: 50, maxPrice: 500 }];

      vi.mocked(Product.aggregate).mockResolvedValue(mockPriceStats as never);

      const result = await getMinMaxPriceProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'products.getMinMaxPrice',
        type: 'query',
      } as never);

      expect(result.success).toBe(true);
      expect(result.minPrice).toBe(50);
      expect(result.maxPrice).toBe(500);
    });

    it('should return error when no products exist', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue([] as never);

      const result = await getMinMaxPriceProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'products.getMinMaxPrice',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No products found');
      expect(result.minPrice).toBeNull();
      expect(result.maxPrice).toBeNull();
    });

    it('should handle database errors', async () => {
      vi.mocked(Product.aggregate).mockRejectedValue(new Error('DB connection failed'));

      const result = await getMinMaxPriceProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'products.getMinMaxPrice',
        type: 'query',
      } as never);

      expect(result.success).toBe(false);
      expect(result.error).toBe('DB connection failed');
      expect(result.minPrice).toBeNull();
      expect(result.maxPrice).toBeNull();
    });

    it('should use aggregation with $group', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue([
        { _id: null, minPrice: 10, maxPrice: 1000 },
      ] as never);

      await getMinMaxPriceProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'products.getMinMaxPrice',
        type: 'query',
      } as never);

      const aggregateCall = vi.mocked(Product.aggregate).mock.calls[0][0];
      expect(aggregateCall).toEqual([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
      ]);
    });

    it('should connect to MongoDB before querying', async () => {
      vi.mocked(Product.aggregate).mockResolvedValue([
        { _id: null, minPrice: 50, maxPrice: 500 },
      ] as never);

      await getMinMaxPriceProcedure({
        getRawInput: async () => undefined,
        input: undefined,
        ctx: {},
        path: 'products.getMinMaxPrice',
        type: 'query',
      } as never);

      expect(connectMongo).toHaveBeenCalled();
    });
  });
});
