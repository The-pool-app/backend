import { ApiProperty } from '@nestjs/swagger';

export class PersonalPreferenceDto {
  @ApiProperty()
  salaryRange: string;

  @ApiProperty()
  workExperience: string;

  @ApiProperty()
  highestEducation: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  preferredJobType: string;

  @ApiProperty()
  status: string;
}
