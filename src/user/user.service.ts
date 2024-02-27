import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  InterestsDto,
  PersonalPreferenceDto,
  SkillsDto,
  UpdatePersonalDetailsDto,
} from './dto';
import { CloudinaryService } from './media/cloudinary.service';
import { CreateCVDto } from './dto';
import { ResponseStatus } from 'src/utils/types';

@Injectable()
export class UserService {
  constructor(
    private database: DatabaseService,
    private videoServer: CloudinaryService,
  ) {}

  async addProfessionalDetails(userId: number, dto: CreateCVDto) {
    try {
      await this.database.$transaction([
        this.database.professional_details.upsert({
          create: {
            professionalSummary: dto.professionalSummary,
            userId: userId,
            yearsOfExperience: 0, // Replace 0 with the actual value
          },
          where: {
            userId: userId,
          },
          update: {
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
      return { message: 'Professional details added successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addPersonalPreferences(userId: number, dto: PersonalPreferenceDto) {
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
      return { message: 'Personal preferences added successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updatePersonalDetails(
    userId: number,
    dto: UpdatePersonalDetailsDto,
  ): Promise<ResponseStatus> {
    try {
      await this.database.$transaction([
        this.database.personal_details.update({
          where: { userId: userId },
          data: {
            sex: dto.sex,
            firstName: dto.firstName,
            lastName: dto.lastName,
            dateOfBirth: dto.dateOfBirth,
            phoneNumber: dto.phoneNumber,
            meansOfIdentification: dto.meansOfIdentification,
          },
        }),
        this.database.professional_details.create({
          data: {
            userId: userId,
            jobRole: dto.jobRole,
            yearsOfExperience: Number(dto.yearsOfExperience),
          },
        }),
      ]);
      return {
        success: true,
        message: 'Personal details updated successfully',
      };
    } catch (error) {
      Logger.error('Error updating personal details', error);
      throw new BadRequestException('Error updating personal details');
    }
  }

  async addInterests(userId: number, dto: InterestsDto) {
    try {
      await this.database.professional_details.update({
        where: { userId: userId },
        data: {
          interests: {
            set: dto.interests,
          },
        },
      });
      return { message: 'Interests added successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async uploadProfilePicture(
    userId: number,
    file: Express.Multer.File,
  ): Promise<ResponseStatus> {
    try {
      // check for file size
      if (file.size > 5000000) {
        throw new BadRequestException('File size too large');
      }
      if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
        throw new BadRequestException(
          'Invalid file type. Only PNG and JPEG are allowed',
        );
      }
      const profilePicture = await this.videoServer.uploadImage(file);
      const asset = await this.database.media.create({
        data: {
          mediaPublicId: profilePicture.public_id,
          mediaUrl: profilePicture.secure_url,
          mediaType: profilePicture.resource_type,
          userId: userId,
        },
      });
      await this.database.personal_details.update({
        where: { userId },
        data: {
          profilePicture: asset.mediaUrl, // Assign the string value to profilePicture field
        },
      });
      return {
        success: true,
        message: 'Profile picture uploaded successfully',
      };
    } catch (error) {
      Logger.log('Error uploading profile picture', error);
      throw new BadRequestException(
        'Invalid file type. Only PNG and JPEG are allowed',
      );
    }
  }
  async addSkills(userId: number, dto: SkillsDto) {
    try {
      await this.database.professional_details.update({
        where: { userId: userId },
        data: {
          skills: {
            set: dto.skills,
          },
        },
      });
      return { message: 'Skills added successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteProfile(userId: number) {
    await this.database.$transaction([
      this.database.job.deleteMany({ where: { postedById: userId } }),
      this.database.user.delete({ where: { id: userId } }),
    ]);
    return { message: 'Profile deleted successfully' };
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
      const videoUrl = await this.videoServer.uploadVideo(file);

      // return the url
      const videoStore = await this.database.media.create({
        data: {
          mediaPublicId: videoUrl.public_id,
          mediaUrl: videoUrl.secure_url,
          mediaType: videoUrl.resource_type,
          userId: userId,
        },
      });
      // update the user profile video field with the url
      await this.database.user.update({
        where: { id: userId },
        data: {
          userDetail: {
            update: {
              profileVideo: videoStore.mediaUrl,
            },
          },
        },
      });
      return { success: true, message: 'Video uploaded successfully' };
    } catch (error) {
      Logger.error('Error uploading video', error);
      throw new BadRequestException('Error uploading video');
    }
  }
}
