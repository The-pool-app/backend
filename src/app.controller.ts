import { Controller, Get, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseService } from './database/database.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private database: DatabaseService,
  ) {}

  @Get('health')
  @HealthCheck()
  @HttpCode(HttpStatus.OK)
  async check() {
    return this.health.check([
      () => this.http.pingCheck('google', 'https://google.com'),
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }

  @Delete('clear-db')
  async clearDb() {
    return this.database.cleanDb();
  }
}
