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
  Query,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard';
import { JobService } from './job.service';
import { GetUser } from '../auth/decorator';
import { CreateJobDto, EditJobDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}
  @Post()
  createJob(@GetUser('userId') userId: number, @Body() dto: CreateJobDto) {
    Logger.debug(dto.salaryRange);
    return this.jobService.createJob(userId, dto);
  }

  @Get()
  getJobs(
    @GetUser('userId') userId: number,
    @Query('search') search?: string,
    @Query('currentPage') currentPage: number = 1, // Declare currentPage variable with a default value of 1
    // @Query('role') role: string,
    // @Query('location') location: string,
    // @Query('experience') experience: string,
    // @Query('workType') workType: string,
    // @Query('jobDuration') jobDuration: string,
  ) {
    return this.jobService.getJobs(userId, {
      search,
      currentPage,
    });
  }

  @Get('seed-job')
  seedJobBoard() {
    return this.jobService.seedRelatedData();
  }
  @Get('job-board')
  getJobBoard(
    @Body() currentPage: number,
    @Query('search') search?: string,
    @Query('experience') experience?: string,
    @Query('workType') workType?: string,
    @Query('jobDuration') jobDuration?: string,
  ) {
    return this.jobService.getJobBoard({
      currentPage,
      search,
      experience,
      workType,
      jobDuration,
    });
  }

  @Get(':id')
  getJobById(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) jobId: number,
  ) {
    return this.jobService.getJobById(userId, jobId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  updateJob(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) jobId: number,
    @Body() dto: EditJobDto,
  ) {
    return this.jobService.updateJobById(userId, jobId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteJobById(
    @GetUser('userId') userId: number,
    @Param('id', ParseIntPipe) jobId: number,
  ) {
    return this.jobService.deleteJobById(userId, jobId);
  }
}
