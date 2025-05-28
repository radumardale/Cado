/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Blog } from '@/models/blog/blog';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { addBlogRequestSchema } from '@/lib/validation/blog/addBlogRequest'; // Changed from updateBlogRequestSchema
import { publicProcedure } from "@/server/trpc";
import connectMongo from '@/lib/connect-mongo';
import { BlogInterface } from '@/models/blog/types/BlogInterface';
import { DestinationEnum, generateUploadLinks } from '../image/generateUploadLinks';

// Define the response interface for TypeScript type checking
export interface createBlogResponseInterface extends ActionResponse { // Changed from updateBlogResponseInterface
  blog: BlogInterface | null,
  imagesLinks: string[];
}

export const createBlogProcedure = publicProcedure // Changed from updateBlogProcedure
  .input(addBlogRequestSchema) // Changed from updateBlogRequestSchema
  .mutation(async ({ input }): Promise<createBlogResponseInterface> => { // Changed return type
    try {
      await connectMongo();

      // Create the new blog first
      const newBlog = await Blog.create({
        title: input.data.title,
        tag: input.data.tag,
        sections: input.data.sections,
      });

      const imagesLinks = [];

      // Generate upload links if main image is needed
      if (input.data.isImageNew) {
        const imageUrl = await generateUploadLinks({
          id: newBlog._id.toString(),
          destination: DestinationEnum.BLOG
        });

        imagesLinks.push(imageUrl.imageUrl);
      }

      // Generate upload links for section images
      for (let i = 0; i < input.data.sectionsImagesCount; i++) {
        const imageUrl = await generateUploadLinks({
          id: newBlog._id.toString(),
          destination: DestinationEnum.BLOG
        });

        imagesLinks.push(imageUrl.imageUrl);
      }

      return {
        success: true,
        blog: newBlog,
        imagesLinks: imagesLinks,
      };

    } catch (error: any) {
      console.error("Error creating blog:", error);
      return {
        success: false,
        error: error.message || "Failed to create blog",
        blog: null,
        imagesLinks: []
      };
    }
  });

// Export with the name expected by your tRPC router
export const createBlog = createBlogProcedure;