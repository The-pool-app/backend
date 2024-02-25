import { ApiProperty } from '@nestjs/swagger';

export class Admin {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
