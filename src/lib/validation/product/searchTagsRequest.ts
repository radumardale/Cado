import { z } from 'zod';

export const searchTagsRequestSchema = z.object({
    title: z.string().min(2, "Search string should be at least 2 characters long")
});