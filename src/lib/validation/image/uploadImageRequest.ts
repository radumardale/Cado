import { z } from 'zod';

export const uploadImageRequestSchema = z.object({
    filenames: z.array(z.string().min(2, "Filename string should be at least 2 characters long")),
    id: z.string().length(24, "ID must be exactly 24 characters long"),
    destination: z.enum(["PRODUCT", "BLOG"])
});