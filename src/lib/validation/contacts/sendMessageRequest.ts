import { z } from 'zod';

const emailRegex = new RegExp("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}$");

export const sendMessageRequest = z.object({
    email: z.string().min(1, "Vă rugăm să completați spațiul liber").regex(emailRegex, "Email-ul nu este valid"),
    name: z.string().min(2, "Vă rugăm să completați spațiul liber").max(40, "Numele nu poate depăși 40 caractere"),
    tel_number: z.string().min(9, "Vă rugăm să introduceți minim 9 caractere").max(23, "Numărul de telefon nu poate depăși 23 charactere"),
    contact_method: z.array(z.enum(["EMAIL", "TEL"])),
    message: z.string().min(2, "Vă rugăm să completați spațiul liber"),
    subject: z.enum(["ORDER_ISSUE", "GIFT_ASSITANCE", "COMPANY_COLLABORATION", "OTHER"], {
        errorMap: () => ({ message: "Vă rugăm să completați spațiul liber" })
    }),
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "Trebuie să acceptați termenii și condițiile"
    })
});