import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtAuthGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { UpdatePersonalDetailsDto } from './dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'meansOfIdentification', maxCount: 1 },
      { name: 'profilePicture', maxCount: 1 },
    ]),
  )
  updatePersonalDetails(
    @GetUser('userId') userId: number,
    @Body() dto: UpdatePersonalDetailsDto,
    @UploadedFiles()
    files: {
      meansOfIdentification?: Express.Multer.File[];
      profilePicture?: Express.Multer.File[];
    },
  ) {
    console.log(files);
    return this.userService.updatePersonalDetails(userId, dto);
  }
  @Post('upload-video')
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(
    @GetUser('userId') userId: number,
    @UploadedFile() videoFile: Express.Multer.File,
  ) {
    return this.userService.uploadVideo(userId, videoFile);
  }
  @Post('skills')
  addSkills(@GetUser('userId') userId: number, @Body() dto) {
    return this.userService.addSkills(userId, dto);
  }

  @Post('education')
  addEducation(@GetUser('userId') userId: number, @Body() dto) {
    return this.userService.addEducation(userId, dto);
  }

  @Post('work-experience')
  addWorkExperience(@GetUser('userId') userId: number, @Body() dto) {
    return this.userService.addWorkExperience(userId, dto);
  }

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfilePicture(
    @GetUser('userId') userId: number,
    @UploadedFile() file,
  ) {
    return this.userService.uploadProfilePicture(userId, file);
  }

  @Post('interests')
  addInterests(@GetUser('userId') userId: number, @Body() dto) {
    return this.userService.addInterests(userId, dto);
  }
}
