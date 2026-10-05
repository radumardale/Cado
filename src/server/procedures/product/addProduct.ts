import { Product } from '@/models/product/product';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { addProductRequestSchema } from '@/lib/validation/product/addProductRequest';
import { ProductInterface } from '@/models/product/types/productInterface';
import { protectedProcedure } from '@/server/trpc';
import connectMongo from '@/lib/connect-mongo';
import { DestinationEnum, generateUploadLinks } from '../image/generateUploadLinks';
import { mapMultilingualString } from '@/lib/utils/multilingual';
import { stripDiacritics } from '@/lib/utils/text';

export interface addProductResponseInterface extends ActionResponse {
  product: ProductInterface | null;
  imagesLinks: string[];
}

export const addProductProcedure = protectedProcedure
  .input(addProductRequestSchema)
  .mutation(async ({ input }): Promise<addProductResponseInterface> => {
    try {
      await connectMongo();

      // Removes diacritics and converts to lowercase for search optimization
      const normalizedTitle = mapMultilingualString(input.data.title, stripDiacritics);

      // Include normalized_title when creating product
      const product = await Product.create({
        ...input.data,
        normalized_title: normalizedTitle,
        images: [],
      });

      const imagesLinks = [];

      for (let i = 0; i < input.data.imagesNumber; i++) {
        const imageUrl = await generateUploadLinks({
          id: product._id.toString(),
          destination: DestinationEnum.PRODUCT,
        });

        imagesLinks.push(imageUrl.imageUrl);
      }

      // Update images
      // product.images = images;
      // await product.save();

      return {
        success: true,
        imagesLinks: imagesLinks,
        product: product,
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create product',
        product: null,
        imagesLinks: [],
      };
    }
  });
