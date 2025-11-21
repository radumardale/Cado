import { z } from 'zod';

/**
 * Zod validation schema for OptionalMultilingualString.
 * Allows optional text in each language.
 */
const optionalMultilingualSchema = z.object({
  ro: z.string().optional(),
  ru: z.string().optional(),
  en: z.string().optional(),
}) satisfies z.ZodType<OptionalMultilingualString>;

/**
 * Zod validation schema for optional product information.
 * Includes weight, dimensions, material, and color fields.
 */
export const optionalInfoSchema = z.object({
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  material: optionalMultilingualSchema,
  color: optionalMultilingualSchema,
});
