import { z } from "zod";
import { OrderAddress } from "./orderAddress";

export const OrderBillingAddress = OrderAddress.extend({
    company_name: z.string({ required_error: "Vă rugăm să completați spațiul liber" }).optional(),
    idno: z.string({ required_error: "Vă rugăm să completați spațiul liber" }).optional(),
    firstname: z.string({
        required_error: "Vă rugăm să completați spațiul liber"
    }).max(30, "Firstname string cannot be more than 30 characters").optional(),
    lastname: z.string({
        required_error: "Vă rugăm să completați spațiul liber"
    }).max(30, "Lastname string cannot be more than 30 characters").optional(),
})