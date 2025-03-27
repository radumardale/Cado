/* eslint-disable  @typescript-eslint/no-explicit-any */

import { publicProcedure } from "@/server/trpc";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { uploadImageRequestSchema } from '@/lib/validation/image/uploadImageRequest';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { selectObjectToUpdate } from './updateObjects/selectObjectToUpdate';
import crypto from 'crypto';
import connectMongo from "@/lib/connect-mongo";

export interface imageUploadResponseInterface extends ActionResponse {
  imageUrl: string;
}

export const uploadImageProcedure = publicProcedure
  .input(uploadImageRequestSchema)
  .mutation(async ({ input }): Promise<imageUploadResponseInterface> => {
    try {
      await connectMongo();

      const awsAccessKey = process.env.AWS_PUBLIC_ACCESS_KEY;
      const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

      if (!awsAccessKey || !awsSecretAccessKey) {
        return { 
          success: false, 
          imageUrl: '', 
          error: 'AWS credentials not provided' 
        };
      }

      const s3 = new S3Client({
        region: 'eu-north-1',
        credentials: {
          accessKeyId: awsAccessKey,
          secretAccessKey: awsSecretAccessKey,
        },
      });

      // Upload new image
      const data = input.image.replace(/^data:image\/\w+;base64,/, "");
      const buf = Buffer.from(data, 'base64');
      const hash = crypto.randomBytes(4).toString('hex');
      const fileName = `${input.destination}/${input.id}/${hash}.png`;

      await s3.send(new PutObjectCommand({
        Bucket: 'studio36',
        Key: fileName,
        Body: buf,
      }));

      const newImageUrl = `https://d3le09nbvee0zx.cloudfront.net/${fileName}`;

      const res = await selectObjectToUpdate({
        destination: input.destination,
        id: input.id,
        image: newImageUrl
      });

      if (!res) {
        return {
          success: false,
          imageUrl: '',
          error: 'Failed to update object with new image'
        };
      }

      return {
        success: true,
        imageUrl: newImageUrl
      };
    } catch (error: any) {
      return {
        success: false,
        imageUrl: '',
        error: error.message || 'Failed to upload image'
      };
    }
  });