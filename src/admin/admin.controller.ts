import { AdminService } from './admin.service';
import { DatabaseService } from 'src/database/database.service';
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
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
    try {
      return this.database.user.findMany();
    } catch (error) {
      throw new Error(error.message);
    }
  }
  @Get('users/:id')
  findOne() {
    return this.adminService.findOne(0);
  }

  @Patch('update')
  updateAdmin() {
    return this.adminService.update(0);
  }

  @Delete('remove/:id')
  removeAdmin() {
    return this.adminService.remove(0);
  }
}
