import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

enum IGender {
  'Female',
  'Male',
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  workEmail: string;

  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEnum(IGender)
  sex: string;

  @IsDate()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsNotEmpty()
  meansOfIdentification: string;
}
