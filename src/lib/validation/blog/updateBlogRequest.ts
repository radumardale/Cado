import { z } from 'zod';
import { addBlogRequestSchema } from './addBlogRequest';

export const updateBlogRequestSchema = addBlogRequestSchema.extend({
    id: z.string().length(24, "ID must be exactly 24 characters long")
});