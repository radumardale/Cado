import { z } from 'zod';

const emailRegex = new RegExp('^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}$');

export const UserData = z.object({
  email: z
    .string()
    .min(2, 'Vă rugăm să completați spațiul liber')
    .regex(emailRegex, 'Email invalid'),
  firstname: z
    .string()
    .min(2, 'Vă rugăm să completați spațiul liber')
    .max(30, 'Firstname string cannot be more than 30 characters'),
  lastname: z
    .string()
    .min(2, 'Vă rugăm să completați spațiul liber')
    .max(30, 'Lastname string cannot be more than 30 characters'),
  tel_number: z
    .string()
    .min(2, 'Vă rugăm să completați spațiul liber')
    .max(23, 'The phone number cannot be longer than 23 characters'),
});
