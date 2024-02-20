import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './index';

export class EditJobDto extends PartialType(CreateJobDto) {
  id: number;
}
