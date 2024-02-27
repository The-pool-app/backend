import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ResponseStatus } from 'src/utils/types';
import {
  PersonalPreferenceDto,
  profilePictureUploadDto,
  SkillsDto,
  UpdatePersonalDetailsDto,
} from '../dto';
import { BusinessDetailsDto } from './dto';
import { UserRole } from '@prisma/client';
import { UserService } from '../user.service';

@Injectable()
export class RecruiterService {
  constructor(
    private database: DatabaseService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  async addBusinessDetails(
    userId: number,
    dto: BusinessDetailsDto,
  ): Promise<ResponseStatus> {
    try {
      await this.database.company.create({
        data: {
          name: dto.companyName,
          location: dto.OfficeAddress,
          businessSector: dto.businessSector,
          registrationNumber: dto.companyRegistrationNumber,
          website: dto.companyWebsite,
          User: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return {
        success: true,
        message: 'Business details added successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllCandidates(): Promise<ResponseStatus> {
    try {
      const candidates = await this.database.professional_details.findMany({
        where: {
          user: {
            roleId: UserRole.CANDIDATE,
          },
        },
        include: {
          user: {
            include: {
              userDetail: true,
              work_experience: true,
            },
          },
        },
      });
      return {
        success: true,
        message: 'All Candidates retrieved successfully',
        data: candidates,
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
}
