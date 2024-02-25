import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateJobDto, EditJobDto } from './dto';
import { JobSearchOptions } from './dto';
import { faker } from '@faker-js/faker';

@Injectable()
export class JobService {
  constructor(private database: DatabaseService) {}

  async seedRelatedData() {
    await this.seedJobBoard();
    await this.seedUsers();
    return { message: 'Data seeded successfully' };
  }
  async seedJobBoard(jobCount: number = 10) {
    const users = await this.database.user.findMany();
    const jobs = [];
    for (const user of users) {
      for (let i = 0; i < jobCount; i++) {
        jobs.push({
          jobDetails: {
            create: {
              title: faker.helpers.arrayElement([
                'Software Engineer',
                'Product Manager',
                'Data Scientist',
                'Data Analyst',
                'Business Analyst',
                'Project Manager',
                'DevOps Engineer',
                'QA Engineer',
                'UX Designer',
                'UI Designer',
              ]),
              description: faker.lorem.paragraph(),
              jobDuration: faker.helpers
                .arrayElement([
                  'full_time',
                  'part_time',
                  'contract',
                  'internship',
                ])
                .toUpperCase() as any,
              workType: faker.helpers
                .arrayElement(['remote', 'onsite', 'hybrid'])
                .toUpperCase() as any,
              experience: faker.helpers
                .arrayElement(['junior', 'mid_level', 'senior'])
                .toUpperCase() as any,
              salaryRange: faker.helpers.objectKey({
                min: Math.floor(Math.random() * 100000) + 100000,
                max: Math.floor(Math.random() * 200000) + 200000,
              }),
            },
          },
          postedBy: {
            connect: {
              id: user.id,
            },
          },
        });
      }
    }
    await this.database.job.createMany({
      data: jobs,
    });
  }

  async seedUsers(num: number = 10) {
    const users = [];
    for (let i = 0; i < num; i++) {
      users.push({
        email: faker.internet.email(),
        pin: faker.internet.password({ length: 6 }),
      });
    }
    await this.database.user.createMany({
      data: users,
    });
  }
  getJobBoard({ limit, offset, search, experience, workType, jobDuration }) {
    // get all jobs that are not expired
    // get all jobs that are not filled
    // get all jobs that are not deleted
    // get all jobs that are not draft
    // get all jobs that are not private
    try {
      return this.database.job.findMany({
        where: {
          jobDetails: {
            title: {
              contains: search,
            },
            experience: {
              equals: experience,
            },
            workType: {
              equals: workType,
            },
            jobDuration: {
              equals: jobDuration,
            },
          },
        },
        take: parseInt(limit as any),
        skip: offset,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getJobs(userId: number, options: JobSearchOptions) {
    const { limit, offset } = options;
    return this.database.job.findMany({
      where: {
        postedById: userId,
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
        jobDetails: {
          create: {
            ...dto,
            salaryRange: String(dto.salaryRange),
          },
        },
        postedBy: {
          connect: {
            id: userId,
          },
        },
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
      data: {
        jobDetails: {
          update: {
            ...dto,
            salaryRange: String(dto.salaryRange),
          },
        },
      },
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
