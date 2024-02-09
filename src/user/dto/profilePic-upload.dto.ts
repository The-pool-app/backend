import { ApiProperty } from '@nestjs/swagger';
import { IsMimeType, IsNotEmpty } from 'class-validator';

export class profilePictureUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsMimeType()
  @IsNotEmpty()
  file: any;
}

export class SkillsDto {
  @ApiProperty()
  @IsNotEmpty()
  skills: string[];
}

export class InterestsDto {
  @ApiProperty()
  @IsNotEmpty()
  interests: string[];
}
