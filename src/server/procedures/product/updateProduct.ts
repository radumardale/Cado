/* eslint-disable @typescript-eslint/no-explicit-any */

import { Product } from '@/models/product/product';
import { ProductInterface } from '@/models/product/types/productInterface';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { updateProductRequestSchema } from '@/lib/validation/product/updateProductRequest';
import { publicProcedure } from "@/server/trpc";
import connectMongo from '@/lib/connect-mongo';
import { DestinationEnum, generateUploadLinks } from '../image/generateUploadLinks';
import { revalidateServerPath } from '@/server/actions/revalidateServerPath';

// Define the response interface for TypeScript type checking
export interface updateProductResponseInterface extends ActionResponse {
  product: ProductInterface | null;
  imagesLinks: string[];
}

export const updateProductProcedure = publicProcedure
  .input(updateProductRequestSchema)
  .mutation(async ({ input }): Promise<updateProductResponseInterface> => {
    try {
      
      await connectMongo();

      const oldProduct = await Product.findById(input.id).select("images").lean() as any;

      const imagesLinks = [];
  
      for (let i = 0; i < input.data.imagesNumber; i++) {
          const imageUrl = await generateUploadLinks({
            id: oldProduct._id.toString(),
            destination: DestinationEnum.PRODUCT
          });
  
          imagesLinks.push(imageUrl.imageUrl);
      }

      if (!oldProduct) {
        return {
          success: false,
          error: "This product does not exist",
          product: null,
          imagesLinks: []
        };
      }

      const product = await Product.findByIdAndUpdate(
        input.id, 
        {
          $set: {
            ...input.data,
          }
        },
        { new: true }
      );

      if (!product) {
        return {
          success: false,
          error: "This product does not exist",
          imagesLinks: [],
          product: null
        };
      }

      revalidateServerPath(`/ro/catalog/produs/${product.custom_id}`);

      return {
        success: true,
        product: product,
        imagesLinks: imagesLinks,
      };
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update product",
        product: null,
        imagesLinks: []
      };
    }
  });