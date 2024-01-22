import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard';
// import { Paystack } from 'paystack-sdk';
// import { InjectPaystackClient } from 'paystack-nestjs';

@UseGuards(JwtAuthGuard)
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor() {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return { message: 'Payment successful' + createPaymentDto };
  }

  @Get()
  findAll() {
    return `This action returns all payment`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} payment`;
  }
}
