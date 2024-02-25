import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard';
import { PaymentService } from './payment.service';
import { GetUser } from 'src/auth/decorator';
// import { CreatePlanDto } from './dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  pay(@GetUser('userId') userId: number, @Body() planId: string) {
    return this.paymentService.pay(userId, planId);
  }

  // @Post('create-plan')
  // createPlan(@Body() createPlan: CreatePlanDto) {
  //   return this.paymentService.create(createPlan);
  // }
  // @Get()
  // findAll(@GetUser('userId') userId: number) {
  //   return this.paymentService.findAllPlans(userId);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} payment`;
  }
}
