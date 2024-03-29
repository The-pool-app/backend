import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import {
  workType,
  ApplicantExperienceLevel,
  jobDuration,
} from '@prisma/client';
import { SalaryDto } from 'src/user/dto/salary-range.dto';

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
  jobDuration: jobDuration;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['REMOTE', 'ONSITE', 'HYBRID'])
  workType: workType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  experience: ApplicantExperienceLevel;

  @ApiProperty()
  @IsNotEmpty()
  salaryRange: SalaryDto;
}
