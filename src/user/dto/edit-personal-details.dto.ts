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
  @IsEnum(Gender, { message: 'Gender can only be MALE or FEMALE' })
  sex: Gender;

  @ApiProperty()
  @IsNotEmpty()
  dateOfBirth?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  // @IsNotEmpty()
  meansOfIdentification?: any;

  @ApiProperty()
  @IsNotEmpty()
  jobRole?: string;

  @ApiProperty()
  @IsNotEmpty()
  yearsOfExperience?: number;
}
