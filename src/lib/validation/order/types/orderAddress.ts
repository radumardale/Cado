import { z } from "zod";

export const OrderAddress = z.object({
    region: z.string().optional(),
    city: z.string().optional(),
    home_address: z.string().optional(),
    home_nr: z.string().optional(),
});