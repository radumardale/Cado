import { S3ServiceException } from '@aws-sdk/client-s3';

/**
 * AWS S3 type definitions and type guards
 * Used for image upload and management procedures
 */

/**
 * Type guard to check if an error is an AWS S3 error
 *
 * @param error - The error to check
 * @returns True if the error is an S3ServiceException
 *
 * @example
 * try {
 *   await s3Client.send(command);
 * } catch (error) {
 *   if (isS3Error(error)) {
 *     console.error('S3 Error:', error.message);
 *   }
 * }
 */
export function isS3Error(error: unknown): error is S3ServiceException {
  return (
    error instanceof Error &&
    'name' in error &&
    typeof error.name === 'string' &&
    (error.name.includes('S3') || error instanceof S3ServiceException)
  );
}

/**
 * Result interface for S3 upload operations
 */
export interface S3UploadResult {
  success: boolean;
  imageUrl: string;
  error?: string;
}

/**
 * Result interface for S3 delete operations
 */
export interface S3DeleteResult {
  success: boolean;
  error?: string;
}
