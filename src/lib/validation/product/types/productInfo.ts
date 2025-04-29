import { z } from 'zod';

export const productInfoSchema = z.object({
    ro: z.string().min(1, { message: "Completați câmpul" }),
    ru: z.string().min(1, { message: "Completați câmpul" }),
    en: z.string().min(1, { message: "Completați câmpul" })
});