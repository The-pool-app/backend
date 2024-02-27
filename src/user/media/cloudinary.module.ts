import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      // storage: multer.diskStorage({
      //   destination: './uploads',
      //   filename: (req, file, cb) => {
      //     const filename: string = file.originalname.split('.')[0];
      //     const fileExtName: string = file.originalname.split('.')[1];
      //     cb(null, `${filename}-${Date.now()}.${fileExtName}`);
      //   },
      // }),
      storage: multer.memoryStorage(),
      // dest: './uploads',
    }),
  ],
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
