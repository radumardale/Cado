import { z } from "zod";

export const OrderAddress = z.object({
    country: z.string().min(1, "Country is required"),
    region: z.string().min(1, "Region is required"),
    city: z.string().min(1, "City is required"),
    home_address: z.string().min(1, "Home address is required")
})