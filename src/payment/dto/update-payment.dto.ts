import { PartialType } from '@nestjs/swagger';
import { CreatePlanDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePlanDto) {}
