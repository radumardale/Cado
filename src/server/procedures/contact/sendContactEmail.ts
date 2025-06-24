/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import nodemailer from 'nodemailer';
import { ActionResponse } from "@/lib/types/ActionResponse";
import { sendMessageRequest } from "@/lib/validation/contacts/sendMessageRequest";

const mailConfig = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
};

export const sendContactEmailProcedure = publicProcedure
  .input(sendMessageRequest)
  .mutation(async ({ input }): Promise<ActionResponse> => {
    try {
      const transporter = nodemailer.createTransport(mailConfig);

    const emailData = {
      from: process.env.FEEDBACK_EMAIL_ADDRESS,
      to: process.env.CONTACT_EMAIL_ADDRESS,
      subject: `Contact Form: ${input.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${input.name}</p>
        <p><strong>Email:</strong> ${input.email}</p>
        <p><strong>Phone Number:</strong> ${input.tel_number}</p>
        <p><strong>Preferred Contact Method:</strong> ${input.contact_method.join(', ')}</p>
        <p><strong>Subject:</strong> ${input.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${input.message.replace(/\n/g, '<br>')}</p>
      `
    };

      await transporter.sendMail(emailData);

      return {
        success: true,
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to send contact email"
      };
    }
  });