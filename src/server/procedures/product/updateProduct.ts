import { Product } from '@/models/product/product';
import { ProductInterface } from '@/models/product/types/productInterface';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { updateProductRequestSchema } from '@/lib/validation/product/updateProductRequest';
import { publicProcedure } from "@/server/trpc";
import connectMongo from '@/lib/connect-mongo';

// Define the response interface for TypeScript type checking
export interface updateProductResponseInterface extends ActionResponse {
  product: ProductInterface | null
}

export const updateProductProcedure = publicProcedure
  .input(updateProductRequestSchema)
  .mutation(async ({ input }): Promise<updateProductResponseInterface> => {
    try {
      
      await connectMongo();

      const product = await Product.findByIdAndUpdate(
        input.id, 
        input.data,
        { new: true } // Return the updated document
      );

      if (!product) {
        return {
          success: false,
          error: "This product does not exist",
          product: null
        };
      }

      return {
        success: true,
        product: product
      };
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update product",
        product: null
      };
    }
  });