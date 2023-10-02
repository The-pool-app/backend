import { Controller, UseGuards, Post, Body, Get, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard';
import { JobService } from './job.service';
import { GetUser } from '../auth/decorator';
import { CreateJobDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}
  @Post()
  createJob(@GetUser('id') userId: number, @Body() dto: CreateJobDto) {
    return this.jobService.createJob(userId, dto);
  }

  @Get()
  getJobs() {
    return this.jobService.getJobs();
  }

  @Get(':id')
  getJob(id: number) {
    return this.jobService.getJob(id);
  }

  @Patch(':id')
  updateJob(id: number, @Body() dto: CreateJobDto) {
    return this.jobService.updateJob(id, dto);
  }
}
