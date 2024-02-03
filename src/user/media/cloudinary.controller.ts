import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('media')
@ApiTags('media-files')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadVideo(file);
  }
  @Get(':publicId/thumbnail')
  async getThumbnail(
    @Param('publicId') publicId: string,
    @Res() res: Response,
  ) {
    const thumbnailUrl = await this.cloudinaryService.getThumbnail(publicId);
    res.status(200).json({ thumbnailUrl });
  }

  @Get(':publicId/stream')
  async streamVideo(@Param('publicId') publicId: string, @Res() res: Response) {
    const videoUrl = await this.cloudinaryService.streamVideo(publicId);
    res.status(200).json({ videoUrl });
  }
}