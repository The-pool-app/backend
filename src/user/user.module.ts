import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from './media/cloudinary.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [CloudinaryModule],
})
export class UserModule {}
