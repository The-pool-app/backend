import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

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

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(['CANDIDATE', 'RECRUITER'])
  role: string;
}
