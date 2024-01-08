import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdatePersonalDetailsDto } from './dto';

@Injectable()
export class UserService {
  constructor(private database: DatabaseService) { }
  updatePersonalDetails(userId: number, dto: UpdatePersonalDetailsDto) {
    try {
      return this.database.personal_details.update({
        where: { userId },
        data: {
          dateOfBirth: dto.dateOfBirth,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phoneNumber: dto.phoneNumber,
          sex: dto.sex,
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
}
