import { z } from 'zod';

export const optionalInfoSchema = z.object({
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  material: z.object({
    ro: z.string().optional(),
    ru: z.string().optional(),
    en: z.string().optional(),
  }),
  color: z.object({
    ro: z.string().optional(),
    ru: z.string().optional(),
    en: z.string().optional(),
  }),
});
