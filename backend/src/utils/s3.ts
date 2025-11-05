import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3, AWS_BUCKET_NAME } from "../config/aws.js";

export const uploadToS3 = async (image:any) => {
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: `products/${Date.now()}_${image.originalname}`,
    Body: image.data,
    ContentType: image.mimetype,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
};

export const deleteFromS3 = async (key: string) => {
  const deleteParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  };
  await s3.send(new DeleteObjectCommand(deleteParams));
};
