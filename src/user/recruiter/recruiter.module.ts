import { Module, forwardRef } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { RecruiterController } from './recruiter.controller';
import { UserModule } from '../user.module';
import { CloudinaryModule } from '../media/cloudinary.module';

@Module({
  providers: [RecruiterService],
  controllers: [RecruiterController],
  exports: [RecruiterService],
  imports: [forwardRef(() => UserModule), CloudinaryModule],
})
export class RecruiterModule {}
