import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Health')
@Controller('health')
export class AppController {
  constructor() {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async getHealth() {
    return {
      message: 'All systems are operational',
      timestamp: new Date().toISOString(),
      status: 200,
    };
  }
}
