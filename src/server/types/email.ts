/**
 * Email and Nodemailer type definitions
 * Used for email sending procedures
 */

/**
 * Nodemailer error interface
 * Extends Error with additional Nodemailer-specific properties
 */
export interface NodemailerError extends Error {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
}

/**
 * Type guard to check if an error is a Nodemailer error
 *
 * @param error - The error to check
 * @returns True if the error is a NodemailerError
 *
 * @example
 * try {
 *   await transporter.sendMail(mailOptions);
 * } catch (error) {
 *   if (isNodemailerError(error)) {
 *     console.error('Email Error:', error.code, error.response);
 *   }
 * }
 */
export function isNodemailerError(error: unknown): error is NodemailerError {
  return error instanceof Error && ('code' in error || 'command' in error || 'response' in error);
}

/**
 * Email send result interface
 */
export interface EmailSendResult {
  success: boolean;
  error?: string;
}
