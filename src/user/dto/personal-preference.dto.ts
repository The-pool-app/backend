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
    message:
      'experience level can only be one of these' +
      Object.values(ApplicantExperienceLevel).join(', '),
  })
  experienceLevel: ApplicantExperienceLevel;

  @ApiProperty()
  highestEducation: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  @IsEnum(['REMOTE', 'ONSITE', 'HYBRID'], {
    message:
      'work type can only be one of these' + Object.values(workType).join(', '),
  })
  preferredJobType: workType;

  @ApiProperty()
  @IsEnum(['ACTIVELY_LOOKING', 'NOT_LOOKING', 'OPEN_TO_OFFERS'], {
    message:
      'status can only be one of these' +
      Object.values(ApplicantStatus).join(', '),
  })
  status: ApplicantStatus;
}
