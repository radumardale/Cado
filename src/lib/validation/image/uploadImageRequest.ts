import { z } from 'zod';

export const uploadImageRequestSchema = z.object({
    image: z.string().min(2, "Base 64 string should be at least 2 characters long"),
    id: z.string().length(24, "ID must be exactly 24 characters long"),
    destination: z.enum(["PRODUCT"])
});