import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdatePersonalDetailsDto } from './dto';

@Injectable()
export class UserService {
  constructor(private database: DatabaseService) {}

  addInterests(userId: number, dto: any) {
    try {
      return this.database.professional_details.update({
        where: { userId: userId },
        data: {
          interests: {
            set: dto,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  uploadProfilePicture(userId: number, file: any) {
    try {
      return this.database.user.update({
        where: { id: userId },
        data: {
          userDetail: {
            update: {
              profilePicture: file.path,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  addWorkExperience(userId: number, dto: any) {
    try {
      return this.database.work_experience.create({
        data: {
          ...dto,
          userId: userId,
        },
      });
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
  addSkills(userId: number, dto: any) {
    try {
      return this.database.professional_details.update({
        where: { userId: userId },
        data: {
          skills: {
            set: dto,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updatePersonalDetails(userId: number, dto: UpdatePersonalDetailsDto) {
    try {
      return this.database.user.update({
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  deleteProfile(userId: number) {
    return this.database.$transaction([
      this.database.job.deleteMany({ where: { postedById: userId } }),
      this.database.user.delete({ where: { id: userId } }),
    ]);
  }

  async uploadVideo(userId: number, file: Express.Multer.File) {
    try {
      const user = await this.database.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return this.database.user.update({
        where: { id: userId },
        data: {
          userDetail: {
            update: {
              profileVideo: file.path,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
