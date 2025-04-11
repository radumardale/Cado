import { Blog } from '@/models/blog/blog';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { publicProcedure } from '@/server/trpc';
import connectMongo from '@/lib/connect-mongo';
import { BlogInterface } from '@/models/blog/types/BlogInterface';
import { addBlogRequestSchema } from '@/lib/validation/blog/addBlogRequest';

export interface addBlogResponseInterface extends ActionResponse {
  blog: BlogInterface | null;
}

export const addBlogProcedure = publicProcedure
  .input(addBlogRequestSchema)
  .mutation(async ({ input }): Promise<addBlogResponseInterface> => {
    try {
      await connectMongo();
      
      const blog = await Blog.create(input.data);

      return {
        success: true,
        blog: blog,
      };
    } catch (error) {
      console.error("Error creating blog:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create blog",
        blog: null,
      };
    }
  });