import { z } from 'zod';

export const uploadProductImageRequestSchema = z.object({
    filenames: z.array(z.string()),
    id: z.string().length(24, "ID must be exactly 24 characters long"),
});