import { z } from "zod";
import { OrderAddress } from "./orderAddress";

export const OrderLegalAddress = OrderAddress.extend({
    company_name: z.string().min(2, "Company name cannot be shorter than 2 characters"),
    idno: z.string().min(2, "IDNO name cannot be shorter than 2 characters"),
})