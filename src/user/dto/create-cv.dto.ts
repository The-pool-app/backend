import { ApiProperty } from '@nestjs/swagger';
import { AddWorkExperienceDto, addEducation } from './index';
import { IsNotEmpty } from 'class-validator';

export class CreateCVDto {
  @ApiProperty()
  @IsNotEmpty()
  professionalSummary: string;

  @ApiProperty()
  @IsNotEmpty()
  workExperience: AddWorkExperienceDto[];

  @ApiProperty()
  @IsNotEmpty()
  education: addEducation[];
}
