/* eslint-disable  @typescript-eslint/no-explicit-any */

import connectMongo from '@/lib/connect-mongo';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { deleteHomeBannerRequestSchema } from '@/lib/validation/home/updateHomeBannerRequest';
import { HomeBanner } from '@/models/home_banner/HomeBanner';
import { protectedProcedure } from '@/server/trpc';
import { deleteFromBucket } from '../image/deleteObjects/deleteFromBucket';

export const deleteHomeBannerProcedure = protectedProcedure
  .input(deleteHomeBannerRequestSchema)
  .mutation(async ({ input }): Promise<ActionResponse> => {
    try {
      await connectMongo();

      const homeBanner = await HomeBanner.findByIdAndDelete(input.id);

      // Delete all language-specific images
      if (homeBanner && homeBanner.images) {
        const deletePromises = [];
        if (homeBanner.images.ro) deletePromises.push(deleteFromBucket(homeBanner.images.ro));
        if (homeBanner.images.ru) deletePromises.push(deleteFromBucket(homeBanner.images.ru));
        if (homeBanner.images.en) deletePromises.push(deleteFromBucket(homeBanner.images.en));

        await Promise.all(deletePromises);
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting home banner:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to delete home banner',
        success: false,
      };
    }
  });
