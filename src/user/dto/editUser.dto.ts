import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

enum IGender {
  'Female',
  'Male',
}

export class EditUserDto {
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
  @IsString()
  jobRole?: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(IGender)
  sex: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  dateOfBirth?: string;

  //   @IsNotEmpty()
  //   meansOfIdentification?: string;
}
