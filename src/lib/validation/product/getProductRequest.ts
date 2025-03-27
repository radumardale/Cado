import { z } from 'zod';

export const getProductRequestSchema = z.object({
    id: z.string().length(24, "ID must be exactly 24 characters long")
});