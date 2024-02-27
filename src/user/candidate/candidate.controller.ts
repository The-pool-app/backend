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
import { CandidateService } from './candidate.service';
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

@UseGuards(JwtAuthGuard)
@ApiTags('Candidate')
@ApiBearerAuth()
@Controller()
export class CandidateController {
  constructor(private candidateService: CandidateService) {}
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
    return this.candidateService.updatePersonalDetails(userId, dto);
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
    return this.candidateService.uploadVideo(userId, videoFile);
  }
  @Post('skills')
  addSkills(@GetUser('userId') userId: number, @Body() dto: SkillsDto) {
    return this.candidateService.addSkills(userId, dto);
  }

  @Post('personal-preferences')
  addPersonalPreferences(
    @GetUser('userId') userId: number,
    @Body() dto: PersonalPreferenceDto,
  ) {
    return this.candidateService.addPersonalPreferences(userId, dto);
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
    return this.candidateService.addProfessionalDetails(userId, dto);
  }

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('profilePicture'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a profile picture',
    type: profilePictureUploadDto,
  })
  uploadProfilePicture(
    @GetUser('userId') userId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.candidateService.uploadProfilePicture(userId, file);
  }

  @Post('interests')
  addInterests(@GetUser('userId') userId: number, @Body() dto: InterestsDto) {
    return this.candidateService.addInterests(userId, dto);
  }
}
