import { ApiProperty } from '@nestjs/swagger';
import { IsMimeType } from 'class-validator';

export class profilePictureUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsMimeType()
  file: any;
}
