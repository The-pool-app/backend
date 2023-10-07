import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Patch,
  ParseIntPipe,
  Param,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
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
  getJobs(@GetUser('id') userId: number) {
    return this.jobService.getJobs(userId);
  }

  @Get(':id')
  getJobById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) jobId: number,
  ) {
    return this.jobService.getJobById(userId, jobId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  updateJob(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) jobId: number,
    @Body() dto: CreateJobDto,
  ) {
    return this.jobService.updateJobById(userId, jobId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteJobById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) jobId: number,
  ) {
    return this.jobService.deleteJobById(userId, jobId);
  }
}
