import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import { uuid } from 'uuidv4';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
        region: process.env.AWS_REGION,
      });

      const allowedExtensions = ['.png', '.jpg', '.jpeg', '.jfif', '.exif', '.tiff', '.bmp', '.gif'];

      const upload = multer({
        storage: multerS3({
          s3,
          bucket: process.env.BUCKET_NAME,
          contentType: multerS3.AUTO_CONTENT_TYPE,
          shouldTransform: true,
          key: function (_, file, callback) {
            const fileId = uuid();
            const type = file.mimetype.split('/')[1];

            if (!allowedExtensions.includes(path.extname(file.originalname.toLowerCase())) || !file.mimetype.startsWith('image/')) {
              const errorMessage = '이미지 파일만 업로드가 가능합니다.';
              const errorResponse = { errorMessage };
              return res.status(HttpStatus.BAD_REQUEST).json({ errorResponse });
            }

            const fileName = `${fileId}.${type}`;
            callback(null, fileName);
          },

          acl: 'public-read-write',
          limit: { fileSize: 5 * 1024 * 1024 },
        }),
      });
      upload.single('newFile')(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ errorMessage: '파일 업로드 에러' });
    }
  }
}
