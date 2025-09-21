import { z } from 'zod';

export const getLimitedBlogsRequestSchema = z.object({
  limit: z.number(),
});
