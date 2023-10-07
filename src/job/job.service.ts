import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateJobDto, EditJobDto } from './dto';
import { JobSearchOptions } from './dto';

@Injectable()
export class JobService {
  constructor(private database: DatabaseService) {}

  async getJobs(userId: number, options: JobSearchOptions) {
    const { limit, offset } = options;
    return this.database.job.findMany({
      where: {
        postedById: userId,
        title: options.search,
      },
      take: parseInt(limit as any),
      skip: offset,
    });
  }
  async getJobById(userId: number, jobId: number) {
    return this.database.job.findFirst({
      where: {
        id: jobId,
        postedById: userId,
      },
    });
  }
  async createJob(userId: number, dto: CreateJobDto) {
    await this.database.job.create({
      data: {
        postedById: userId,
        ...dto,
      },
    });
    return { message: 'Job created successfully' };
  }
  async updateJobById(userId: number, jobId: number, dto: EditJobDto) {
    const job = await this.database.job.findFirst({
      where: {
        id: jobId,
      },
    });
    if (!job || job.postedById !== userId) {
      throw new NotFoundException('Job not found');
    }
    await this.database.job.update({
      where: {
        id: jobId,
      },
      data: dto,
    });
    return { message: 'Job updated successfully' };
  }

  async deleteJobById(userId: number, jobId: number) {
    const job = await this.database.job.findFirst({
      where: {
        id: jobId,
      },
    });
    if (!job || job.postedById !== userId) {
      throw new ForbiddenException('Job not found');
    }
    await this.database.job.delete({
      where: {
        id: jobId,
      },
    });
    return { message: 'Job deleted successfully' };
  }
}
