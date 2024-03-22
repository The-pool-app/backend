import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePinDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  confirmPin: string;
}
