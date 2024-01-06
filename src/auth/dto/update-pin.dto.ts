import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UpdatePinDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  pin: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  @Matches(/^[0-9]{4}$/)
  confirmPin: string;
}
