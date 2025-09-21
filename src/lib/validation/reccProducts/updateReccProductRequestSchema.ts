import { z } from 'zod';

export const updateReccProductRequestSchema = z.object({
  replaceId: z.string().length(24, 'ID must be exactly 24 characters long'),
  productId: z.string().length(24, 'ID must be exactly 24 characters long'),
});
