import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { processImage } from './uploadImage.utilities';
import { fromIni } from '@aws-sdk/credential-providers';

export const uploadToS3 = async (picture: Express.Multer.File) => {
  try {
    const { AWS_PROFILE } = process.env;

    let s3: S3Client;

    if (AWS_PROFILE) {
      s3 = new S3Client({
        region: 'eu-west-2',
        credentials: fromIni({ profile: AWS_PROFILE })
      });
    } else {
      s3 = new S3Client({
        region: 'eu-west-2'
      });
    }

    const processedBuffer = await processImage(picture.buffer);

    const params = {
      Bucket: 'voxieverse',
      Key: picture.originalname,
      Body: processedBuffer,
      ContentType: picture.mimetype
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const s3Url = `https://voxieverse.s3.amazonaws.com/${picture.originalname}`;
    return s3Url;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
