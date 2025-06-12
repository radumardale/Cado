/* eslint-disable  @typescript-eslint/no-explicit-any */

import { protectedProcedure } from "../../trpc";
import { ActionResponse } from "@/lib/types/ActionResponse";
import connectMongo from "@/lib/connect-mongo";
import { deleteFromBucket } from "./deleteObjects/deleteFromBucket";
import { HomeBanner } from "@/models/home_banner/HomeBanner";
import { uploadBannerImagesRequestSchema } from "@/lib/validation/image/uploadBannerImageRequest";

interface uploadBannerImageResponse extends ActionResponse {
  image: string;
}

export const uploadBannerImageProcedure = protectedProcedure
  .input(uploadBannerImagesRequestSchema)
  .mutation(async ({ input }): Promise<uploadBannerImageResponse> => {
    try {
        await connectMongo();

        const newImageUrl = `https://d3rus23k068yq9.cloudfront.net/${input.newMainImageKey}`;

        const homeBanner = await HomeBanner.findById(input.id);
        
        if (!homeBanner) {
            return {
                success: false,
                image: "",
                error: 'Banner not found'
            };
        }
        
        if (homeBanner.image && 
            homeBanner.image !== "" && 
            homeBanner.image !== newImageUrl && 
            homeBanner.image.startsWith('https://')) {
            
            try {
                await deleteFromBucket(homeBanner.image);
            } catch (deleteError) {
                console.warn('Failed to delete old image:', deleteError);
            }
        }

        console.log('Setting new image URL:', newImageUrl);

        // Update the banner with the new image
        homeBanner.image = newImageUrl;
        await homeBanner.save();

        return {
            success: true,
            image: newImageUrl,
        };

    } catch (error: any) {
        console.error('Error uploading banner image:', error);
        return {
            success: false,
            image: "",
            error: error.message || 'Failed to upload image'
        };
    }
  });