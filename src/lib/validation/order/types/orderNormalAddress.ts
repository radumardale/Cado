import { z } from "zod";
import { OrderAddress } from "./orderAddress";

export const OrderNormalAddress = OrderAddress.extend({
    firstname: z.string().min(2, "Firstname string cannot be less than 2 characters").max(30, "Firstname string cannot be more than 30 characters"),
    lastname: z.string().min(2, "Lastname string cannot be less than 2 characters").max(30, "Lastname string cannot be more than 30 characters"),
    tel_number: z.string().min(9, "The phone number cannot be shorter than 9 characters").max(23, "The phone number cannot be longer than 23 characters")
})