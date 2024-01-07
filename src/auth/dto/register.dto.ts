import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
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
  @IsEnum(['CANDIDATE', 'RECRUITER'], {
    message: 'Role is either a CANDIDATE or a RECRUITER',
  })
  role: UserRole;
}
