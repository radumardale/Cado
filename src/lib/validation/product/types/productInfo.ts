import { z } from 'zod';

export const productInfoSchema = z.object({
    ro: z.string(),
    ru: z.string()
});