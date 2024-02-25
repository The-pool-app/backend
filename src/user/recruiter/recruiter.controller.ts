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
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import {
  UpdatePersonalDetailsDto,
  VideoFileUploadDto,
  SkillsDto,
  PersonalPreferenceDto,
  CreateCVDto,
  profilePictureUploadDto,
  InterestsDto,
} from '../dto';
import { JwtAuthGuard } from 'src/auth/guard';
import { RecruiterService } from './recruiter.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Recruiter')
@ApiBearerAuth()
@Controller('recruiter')
export class RecruiterController {
  constructor(private recruiterService: RecruiterService) {}
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
    },
  ) {
    console.log(files);
    return this.recruiterService.updatePersonalDetails(userId, dto);
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
    return this.recruiterService.uploadVideo(userId, videoFile);
  }
  @Post('skills')
  addSkills(@GetUser('userId') userId: number, @Body() dto: SkillsDto) {
    return this.recruiterService.addSkills(userId, dto);
  }

  @Post('personal-preferences')
  addPersonalPreferences(
    @GetUser('userId') userId: number,
    @Body() dto: PersonalPreferenceDto,
  ) {
    return this.recruiterService.addPersonalPreferences(userId, dto);
  }

  @Post('professional-details')
  @ApiBody({
    description: 'Add professional details to user profile',
    type: CreateCVDto,
  })
  addProfessionalDetails(
    @GetUser('userId') userId: number,
    @Body() dto: CreateCVDto,
  ) {
    return this.recruiterService.addProfessionalDetails(userId, dto);
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
    return this.recruiterService.uploadProfilePicture(userId, profilePicture);
  }

  @Post('interests')
  addInterests(@GetUser('userId') userId: number, @Body() dto: InterestsDto) {
    return this.recruiterService.addInterests(userId, dto);
  }
  // TODO
  // Add candidate to favorite
  @Patch('favorite/add')
  addCandidateToFavorite() {
    // TODO
  }
  // get all favorite candidates
  @Get('favorite')
  getFavoriteCandidates() {
    // TODO
  }
  // remove candidate from favorite
  @Patch('favorite/remove')
  removeCandidateFromFavorite() {
    // TODO
  }
}
