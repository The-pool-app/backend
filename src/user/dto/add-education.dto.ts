import { ApiProperty } from '@nestjs/swagger';

export class addEducation {
  @ApiProperty()
  nameOfSchool: string;
  @ApiProperty()
  degree: string;

  @ApiProperty()
  DateOfGraduation: Date;

  @ApiProperty()
  grade: string;
}
