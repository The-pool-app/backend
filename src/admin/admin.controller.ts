import { AdminService } from './admin.service';
import { DatabaseService } from 'src/database/database.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard';

@UseGuards(JwtAuthGuard)
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private database: DatabaseService,
  ) {}

  @Post('create')
  createAdmin() {
    return this.adminService.create('');
  }

  @Post('login')
  login() {
    return this.adminService.create('');
  }

  @Post('change-password')
  changePassword() {
    return this.adminService.create('');
  }

  @Get('all-users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }
  @Get('users/:id')
  findOne() {
    return this.adminService.findOneUser(0);
  }

  @Get('jobs')
  findAllJobs(
    @Body() currentPage: number,
    @Query('search') search?: string,
    @Query('experience') experience?: string,
    @Query('workType') workType?: string,
    @Query('jobDuration') jobDuration?: string,
  ) {
    return this.adminService.findAllJobs({
      search,
      experience,
      workType,
      jobDuration,
      currentPage,
    });
  }

  @Get('jobs/:id')
  findJobById() {
    return this.adminService.findJobById(0);
  }

  @Delete('remove/:id')
  removeAdmin() {
    return this.adminService.remove(0);
  }

  // subscriptions
  @Get('subscriptions')
  findAllSubscriptions() {
    return this.adminService.findAllSubscriptions();
  }
  @Get('subscriptions/:id')
  findASubscription() {
    return this.adminService.findASubscription(0);
  }
}
