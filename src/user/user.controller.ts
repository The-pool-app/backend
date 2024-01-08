import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtAuthGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { UpdatePersonalDetailsDto } from './dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser('') user: User) {
    return user;
  }
  @Patch('personal-details')
  updatePersonalDetails(
    @GetUser('userId') userId: number,
    @Body() dto: UpdatePersonalDetailsDto,
  ) {
    return this.userService.updatePersonalDetails(userId, dto);
  }
}
