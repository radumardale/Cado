/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProductInterface } from '@/models/product/types/productInterface';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { publicProcedure } from "@/server/trpc";
import connectMongo from '@/lib/connect-mongo';
import { updateReccProductRequestSchema } from '@/lib/validation/reccProducts/updateReccProductRequestSchema';
import { ReccProduct } from '@/models/reccProduct/ReccProduct';

// Define the response interface for TypeScript type checking
export interface updateReccProductResponseInterface extends ActionResponse {
  product: ProductInterface | null;
  imagesLinks: string[];
}

export const updateReccProductProcedure = publicProcedure
  .input(updateReccProductRequestSchema)
  .mutation(async ({ input }): Promise<ActionResponse> => {
    try {
      
      await connectMongo();

      await ReccProduct.findOneAndUpdate(
        {
          product: input.replaceId
        },
        {
            $set: {
                product: input.productId
            }
        }, {new: true})

        return {
            success: true
        }

    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update product",
      };
    }
  });