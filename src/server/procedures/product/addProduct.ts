import { Product } from '@/models/product/product';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { addProductRequestSchema } from '@/lib/validation/product/addProductRequest';
import { ProductInterface } from '@/models/product/types/productInterface';
import { publicProcedure } from '@/server/trpc';
import connectMongo from '@/lib/connect-mongo';
import { appRouter } from '@/server';

export interface addProductResponseInterface extends ActionResponse {
  product: ProductInterface | null;
}

export const addProductProcedure = publicProcedure
  .input(addProductRequestSchema)
  .mutation(async ({ input }): Promise<addProductResponseInterface> => {
    try {
      await connectMongo();

      // Create normalized_title field manually
      const normalizedTitle = {
        ro: input.data.title.ro
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase(),
        ru: input.data.title.ru
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase(),
        en: input.data.title.en
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
      };

      // Include normalized_title when creating product
      const product = await Product.create({
        ...input.data,
        normalized_title: normalizedTitle,
        images: []
      });
      
      const caller = appRouter.createCaller({});
      const images = [];
  
      for (const image of input.data.images) {
          const imageUrl = await caller.image.updateImage({
            id: product._id.toString(),
            image: image,
            destination: "PRODUCT"
          });
  
          images.push(imageUrl.imageUrl);
      }

      // Update images
      product.images = images;
      await product.save();

      return {
        success: true,
        product: product,
      };

    } catch (error) {
      console.error("Error creating product:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create product",
        product: null,
      };
    }
  });