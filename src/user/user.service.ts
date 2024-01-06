import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private database: DatabaseService) {}
  updateProfile(userId: number, dto: EditUserDto) {
    return this.database.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
    });
  }
  deleteProfile(userId: number) {
    return this.database.$transaction([
      this.database.job.deleteMany({ where: { postedById: userId } }),
      this.database.user.delete({ where: { id: userId } }),
    ]);
  }
}
