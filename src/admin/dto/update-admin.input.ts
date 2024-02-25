import { PartialType } from '@nestjs/swagger';
import { CreateAdminInput } from './create-admin.input';

export class UpdateAdminInput extends PartialType(CreateAdminInput) {
  id: number;
}
