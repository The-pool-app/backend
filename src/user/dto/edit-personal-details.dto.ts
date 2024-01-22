import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsEnum(Gender, { message: 'Gender call only be MALE or FEMALE' })
  sex: Gender;

  @ApiProperty()
  @IsNotEmpty()
  dateOfBirth?: string;

  @ApiProperty()
  @IsNotEmpty()
  meansOfIdentification?: string;

  @ApiProperty()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty()
  @IsOptional()
  profileVideo?: string;

  @ApiProperty()
  @IsNotEmpty()
  jobRole?: string;

  @ApiProperty()
  @IsNotEmpty()
  yearsOfExperience?: number;
}
