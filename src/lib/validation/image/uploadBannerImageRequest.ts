import { z } from 'zod';

/**
 * Schema for uploading banner images.
 * newImageKeys follows MultilingualString structure but with nullable strings
 * to handle cases where images are not uploaded for specific languages.
 */
export const uploadBannerImagesRequestSchema = z.object({
  id: z.string().length(24, 'ID must be exactly 24 characters long'),
  newImageKeys: z.object({
    ro: z.string().nullable(),
    ru: z.string().nullable(),
    en: z.string().nullable(),
  }),
});
