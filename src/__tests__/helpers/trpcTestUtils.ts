import { vi } from 'vitest';

/**
 * tRPC-specific test utilities
 */

/**
 * Creates a mock S3Client for AWS SDK v3
 */
export function createMockS3Client() {
  const sendMock = vi.fn();

  return {
    S3Client: vi.fn().mockImplementation(() => ({
      send: sendMock,
    })),
    mockSend: sendMock,
  };
}

/**
 * Creates a mock for getSignedUrl function
 */
export function createMockGetSignedUrl(url: string = 'https://s3.amazonaws.com/cadomd/test.jpg') {
  return vi.fn().mockResolvedValue(url);
}

/**
 * Mock for PutObjectCommand
 */
export function createMockPutObjectCommand() {
  return vi.fn().mockImplementation(config => ({
    input: config,
    middlewareStack: {
      add: vi.fn(),
    },
  }));
}

/**
 * Mock for DeleteObjectCommand
 */
export function createMockDeleteObjectCommand() {
  return vi.fn().mockImplementation(config => ({
    input: config,
    middlewareStack: {
      add: vi.fn(),
    },
  }));
}

/**
 * Mock for DeleteObjectsCommand
 */
export function createMockDeleteObjectsCommand() {
  return vi.fn().mockImplementation(config => ({
    input: config,
    middlewareStack: {
      add: vi.fn(),
    },
  }));
}

/**
 * Setup complete S3 mock infrastructure
 */
export function setupS3Mocks() {
  const s3Client = createMockS3Client();
  const getSignedUrl = createMockGetSignedUrl();
  const PutObjectCommand = createMockPutObjectCommand();
  const DeleteObjectCommand = createMockDeleteObjectCommand();
  const DeleteObjectsCommand = createMockDeleteObjectsCommand();

  return {
    s3Client,
    getSignedUrl,
    PutObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
  };
}

/**
 * Creates a presigned URL mock response
 */
export function createMockPresignedUrl(
  destination: string,
  id: string,
  hash: string = 'abc123'
): string {
  return `https://cadomd.s3.eu-north-1.amazonaws.com/${destination}/${id}/${hash}.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=TESTKEY&X-Amz-Date=20240101T120000Z&X-Amz-Expires=3600&X-Amz-Signature=testsignature&X-Amz-SignedHeaders=host`;
}

/**
 * Creates a CDN URL from S3 path
 */
export function createMockCdnUrl(path: string): string {
  return `https://d3rus23k068yq9.cloudfront.net/${path}`;
}

/**
 * Parse CDN URL to extract S3 key
 */
export function parseCdnUrl(cdnUrl: string): string {
  return cdnUrl.replace('https://d3rus23k068yq9.cloudfront.net/', '');
}
