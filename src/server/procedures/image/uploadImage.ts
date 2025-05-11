/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import { uploadImageRequestSchema } from '@/lib/validation/image/uploadImageRequest';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { selectObjectToUpdate } from './updateObjects/selectObjectToUpdate';
import connectMongo from "@/lib/connect-mongo";

export const uploadImageProcedure = publicProcedure
  .input(uploadImageRequestSchema)
  .mutation(async ({ input }): Promise<ActionResponse> => {
    try {
      await connectMongo();

      const newImageUrls = input.filenames.map(filename => `https://d3le09nbvee0zx.cloudfront.net/${filename}`)

      const res = await selectObjectToUpdate({
        destination: input.destination,
        id: input.id,
        filenames: newImageUrls
      });

      if (!res) {
        return {
          success: false,
          error: 'Failed to update object with new image'
        };
      }

      return {
        success: true,
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to upload image'
      };
    }
  });