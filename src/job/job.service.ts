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
import { ResponseStatus } from 'src/utils/types';
import {
  PaginateFunction,
  PaginatedResult,
  paginator,
} from 'src/utils/paginator';
import { Job } from '@prisma/client';

const paginate: PaginateFunction = paginator({ perPage: 10 });
@Injectable()
export class JobService {
  constructor(private database: DatabaseService) {}

  async seedRelatedData() {
    try {
      await this.seedJob();
      await this.seedUsers();
      return { message: 'Data seeded successfully' };
    } catch (error) {
      console.log(error.message);
      throw new Error(error.message);
    }
  }

  async seedJob(jobCount: number = 10) {
    try {
      const users = await this.database.user.findMany();
      console.log(users);
      for (const user of users) {
        for (let i = 0; i < jobCount; i++) {
          await this.database.job.create({
            data: {
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
                  jobDescription: faker.lorem.paragraph(),
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
                    .arrayElement(['junior', 'senior', 'mid_level'])
                    .toUpperCase() as any,
                  salaryRange: JSON.stringify({
                    min: String(Math.floor(Math.random() * 100000) + 100000),
                    max: String(Math.floor(Math.random() * 200000) + 200000),
                  }),
                },
              },
              postedBy: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        }
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async seedUsers(num: number = 10) {
    try {
      for (let i = 0; i < num; i++) {
        await this.database.personal_details.create({
          data: {
            email: faker.internet.email(),
            pin: faker.internet.password({ length: 10 }),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            user: {
              create: {
                roleId: faker.helpers.arrayElement(['CANDIDATE', 'RECRUITER']),
              },
            },
          },
        }); // create a user
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getJobBoard({
    currentPage,
    search,
    experience,
    workType,
    jobDuration,
  }): Promise<PaginatedResult<Job>> {
    // get all jobs that are not expired
    // get all jobs that are not filled
    // get all jobs that are not deleted
    // get all jobs that are not draft
    // get all jobs that are not private
    try {
      return paginate(this.database.job, {
        include: {
          jobDetails: true,
        },
        where: {
          jobDetails: {
            title: {
              contains: search,
            },
            experience: experience as any,
            workType: workType as any,
            jobDuration: jobDuration as any,
          },
        },
        skip: (currentPage - 1) * 10,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getJobs(
    userId: number,
    options: JobSearchOptions,
  ): Promise<ResponseStatus> {
    const { limit, offset } = options;
    const jobs = await this.database.job.findMany({
      where: {
        postedById: userId,
      },
      include: {
        jobDetails: true,
      },
      take: parseInt(limit as any),
      skip: offset,
    });
    return {
      success: true,
      message: 'Jobs retrieved successfully',
      data: jobs,
    };
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
            salaryRange: JSON.stringify(dto.salaryRange),
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
