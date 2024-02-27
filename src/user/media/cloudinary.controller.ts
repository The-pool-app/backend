import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('media')
@ApiTags('video-feeds')
export class CloudinaryController {
  constructor() {}
}
