import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { processImage } from './uploadImage.utilities';

const { AWS_REGION, AWS_BUCKET, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } =
  process.env;

export const uploadToS3 = async (picture: Express.Multer.File) => {
  try {
    if (AWS_REGION && AWS_ACCESS_KEY && AWS_SECRET_ACCESS_KEY && AWS_BUCKET) {
      const s3 = new S3Client({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY,
          secretAccessKey: AWS_SECRET_ACCESS_KEY
        }
      });

      const processedBuffer = await processImage(picture.buffer);

      const params = {
        Bucket: AWS_BUCKET,
        Key: picture.originalname,
        Body: processedBuffer,
        ContentType: picture.mimetype
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      const s3Url = `https://${AWS_BUCKET}.s3.amazonaws.com/${picture.originalname}`;
      return s3Url;
    } else {
      throw new Error('Environment variables missing');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
