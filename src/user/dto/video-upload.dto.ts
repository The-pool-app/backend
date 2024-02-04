import { ApiProperty } from '@nestjs/swagger';
import { IsMimeType } from 'class-validator';

export class VideoFileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsMimeType()
  file: any;
}
