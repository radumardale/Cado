import connectMongo from '@/lib/connect-mongo';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { Blog } from '@/models/blog/blog';
import { protectedProcedure } from '@/server/trpc';
import { deleteMultipleFromBucket } from '../image/deleteObjects/deleteMultipleFromBucket';
import { deleteBlogRequestSchema } from '@/lib/validation/blog/deleteBlogRequest';
import { SectionImagesInterface } from '@/models/blog/types/SectionImagesInterface';

export const deleteBlogProcedure = protectedProcedure
  .input(deleteBlogRequestSchema)
  .mutation(async ({ input }): Promise<ActionResponse> => {
    try {
      await connectMongo();

      const blog = await Blog.findByIdAndDelete(input.id);

      // If the blog has images, delete them from storage
      if (blog && blog.image) {
        await deleteMultipleFromBucket([blog.image]);
      }

      if (blog && blog.section_images) {
        await deleteMultipleFromBucket(
          blog.section_images.map((obj: SectionImagesInterface) => obj.image)
        );
      }

      if (!blog) {
        return {
          success: false,
          error: 'This blog does not exist',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting blog:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete blog',
      };
    }
  });
