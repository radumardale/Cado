import { z } from 'zod';

export const uploadBannerImagesRequestSchema = z.object({
    id: z.string().length(24, "ID must be exactly 24 characters long"),
    newImageKeys: z.object({
        ro: z.string().nullable(),
        ru: z.string().nullable(),
        en: z.string().nullable(),
    })
});