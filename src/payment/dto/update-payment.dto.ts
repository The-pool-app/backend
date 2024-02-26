import { IsEnum, IsOptional } from 'class-validator';
import { IPlanCategory } from 'src/utils/types';

export class UpdatePlanDto {
  @IsOptional()
  planId: string;

  @IsOptional()
  planName: string;

  @IsOptional()
  price: string;

  @IsOptional()
  description: string;

  @IsOptional()
  duration: string;

  @IsOptional()
  @IsEnum(IPlanCategory, {
    message:
      'Plan categry must be one of these: ' +
      Object.values(IPlanCategory).join(', '),
  })
  category: string;
}
