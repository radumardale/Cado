import connectMongo from '@/lib/connect-mongo';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { deleteProductRequestSchema } from '@/lib/validation/product/deleteProductRequest';
import { Product } from '@/models/product/product';
import { publicProcedure } from '@/server/trpc';
import { deleteMultipleFromBucket } from '../image/deleteObjects/deleteMultipleFromBucket';

export const deleteProductProcedure = publicProcedure
  .input(deleteProductRequestSchema)
  .mutation(async ({ input }): Promise<ActionResponse> => {
    try {
      
        await connectMongo();
        
        const product = await Product.findByIdAndDelete(input.id);
        await deleteMultipleFromBucket(product.images);

      if (!product) {
        return {
          success: false,
          error: "This product does not exist",
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete product",
      };
    }
  });