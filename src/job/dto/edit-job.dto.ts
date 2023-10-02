import { IsNotEmpty, IsString } from 'class-validator';

export class EditJobDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  jobDescription: string;

  @IsNotEmpty()
  @IsString()
  companyLocation: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsString()
  jobDuration: string;

  @IsNotEmpty()
  @IsString()
  workType: string;

  @IsNotEmpty()
  @IsString()
  experience: string;
}
