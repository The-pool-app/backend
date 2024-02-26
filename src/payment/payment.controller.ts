import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard';
import { PaymentService } from './payment.service';
import { GetUser } from 'src/auth/decorator';
import { CreatePlanDto, UpdatePlanDto } from './dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  pay(@GetUser('userId') userId: number, @Body() planId: string) {
    return this.paymentService.pay(userId, planId);
  }

  @Post('create-plan')
  createPlan(@Body() createPlan: CreatePlanDto) {
    console.log(createPlan);
    return this.paymentService.create(createPlan);
  }
  @Get('all-plans')
  findAll(@GetUser('userId') userId: number) {
    return this.paymentService.FindAllPlansForAUserV2(userId);
  }

  @Patch('update-plan/:id')
  updatePlan(@Param('id') id: string, @Body() updatePlan: UpdatePlanDto) {
    return this.paymentService.updatePlan(id, updatePlan);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} payment`;
  }
}
