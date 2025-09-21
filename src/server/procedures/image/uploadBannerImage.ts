/* eslint-disable  @typescript-eslint/no-explicit-any */

import { protectedProcedure } from '../../trpc';
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from '@/lib/connect-mongo';
import { deleteFromBucket } from './deleteObjects/deleteFromBucket';
import { HomeBanner } from '@/models/home_banner/HomeBanner';
import { uploadBannerImagesRequestSchema } from '@/lib/validation/image/uploadBannerImageRequest';

interface uploadBannerImageResponse extends ActionResponse {
  images: {
    ro: string;
    ru: string;
    en: string;
  };
}

export const uploadBannerImageProcedure = protectedProcedure
  .input(uploadBannerImagesRequestSchema)
  .mutation(async ({ input }): Promise<uploadBannerImageResponse> => {
    try {
      await connectMongo();

      const newImageUrls = {
        ro: input.newImageKeys.ro
          ? `https://d3rus23k068yq9.cloudfront.net/${input.newImageKeys.ro}`
          : '',
        ru: input.newImageKeys.ru
          ? `https://d3rus23k068yq9.cloudfront.net/${input.newImageKeys.ru}`
          : '',
        en: input.newImageKeys.en
          ? `https://d3rus23k068yq9.cloudfront.net/${input.newImageKeys.en}`
          : '',
      };

      const homeBanner = await HomeBanner.findById(input.id);

      if (!homeBanner) {
        return {
          success: false,
          images: { ro: '', ru: '', en: '' },
          error: 'Banner not found',
        };
      }

      // Delete old images that are being replaced
      for (const [lang, newUrl] of Object.entries(newImageUrls)) {
        const oldImage = homeBanner.images[lang as keyof typeof homeBanner.images];
        if (oldImage && oldImage !== '' && oldImage !== newUrl && oldImage.startsWith('https://')) {
          try {
            await deleteFromBucket(oldImage);
          } catch (deleteError) {
            console.warn(`Failed to delete old ${lang} image:`, deleteError);
          }
        }
      }

      // Update only the languages that have new images
      const updateObj: any = {};
      if (input.newImageKeys.ro) updateObj['images.ro'] = newImageUrls.ro;
      if (input.newImageKeys.ru) updateObj['images.ru'] = newImageUrls.ru;
      if (input.newImageKeys.en) updateObj['images.en'] = newImageUrls.en;

      await HomeBanner.findByIdAndUpdate(input.id, { $set: updateObj });

      return {
        success: true,
        images: newImageUrls,
      };
    } catch (error: any) {
      return {
        success: false,
        images: { ro: '', ru: '', en: '' },
        error: error.message || 'Failed to upload images',
      };
    }
  });
