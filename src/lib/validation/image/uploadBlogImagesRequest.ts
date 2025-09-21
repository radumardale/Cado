import { z } from 'zod';

export const uploadBlogImagesRequestSchema = z.object({
  filenames: z.array(
    z.object({
      image: z.string(),
      index: z.number(),
    })
  ),
  id: z.string().length(24, 'ID must be exactly 24 characters long'),
  newMainImageKey: z.string().nullable(),
});
