import { Module } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { CloudinaryModule } from '../media/cloudinary.module';

@Module({
  providers: [CandidateService],
  controllers: [CandidateController],
  exports: [CandidateService],
  imports: [CloudinaryModule],
})
export class CandidateModule {}
