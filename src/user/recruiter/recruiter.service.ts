import { CloudinaryService } from './../media/cloudinary.service';
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
  // profilePictureUploadDto,
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
    private uploadServer: CloudinaryService,
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
    profileDto: Express.Multer.File,
  ): Promise<ResponseStatus> {
    try {
      if (!profileDto) {
        throw new BadRequestException('No file uploaded');
      }
      console.log(profileDto);
      if (!profileDto.path) {
        throw new BadRequestException('File path not provided');
      }
      console.log(profileDto.path);
      const image = await this.uploadServer.uploadImage(profileDto);
      console.log(image);
      const profilePicture = JSON.stringify(profileDto);
      console.log(profilePicture);
      // Convert profileDto to a string
      const asset = await this.database.media.create({
        data: {
          mediaPublicId: image.public_id,
          mediaUrl: image.secure_url,
          mediaType: image.resource_type,
          userId: userId,
        },
      });
      await this.database.user.update({
        where: { id: userId },
        data: {
          userDetail: {
            update: {
              profilePicture: asset.mediaUrl, // Assign the string value to profilePicture field
            },
          },
        },
      });
      return {
        success: true,
        message: 'Profile picture uploaded successfully',
      };
    } catch (error) {
      throw new BadRequestException(error);
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
