import { z } from 'zod';
import { BlogTags } from '@/lib/enums/BlogTags';
import { productInfoSchema } from '../product/types/productInfo';
import { sectionSchema } from './types/sectionSchema';

export const addBlogRequestSchema = z.object({
    data: z.object({
      title: productInfoSchema,
      tag: z.nativeEnum(BlogTags),
      date: z.date(),
      reading_length: z.number().positive("Reading length must be a positive number"),
      sections: z.array(sectionSchema)
    })
  });