import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class JobSearchOptions {
  @IsNumberString()
  @IsOptional()
  limit: number = 10;

  @IsNumberString()
  @IsOptional()
  offset: number = 0;
  // orderBy?: 'ASC' | 'DESC' = 'DESC';

  @IsString()
  @IsOptional()
  search: string;
  // role?: string;
  // location?: string;
  // experience?: string;
  // workType?: string;
  // jobDuration?: string;
}
