import { Injectable, Logger } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  // upload asset automatically
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    try {
      console.log(file);
      const byteArrayBuffer = fs.readFileSync(file.path);
      const uploadResult = await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream((error, uploadResult) => {
            return resolve(uploadResult);
          })
          .end(byteArrayBuffer);
      });
      return uploadResult as UploadApiResponse;
    } catch (error) {
      Logger.log(error.message);
      console.log(error);
      throw new Error('Failed to upload asset');
    }
  }
  async uploadVideo(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      return uploadStream.end(file.buffer);
    });
  }
  async getThumbnail(publicId: string) {
    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      transformation: [
        {
          width: 300,
          height: 300,
          crop: 'fill',
        },
      ],
      format: 'png',
    });
    return thumbnailUrl;
  }
  async streamVideo(publicId: string) {
    const videoUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'mp4',
      flags: 'streaming_attachment',
    });
    return videoUrl;
  }
  // get asset url
  async getAssetUrl(assetId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(assetId);
      return result;
    } catch (error) {
      Logger.log(error.message);
      throw new Error('Failed to get asset url');
    }
  }
}
