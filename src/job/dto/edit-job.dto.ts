import { ApiProperty } from '@nestjs/swagger';
import {
  jobDuration,
  workType,
  ApplicantExperienceLevel,
} from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditJobDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyLocation: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  company: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  jobDuration: jobDuration;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  workType: workType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  experience: ApplicantExperienceLevel;

  @ApiProperty()
  @IsNotEmpty()
  salaryRange: string;
}
