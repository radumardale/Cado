import { z } from "zod";
import { OrderAddress } from "./orderAddress";

export const OrderNormalAddress = OrderAddress.extend({
    firstname: z.string({
        required_error: "Vă rugăm să completați spațiul liber"
    }).max(30, "Firstname string cannot be more than 30 characters"),
    lastname: z.string({
        required_error: "Vă rugăm să completați spațiul liber"
    }).max(30, "Lastname string cannot be more than 30 characters"),
    tel_number: z.string({
        required_error: "Vă rugăm să completați spațiul liber"
    }).max(23, "The phone number cannot be longer than 23 characters")
})