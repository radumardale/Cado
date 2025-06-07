/* eslint-disable  @typescript-eslint/no-explicit-any */

import { protectedProcedure } from "@/server/trpc";
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from "@/lib/connect-mongo";
import { deleteFromBucket } from "./deleteObjects/deleteFromBucket";
import { uploadProductImageRequestSchema } from "@/lib/validation/image/uploadProductImagesRequest";
import { Product } from "@/models/product/product";

interface UploadProdcutImagesResponse extends ActionResponse {
  images: string[];
}

export const UploadProductImagesProcedure = protectedProcedure
  .input(uploadProductImageRequestSchema)
  .mutation(async ({ input }): Promise<UploadProdcutImagesResponse> => {
    try {
    await connectMongo();

    const newImageUrls = input.filenames.map(filename => filename !== "" ? `https://d3le09nbvee0zx.cloudfront.net/${filename}` : "")

    const product = await Product.findById(input.id);
    
    if (!product) {
      return {
        success: false,
        images: [],
        error: 'Product not found'
      };
    }
    
    for (const image of product.images) {
      if (!newImageUrls.includes(image)) {
        await deleteFromBucket(image);
      }
    }

    product.images = newImageUrls;
    await product.save();

    return {
        success: true,
        images: newImageUrls,
      };

    } catch (error: any) {
      return {
        success: false,
        images: [],
        error: error.message || 'Failed to upload image'
      };
    }
  });