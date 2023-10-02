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
}
