import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import {
  CreateCVDto,
  PersonalPreferenceDto,
  InterestsDto,
  profilePictureUploadDto,
  SkillsDto,
  UpdatePersonalDetailsDto,
} from '../dto';
import { DatabaseService } from 'src/database/database.service';
import { ResponseStatus } from 'src/utils/types';
import { UserService } from '../user.service';

@Injectable()
export class CandidateService {
  constructor(
    private database: DatabaseService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  async addProfessionalDetails(
    userId: number,
    dto: CreateCVDto,
  ): Promise<ResponseStatus> {
    try {
      await this.database.$transaction([
        this.database.professional_details.update({
          where: {
            userId: userId,
          },
          data: {
            professionalSummary: dto.professionalSummary,
          },
        }),
        this.database.work_experience.createMany({
          data: dto.workExperience.map((experience) => ({
            userId: userId,
            companyName: experience.companyName,
            startDate: experience.startDate,
            endDate: experience.endDate,
            description: experience.description,
            jobTitle: experience.title,
          })),
          skipDuplicates: true,
        }),
        this.database.education.createMany({
          data: dto.education.map((education) => ({
            userId: userId,
            degree: education.degree,
            schoolName: education.nameOfSchool,
            grade: education.grade,
            graduationDate: education.DateOfGraduation,
          })),
          skipDuplicates: true,
        }),
      ]);
      return {
        success: true,
        message: 'Professional details added successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addPersonalPreferences(
    userId: number,
    dto: PersonalPreferenceDto,
  ): Promise<ResponseStatus> {
    try {
      await this.database.$transaction([
        this.database.professional_details.update({
          where: { userId: userId },
          data: {
            highestEducation: dto.highestEducation,
            experienceLevel: dto.experienceLevel,
            jobPreference: dto.preferredJobType,
            status: dto.status,
            salaryRange: JSON.stringify(dto.salaryRange),
          },
        }),
        this.database.personal_details.update({
          where: { userId: userId },
          data: {
            location: dto.location,
          },
        }),
      ]);
      return {
        success: true,
        message: 'Personal preferences added successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addInterests(
    userId: number,
    dto: InterestsDto,
  ): Promise<ResponseStatus> {
    try {
      await this.database.professional_details.update({
        where: { userId: userId },
        data: {
          interests: {
            set: dto.interests,
          },
        },
      });
      return {
        success: true,
        message: 'Interests added successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async uploadProfilePicture(
    userId: number,
    profileDto: profilePictureUploadDto,
  ): Promise<ResponseStatus> {
    try {
      const profilePicture = JSON.stringify(profileDto); // Convert profileDto to a string
      if (!profileDto.file) {
        throw new BadRequestException('Profile picture is required');
      }
      const mimeType = profileDto.file.mimetype;
      if (!mimeType.includes('image')) {
        throw new BadRequestException(
          'Invalid file type. Only images are allowed',
        );
      }
      await this.database.user.update({
        where: { id: userId },
        data: {
          userDetail: {
            update: {
              profilePicture: profilePicture, // Assign the string value to profilePicture field
            },
          },
        },
      });
      return {
        success: true,
        message: 'Profile picture uploaded successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        'Invalid file type. Only PNG and JPEG are allowed',
      );
    }
  }
  async addSkills(userId: number, dto: SkillsDto): Promise<ResponseStatus> {
    try {
      await this.database.professional_details.update({
        where: { userId: userId },
        data: {
          skills: {
            set: dto.skills,
          },
        },
      });
      return { success: true, message: 'Skills added successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updatePersonalDetails(
    userId: number,
    dto: UpdatePersonalDetailsDto,
  ): Promise<ResponseStatus> {
    return this.userService.updatePersonalDetails(userId, dto);
  }
  async deleteProfile(userId: number): Promise<ResponseStatus> {
    await this.database.$transaction([
      this.database.job.deleteMany({ where: { postedById: userId } }),
      this.database.user.delete({ where: { id: userId } }),
    ]);
    return { success: true, message: 'Profile deleted successfully' };
  }

  async uploadVideo(
    userId: number,
    file: Express.Multer.File,
  ): Promise<ResponseStatus> {
    try {
      if (file.mimetype !== 'video/mp4') {
        throw new BadRequestException(
          'Invalid file type. Only videos are allowed',
        );
      }
      const user = await this.database.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      // store the video in a blob storage
      // const videoUrl = await this.videoServer.uploadVideo(file);
      let videoUrl;
      // return the url
      // update the user profile video field with the url
      await this.database.user.update({
        where: { id: userId },
        data: {
          userDetail: {
            update: {
              profileVideo: videoUrl,
            },
          },
        },
      });
      return { success: true, message: 'Video uploaded successfully' };
    } catch (error) {
      Logger.log(error.message);
      throw new BadRequestException("Couldn't upload video");
    }
  }
}
