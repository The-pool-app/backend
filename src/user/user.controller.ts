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
import {
  PersonalPreferenceDto,
  UpdatePersonalDetailsDto,
  VideoFileUploadDto,
  profilePictureUploadDto,
} from './dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser('') user: User) {
    return user;
  }
  @Patch('personal-details')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'meansOfIdentification', maxCount: 1 }]),
  )
  @ApiConsumes('multipart/form-data')
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a video file',
    type: VideoFileUploadDto,
  })
  uploadVideo(
    @GetUser('userId') userId: number,
    @UploadedFile() videoFile: Express.Multer.File,
  ) {
    return this.userService.uploadVideo(userId, videoFile);
  }
  @Post('skills')
  addSkills(@GetUser('userId') userId: number, @Body() dto: string[]) {
    return this.userService.addSkills(userId, dto);
  }

  @Post('education')
  addEducation(@GetUser('userId') userId: number, @Body() dto) {
    return this.userService.addEducation(userId, dto);
  }

  @Post('personal-preferences')
  addPersonalPreferences(
    @GetUser('userId') userId: number,
    @Body() dto: PersonalPreferenceDto,
  ) {
    return this.userService.addPersonalPreferences(userId, dto);
  }

  @Post('work-experience')
  addWorkExperience(@GetUser('userId') userId: number, @Body() dto) {
    return this.userService.addWorkExperience(userId, dto);
  }

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a profile picture',
    type: profilePictureUploadDto,
  })
  uploadProfilePicture(
    @GetUser('userId') userId: number,
    @UploadedFile() profilePicture: profilePictureUploadDto,
  ) {
    return this.userService.uploadProfilePicture(userId, profilePicture);
  }

  @Post('interests')
  addInterests(@GetUser('userId') userId: number, @Body() dto: string[]) {
    return this.userService.addInterests(userId, dto);
  }
}
