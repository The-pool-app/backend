import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// enum IGender {
//   'Female',
//   'Male',
// }

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  pin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @IsNotEmpty()
  // @IsString()
  // firstName?: string;

  // @IsNotEmpty()
  // @IsString()
  // lastName?: string;

  // @IsNotEmpty()
  // @IsString()
  // jobTitle?: string;

  // @IsNotEmpty()
  // @IsPhoneNumber()
  // phoneNumber?: string;

  // @IsNotEmpty()
  // @IsEnum(IGender)
  // sex?: string;

  // @IsDate()
  // @IsNotEmpty()
  // dateOfBirth?: string;

  // @IsNotEmpty()
  // meansOfIdentification?: string;
}
