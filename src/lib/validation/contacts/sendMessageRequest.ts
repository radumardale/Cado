import { z } from 'zod';

const emailRegex = new RegExp("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}$");

export const sendMessageRequest = z.object({
    email: z.string().regex(emailRegex),
    name: z.string().min(2).max(40),
    tel_number: z.string().min(9, "The phone number cannot be shorter than 9 characters").max(23, "The phone number cannot be longer than 23 characters"),
    contact_method: z.array(z.enum(["EMAIL", "TEL"])).min(1),
    message: z.string().min(2),
    subject: z.enum(["ORDER_ISSUE", "GIFT_ASSITANCE", "COMPANY_COLLABORATION", "OTHER"])
});