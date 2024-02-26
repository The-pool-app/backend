import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class JobSearchOptions {
  @IsString()
  @IsOptional()
  search: string;

  @IsNumberString()
  @IsOptional()
  currentPage: number;
}
