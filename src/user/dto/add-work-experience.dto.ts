import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddWorkExperienceDto {
  @ApiProperty()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  position: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  companyLocation: string;

  @ApiProperty()
  @IsOptional()
  description: string;
}
