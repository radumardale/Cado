
import { ActionResponse } from '@/lib/types/ActionResponse';
import { deleteImageRequestSchema } from '@/lib/validation/image/deleteImageRequest';
import { protectedProcedure } from '@/server/trpc';
import { selectObjectToDelete } from './deleteObjects/selectObjectToDelete';
import connectMongo from '@/lib/connect-mongo';
import { deleteFromBucket } from './deleteObjects/deleteFromBucket';

export const deleteImageProcedure = protectedProcedure
  .input(deleteImageRequestSchema)
  .mutation(async ({ input }): Promise<ActionResponse> => {
    try {
      await connectMongo();

      await deleteFromBucket(input.image);

      const res = await selectObjectToDelete(input);

      return res;
    } catch (error) {
      console.error('Error deleting image:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete image',
      };
    }
  });
