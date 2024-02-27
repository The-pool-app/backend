import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BusinessDetailsDto {
  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  OfficeAddress: string;

  @IsNotEmpty()
  companyWebsite: string;

  @IsNotEmpty()
  companyRegistrationNumber: string;

  @IsNotEmpty()
  businessSector: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  // @IsNotEmpty()
  CacDocs?: any;
}
