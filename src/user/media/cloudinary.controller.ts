import { Controller, Get, Param, Res } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('media')
@ApiTags('video-feeds')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

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
