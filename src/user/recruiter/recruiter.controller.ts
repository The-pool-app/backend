import {
  Body,
  Controller,
  Get,
  Logger,
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
  PersonalPreferenceDto,
  profilePictureUploadDto,
} from '../dto';
import { JwtAuthGuard } from 'src/auth/guard';
import { RecruiterService } from './recruiter.service';
import { BusinessDetailsDto } from './dto';
import { diskStorage } from 'multer';

@UseGuards(JwtAuthGuard)
@ApiTags('Recruiter')
@ApiBearerAuth()
@Controller()
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
    Logger.log(files);
    return this.recruiterService.updatePersonalDetails(userId, dto);
  }

  @Post('personal-preferences')
  addPersonalPreferences(
    @GetUser('userId') userId: number,
    @Body() dto: PersonalPreferenceDto,
  ) {
    return this.recruiterService.addPersonalPreferences(userId, dto);
  }

  @Post('business-details')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'Add business details to recruiter profile',
    type: BusinessDetailsDto,
  })
  addBusinessDetails(
    @GetUser('userId') userId: number,
    @Body() dto: BusinessDetailsDto,
    @UploadedFile()
    file: {
      CacDocs: Express.Multer.File;
    },
  ) {
    Logger.log(file);
    return this.recruiterService.addBusinessDetails(userId, dto);
  }

  @Post('profile-picture')
  @UseInterceptors(
    FileInterceptor('profilePic', {
      storage: diskStorage({
        destination: './uploads', // Specify the directory where uploaded files will be stored
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a profile picture',
    type: profilePictureUploadDto,
  })
  uploadProfilePicture(
    @GetUser('userId') userId: number,
    @UploadedFile() profilePicture: Express.Multer.File,
  ) {
    console.log(userId, profilePicture);
    return this.recruiterService.uploadProfilePicture(userId, profilePicture);
  }

  @Get('all-candidates')
  getAllCandidates() {
    // TODO
    return this.recruiterService.getAllCandidates();
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
