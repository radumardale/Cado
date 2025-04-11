import { z } from "zod";
import { OrderAddress } from "./orderAddress";

export const OrderLegalAddress = OrderAddress.extend({
    company_name: z.string({ required_error: "Vă rugăm să completați spațiul liber" }),
    idno: z.string({ required_error: "Vă rugăm să completați spațiul liber" }).min(2, "Vă rugăm să completați spațiul liber"),
})