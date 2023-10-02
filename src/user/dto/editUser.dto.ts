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
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsString()
  jobRole?: string[];

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsNotEmpty()
  @IsEnum(IGender)
  sex: string;

  @IsDate()
  @IsNotEmpty()
  dateOfBirth?: string;

  //   @IsNotEmpty()
  //   meansOfIdentification?: string;
}
