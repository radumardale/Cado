import { z } from "zod";

export const OrderAddress = z.object({
    region: z.string({ required_error: "Vă rugăm să completați spațiul liber" }),
    city: z.string({ required_error: "Vă rugăm să completați spațiul liber" }),
    home_address: z.string({ required_error: "Vă rugăm să completați spațiul liber" }),
    home_nr: z.string().optional(),
});