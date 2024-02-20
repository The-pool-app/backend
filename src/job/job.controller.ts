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
  createJob(@GetUser('id') userId: number, @Body() dto: CreateJobDto) {
    return this.jobService.createJob(userId, dto);
  }

  @Get()
  getJobs(
    @GetUser('id') userId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('search') search?: string,
    // @Query('role') role: string,
    // @Query('location') location: string,
    // @Query('experience') experience: string,
    // @Query('workType') workType: string,
    // @Query('jobDuration') jobDuration: string,
  ) {
    return this.jobService.getJobs(userId, {
      limit: limit || 10,
      offset,
      search,
      // role,
      // location,
      // experience,
      // workType,
      // jobDuration,
    });
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
    @Body() dto: EditJobDto,
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
  @Get('job-board')
  getJobBoard(
    @GetUser('id') userId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('search') search?: string,
    @Query('experience') experience?: string,
    @Query('workType') workType?: string,
    @Query('jobDuration') jobDuration?: string,
  ) {
    return this.jobService.getJobBoard({
      limit: limit || 10,
      offset,
      search,
      experience,
      workType,
      jobDuration,
    });
  }
}
