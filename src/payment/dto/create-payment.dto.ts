import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IPlanCategory } from 'src/utils/types';

export class CreatePlanDto {
  @IsNotEmpty()
  planId: string;

  @IsNotEmpty()
  planName: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  duration: string;

  @IsNotEmpty()
  @IsEnum(IPlanCategory, {
    message:
      'Plan categry must be one of these: ' +
      Object.values(IPlanCategory).join(', '),
  })
  category: string;
}
