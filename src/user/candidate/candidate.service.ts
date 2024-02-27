import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import {
  CreateCVDto,
  PersonalPreferenceDto,
  InterestsDto,
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
    profilePicture: Express.Multer.File,
  ): Promise<ResponseStatus> {
    return this.userService.uploadProfilePicture(userId, profilePicture);
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
    return this.userService.uploadVideo(userId, file);
  }
}
