import { DeleteObjectsCommand, S3Client } from '@aws-sdk/client-s3';

export const deleteMultipleFromBucket = async (images: string[]) => {
  const awsAccessKey = process.env.AWS_PUBLIC_ACCESS_KEY;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!awsAccessKey || !awsSecretAccessKey) {
    return {
      success: false,
      error: 'AWS credentials not provided',
    };
  }

  const s3 = new S3Client({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
    },
  });

  // Extract key from CloudFront URL
  const newImages = images.map(image => {
    return {
      Key: image.replace('https://d3rus23k068yq9.cloudfront.net/', ''),
    };
  });

  // Delete from S3
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: 'cadomd',
      Delete: {
        Objects: newImages,
      },
    })
  );
};
