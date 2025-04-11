import { Blog } from '@/models/blog/blog';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { updateBlogRequestSchema } from '@/lib/validation/blog/updateBlogRequest';
import { publicProcedure } from "@/server/trpc";
import connectMongo from '@/lib/connect-mongo';
import { BlogInterface } from '@/models/blog/types/BlogInterface';

// Define the response interface for TypeScript type checking
export interface updateBlogResponseInterface extends ActionResponse {
  blog: BlogInterface | null
}

export const updateBlogProcedure = publicProcedure
  .input(updateBlogRequestSchema)
  .mutation(async ({ input }): Promise<updateBlogResponseInterface> => {
    try {
      await connectMongo();

      const blog = await Blog.findByIdAndUpdate(
        input.id, 
        input.data,
        { new: true }
      );

      if (!blog) {
        return {
          success: false,
          error: "This blog does not exist",
          blog: null
        };
      }

      return {
        success: true,
        blog: blog
      };
    } catch (error) {
      console.error("Error updating blog:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update blog",
        blog: null
      };
    }
  });