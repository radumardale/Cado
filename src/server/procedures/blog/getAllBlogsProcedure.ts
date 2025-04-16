/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from '@/server/trpc';
import { Blog } from '@/models/blog/blog';
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from '@/lib/connect-mongo';

export interface getAllBlogsResponseInterface extends ActionResponse {
  blogs: any
}

export const getAllBlogsProcedure = publicProcedure
    .query(async (): Promise<getAllBlogsResponseInterface> => {
        try {
        await connectMongo();
        
        const blogs = await Blog.find().select("image _id tag title date").lean();

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