import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdatePersonalDetailsDto, profilePictureUploadDto } from './dto';

@Injectable()
export class UserService {
  constructor(private database: DatabaseService) {}

  async addInterests(userId: number, dto: any) {
    try {
      await this.database.professional_details.update({
        where: { userId: userId },
        data: {
          interests: {
            set: dto,
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
    profileDto: profilePictureUploadDto,
  ) {
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
      return { message: 'Profile picture uploaded successfully' };
    } catch (error) {
      throw new BadRequestException(
        'Invalid file type. Only PNG and JPEG are allowed',
      );
    }
  }
  async addWorkExperience(userId: number, dto: any) {
    try {
      await this.database.work_experience.create({
        data: {
          ...dto,
          userId: userId,
        },
      });
      return { message: 'Work experience added successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  addEducation(userId: number, dto: any) {
    try {
      return this.database.education.create({
        data: {
          ...dto,
          userId: userId,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async addSkills(userId: number, dto: any) {
    try {
      await this.database.professional_details.update({
        where: { userId: userId },
        data: {
          skills: {
            set: dto,
          },
        },
      });
      return { message: 'Skills added successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updatePersonalDetails(userId: number, dto: UpdatePersonalDetailsDto) {
    try {
      await this.database.user.update({
        where: { id: userId },
        data: {
          userDetail: {
            update: {
              dateOfBirth: dto.dateOfBirth,
              firstName: dto.firstName,
              lastName: dto.lastName,
              phoneNumber: dto.phoneNumber,
              sex: dto.sex,
              meansOfIdentification: dto.meansOfIdentification,
            },
          },
          professional_details: {
            create: {
              userId: userId,
              jobRole: dto.jobRole,
              yearsOfExperience: dto.yearsOfExperience,
            },
          },
        },
      });
      return { message: 'Personal details updated successfully' };
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

  async uploadVideo(userId: number, file: Express.Multer.File) {
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
      // return the url
      // update the user profile video field with the url
      await this.database.user.update({
        where: { id: userId },
        data: {
          userDetail: {
            update: {
              profileVideo: file.path,
            },
          },
        },
      });
      return { message: 'Video uploaded successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
