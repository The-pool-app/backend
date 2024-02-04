import { ApiProperty } from '@nestjs/swagger';

export class CreateCVDto {
  @ApiProperty()
  professionalSummary: string;

  @ApiProperty()
  workExperience: WorkExperience[];

  @ApiProperty()
  education: Education[];
}

export class WorkExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

export class Education {
  institution: string;
  degree: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

export class AddWorkExperienceDto {
  companyName: string;
  position: string;
  startDate: Date;
  endDate: Date;
  location: string;
  description: string;
}
