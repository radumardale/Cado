import { publicProcedure } from '@/server/trpc';
import { Blog } from '@/models/blog/blog';
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from '@/lib/connect-mongo';
import { BlogInterface } from '@/models/blog/types/BlogInterface';
import { getLimitedBlogsRequestSchema } from '@/lib/validation/blog/getLimitedBlogsRequest';

export interface getLimitedBlogsResponseInterface extends ActionResponse {
  blogs: BlogInterface[] | null
}

export const getLimitedBlogsProcedure = publicProcedure
    .input(getLimitedBlogsRequestSchema)
    .query(async ({input}): Promise<getLimitedBlogsResponseInterface> => {
        try {
        await connectMongo();
        
        const blogs = await Blog.find().limit(input.limit);

        if (!blogs) {
            return {
            success: false,
            error: "No blogs found",
            blogs: null
            };
        }

        return {
            success: true,
            blogs: blogs
        };
        } catch (error) {
        console.error("Error fetching blogs:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch blogs",
            blogs: null
        };
        }
    });