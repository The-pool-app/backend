import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddWorkExperienceDto {
  @ApiProperty()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsOptional()
  description: string;
}
