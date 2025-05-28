/* eslint-disable  @typescript-eslint/no-explicit-any */

import connectMongo from "@/lib/connect-mongo";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto';

export enum DestinationEnum {
    PRODUCT = "PRODUCT",
    BLOG = "BLOG"
}

interface GenerateUploadLinksProps {
    id: string,
    destination: DestinationEnum
}

export const generateUploadLinks = async ({id, destination} : GenerateUploadLinksProps) => {
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
        const hash = crypto.randomBytes(4).toString('hex');
        const fileName = `${destination}/${id}/${hash}.png`;
  
        const comm = new PutObjectCommand({
          Bucket: 'studio36',
          Key: fileName,
        //   Body: buf,
        });
    
        const uploadUrl = await getSignedUrl(
          s3,
          comm,
          { expiresIn: 3600 },
        );
  
        if (!uploadUrl) {
          return {
            success: false,
            imageUrl: "",
            error: 'Failed to update object with new image'
          };
        }
  
        return {
          success: true,
          imageUrl: uploadUrl
        };
      } catch (error: any) {
        return {
          success: false,
          imageUrl: '',
          error: error.message || 'Failed to upload image'
        };
      }
}