/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Blog } from '@/models/blog/blog';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { updateBlogRequestSchema } from '@/lib/validation/blog/updateBlogRequest';
import { publicProcedure } from "@/server/trpc";
import connectMongo from '@/lib/connect-mongo';
import { BlogInterface } from '@/models/blog/types/BlogInterface';
import { DestinationEnum, generateUploadLinks } from '../image/generateUploadLinks';

// Define the response interface for TypeScript type checking
export interface updateBlogResponseInterface extends ActionResponse {
  blog: BlogInterface | null,
  imagesLinks: string[];
}

export const updateBlogProcedure = publicProcedure
  .input(updateBlogRequestSchema)
  .mutation(async ({ input }): Promise<updateBlogResponseInterface> => {
    try {
      await connectMongo();

      const oldBlog = await Blog.findById(input.id).select("_id sections").lean() as any;

      const imagesLinks = [];

      if (input.data.isImageNew) {
        const imageUrl = await generateUploadLinks({
          id: oldBlog._id.toString(),
          destination: DestinationEnum.BLOG
        });

        imagesLinks.push(imageUrl.imageUrl);
      }

      for (let i = 0; i < input.data.sectionsImagesCount; i++) {
        const imageUrl = await generateUploadLinks({
          id: oldBlog._id.toString(),
          destination: DestinationEnum.BLOG
        });

        imagesLinks.push(imageUrl.imageUrl);
    }

    if (!oldBlog) {
      return {
        success: false,
        error: "This product does not exist",
        blog: null,
        imagesLinks: []
      };
    }

      const blog = await Blog.findByIdAndUpdate(
        input.id, 
        input.data,
        {new: true}
      );

      if (!blog) {
        return {
          imagesLinks,
          success: false,
          error: "This blog does not exist",
          blog: null
        };
      }

      return {
        imagesLinks,
        success: true,
        blog: blog
      };
    } catch (error) {
      console.error("Error updating blog:", error);
      return {
        imagesLinks: [],
        success: false,
        error: error instanceof Error ? error.message : "Failed to update blog",
        blog: null
      };
    }
  });