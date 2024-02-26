import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JobModule } from 'src/job/job.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
  imports: [JobModule],
})
export class AdminModule {}
