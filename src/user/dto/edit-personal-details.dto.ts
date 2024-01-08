import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { Gender } from '@prisma/client';

export class UpdatePersonalDetailsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Gender, { message: 'Gender call only be male or female' })
  sex: Gender;

  @ApiProperty()
  @IsNotEmpty()
  dateOfBirth?: string;

  @ApiProperty()
  meansOfIdentification?: string;

  @ApiProperty()
  profilePicture?: string;

  @ApiProperty()
  profileVideo?: string;
}
