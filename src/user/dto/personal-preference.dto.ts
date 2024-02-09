import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  ApplicantExperienceLevel,
  workType,
  ApplicantStatus,
} from '@prisma/client';
import { SalaryDto } from './salary-range.dto';

export class PersonalPreferenceDto {
  @ApiProperty()
  salaryRange: SalaryDto;

  @ApiProperty()
  @IsEnum(['JUNIOR', 'MID_LEVEL', 'SENIOR'], {
    message: 'experience level can only be JUNIOR, SENIOR or a MID_LEVEL',
  })
  experienceLevel: ApplicantExperienceLevel;

  @ApiProperty()
  highestEducation: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  @IsEnum(['REMOTE', 'ONSITE', 'HYBRID'], {
    message: 'work type can only be REMOTE, ONSITE or HYBRID',
  })
  preferredJobType: workType;

  @ApiProperty()
  @IsEnum(['ACTIVELY_LOOKING', 'NOT_LOOKING', 'OPEN_TO_OFFERS'], {
    message: 'status can only be ACTIVE, NOT_LOOKING or OPEN_TO_OFFERS',
  })
  status: ApplicantStatus;
}
