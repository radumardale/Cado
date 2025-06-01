import { z } from 'zod';

export const uploadBannerImagesRequestSchema = z.object({
    id: z.string().length(24, "ID must be exactly 24 characters long"),
    newMainImageKey: z.string().nullable()
});