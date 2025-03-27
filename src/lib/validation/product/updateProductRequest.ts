import { z } from 'zod';
import { addProductRequestSchema } from './addProductRequest';

export const updateProductRequestSchema = addProductRequestSchema.extend({
    id: z.string().length(24, "ID must be exactly 24 characters long")
});