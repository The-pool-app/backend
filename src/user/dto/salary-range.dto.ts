import { IsNumber, IsInt, Min, Max, ValidateIf } from 'class-validator';
export class SalaryDto {
  @IsNumber()
  @IsInt()
  @Min(0, { message: 'Salary must be a positive integer.' })
  value: number;

  @ValidateIf((object, value) => value !== undefined)
  @IsNumber()
  @IsInt()
  @Min(0, { message: 'Salary range minimum must be a positive integer.' })
  min?: number;

  @ValidateIf((object, value) => value !== undefined)
  @IsNumber()
  @IsInt()
  @Min(0, { message: 'Salary range maximum must be a positive integer.' })
  @Max(10000000, { message: 'Salary range maximum cannot exceed 10,000,000.' })
  max?: number;
}
