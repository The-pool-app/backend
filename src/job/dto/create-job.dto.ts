import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  workType,
  ApplicantExperienceLevel,
  jobDuration,
} from '@prisma/client';

export class CreateJobDto {
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
