import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  pin: string;
}
