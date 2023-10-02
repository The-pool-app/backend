import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateJobDto } from './dto';

@Injectable()
export class JobService {
  constructor(private database: DatabaseService) {}

  async getJobs() {
    return this.database.job.findMany();
  }
  async getJob(id: number) {
    return this.database.job.findUnique({
      where: { id },
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
  async updateJob(jobId: number, dto: CreateJobDto) {
    return this.database.job.update({
      where: { id: jobId },
      data: dto,
    });
  }
}
