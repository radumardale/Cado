import { z } from 'zod';
import { BlogTags } from '@/lib/enums/BlogTags';
import { productInfoSchema } from '../product/types/productInfo';
import { sectionSchema } from './types/sectionSchema';

export const addBlogRequestSchema = z.object({
    data: z.object({
      title: productInfoSchema,
      isImageNew: z.boolean(),
      sectionsImagesCount: z.number(),
      tag: z.nativeEnum(BlogTags),
      sections: z.array(sectionSchema),
      imagesChanged: z.boolean().optional(),
    })
  });