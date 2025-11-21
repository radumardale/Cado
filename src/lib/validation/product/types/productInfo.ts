import { z } from 'zod';

/**
 * Zod validation schema for MultilingualString.
 * Ensures all three language fields are present and non-empty.
 */
export const productInfoSchema = z.object({
  ro: z.string().min(1, { message: 'Completați câmpul' }),
  ru: z.string().min(1, { message: 'Completați câmpul' }),
  en: z.string().min(1, { message: 'Completați câmpul' }),
}) satisfies z.ZodType<MultilingualString>;
