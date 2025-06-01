/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import { ActionResponse } from '@/lib/types/ActionResponse';
import connectMongo from "@/lib/connect-mongo";
import { uploadBlogImagesRequestSchema } from "@/lib/validation/image/uploadBlogImagesRequest";
import { SectionImagesInterface } from "@/models/blog/types/SectionImagesInterface";
import { Blog } from "@/models/blog/blog";
import { deleteFromBucket } from "./deleteObjects/deleteFromBucket";

interface UploadBlogImagesResponse extends ActionResponse {
  sectionImages: SectionImagesInterface[];
  mainImage: string;
}

export const UploadBlogImagesProcedure = publicProcedure
  .input(uploadBlogImagesRequestSchema)
  .mutation(async ({ input }): Promise<UploadBlogImagesResponse> => {
    try {
      await connectMongo();

      const newSectionImages = input.filenames.map(filename => ({
        index: filename.index,
        image: `https://d3le09nbvee0zx.cloudfront.net/${filename.image}`
      }))

    const blog = await Blog.findById(input.id);

    if (!blog) {
      return {
        success: false,
        sectionImages: [],
        mainImage: "",
        error: 'Blog not found'
      };
    }

    const newSectionImagesUrls = input.filenames.map(filename => filename.image);
    for (const obj of blog.section_images) {
        if (!newSectionImagesUrls.includes(obj.image)) {
            await deleteFromBucket(obj.image);
        }
    }

    if (input.newMainImageKey) {
        blog.image = `https://d3le09nbvee0zx.cloudfront.net/${input.newMainImageKey}`;
    }

    blog.section_images = newSectionImages;

    await blog.save();

    return {
      success: true,
      sectionImages: newSectionImages,
      mainImage: blog.image
    };

    } catch (error: any) {
      return {
        success: false,
        sectionImages: [],
        mainImage: "",
        error: error.message || 'Failed to upload image'
      };
    }
  });