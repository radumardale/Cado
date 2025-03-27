import { Product } from '@/models/product/product';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { addProductRequestSchema } from '@/lib/validation/product/addProductRequest';
import { ProductInterface } from '@/models/product/types/productInterface';
import { publicProcedure } from '@/server/trpc';
import connectMongo from '@/lib/connect-mongo';

export interface addProductResponseInterface extends ActionResponse {
  product: ProductInterface | null;
}

export const addProductProcedure = publicProcedure
  .input(addProductRequestSchema)
  .mutation(async ({ input }): Promise<addProductResponseInterface> => {
    try {
      await connectMongo();
      
      const product = await Product.create(input.data);

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