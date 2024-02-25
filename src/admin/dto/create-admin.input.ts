import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAdminInput {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
