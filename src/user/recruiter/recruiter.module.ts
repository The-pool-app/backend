import { Module } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { RecruiterController } from './recruiter.controller';
import { CloudinaryModule } from '../media/cloudinary.module';

@Module({
  providers: [RecruiterService],
  controllers: [RecruiterController],
  exports: [RecruiterService],
  imports: [CloudinaryModule],
})
export class RecruiterModule {}
