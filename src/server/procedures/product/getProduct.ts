import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { Product } from '@/models/product/product';
import { ProductInterface } from '@/models/product/types/productInterface';
import { ActionResponse } from "@/lib/types/ActionResponse";
import connectMongo from "@/lib/connect-mongo";

// Define the input schema
export const getProductRequestSchema = z.object({
  id: z.string()
});

// Define the response interface for TypeScript type checking
export interface getProductResponseInterface extends ActionResponse {
  product: ProductInterface | null
}

export const getProductProcedure = publicProcedure
  .input(getProductRequestSchema)
  .query(async ({input}): Promise<getProductResponseInterface> => {
    try {

      await connectMongo();
      
      const product = await Product.findOne({custom_id: input.id});

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
      console.error("Error fetching product:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch product",
        product: null
      };
    }
  });