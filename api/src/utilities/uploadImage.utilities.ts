import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

export const multerFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Must be an image type'));
  }
};

export const processImage = async (fileBuffer: Buffer) => {
  try {
    const resizedImageBuffer = await sharp(fileBuffer)
      .resize({ width: 800 })
      .jpeg({ quality: 50 })
      .toBuffer();

    return resizedImageBuffer;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
