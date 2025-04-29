/* eslint-disable @typescript-eslint/no-explicit-any */

import { Product } from '@/models/product/product';
import { ProductInterface } from '@/models/product/types/productInterface';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { updateProductRequestSchema } from '@/lib/validation/product/updateProductRequest';
import { publicProcedure } from "@/server/trpc";
import connectMongo from '@/lib/connect-mongo';
import { appRouter } from '@/server';

// Define the response interface for TypeScript type checking
export interface updateProductResponseInterface extends ActionResponse {
  product: ProductInterface | null
}

export const updateProductProcedure = publicProcedure
  .input(updateProductRequestSchema)
  .mutation(async ({ input }): Promise<updateProductResponseInterface> => {
    try {
      
      await connectMongo();
      const caller = appRouter.createCaller({});

      const inputImages = input.data.images;
      const updatedImages = [];
      
      for (const image of inputImages) {
        if (image.startsWith("https")) {
          updatedImages.push(image);
        } else {
          const imageUrl = await caller.image.updateImage({
            id: input.id,
            image: image,
            destination: "PRODUCT"
          });

          updatedImages.push(imageUrl.imageUrl);
        }
      }

      const oldProduct = await Product.findById(input.id).select("images").lean() as any;

      if (!oldProduct) {
        return {
          success: false,
          error: "This product does not exist",
          product: null
        };
      }
      
      for (const image of oldProduct.images) {
        if (!updatedImages.includes(image)) {
          await caller.image.deleteImage({
            id: input.id,
            image: image,
            destination: "PRODUCT"
          })
        }
      }

      const product = await Product.findByIdAndUpdate(
        input.id, 
        {
          $set: {
            ...input.data,
            images: updatedImages
          }
        },
        { new: true }
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