// import { ActionResponse } from "@/lib/types/ActionResponse";
// import { deleteImageRequestSchema } from "@/lib/validation/image/deleteImageRequest";
// import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { z } from "zod";
// import { selectObjectToDelete } from "./deleteObjects/selectObjectToDelete";

// type deleteImageProps = z.infer<typeof deleteImageRequestSchema>

//   export const deleteImage = async (props: deleteImageProps): Promise<ActionResponse> => {
//     try {
//     const awsAccessKey = process.env.AWS_PUBLIC_ACCESS_KEY;

//     const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

//     if (!awsAccessKey || !awsSecretAccessKey) {
//         return { 
//         success: false, 
//         error: 'AWS credentials not provided' 
//         };
//     }

//     const s3 = new S3Client({
//         region: 'eu-north-1',
//         credentials: {
//           accessKeyId: awsAccessKey,
//           secretAccessKey: awsSecretAccessKey,
//         },
//       });
  
//       // Extract key from CloudFront URL
//       const key = props.image.replace('https://d3le09nbvee0zx.cloudfront.net/', '');
  
//       // Delete from S3
//       await s3.send(new DeleteObjectCommand({
//         Bucket: 'studio36',
//         Key: key
//       }));

//       const res = await selectObjectToDelete(props);

//       return res;

//     } catch (error: any) {
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   };