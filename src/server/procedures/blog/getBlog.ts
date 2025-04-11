import { publicProcedure } from "../../trpc";
import { Blog } from '@/models/blog/blog';
import { ActionResponse } from "@/lib/types/ActionResponse";
import connectMongo from "@/lib/connect-mongo";
import { BlogInterface } from "@/models/blog/types/BlogInterface";
import { getBlogRequestSchema } from "@/lib/validation/blog/getBlogRequest";

// Define the response interface for TypeScript type checking
export interface getBlogResponseInterface extends ActionResponse {
  blog: BlogInterface | null
}

export const getBlogProcedure = publicProcedure
  .input(getBlogRequestSchema)
  .query(async ({input}): Promise<getBlogResponseInterface> => {
    try {
      await connectMongo();
      
      const blog = await Blog.findById(input.id);
      
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
      console.error("Error fetching blog:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch blog",
        blog: null
      };
    }
  });