import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JobService } from 'src/job/job.service';

@Injectable()
export class AdminService {
  constructor(
    private database: DatabaseService,
    private jobService: JobService,
  ) {}
  findAllSubscriptions() {
    // fetch all subscriptions from paystack
    // url="https://api.paystack.co/subscription"
    // authorization="Authorization: Bearer YOUR_SECRET_KEY"
  }

  findASubscription(id: number) {
    // fetch a subscription from paystack
    // url="https://api.paystack.co/subscription/:id"
    // authorization="Authorization: Bearer
    return `This action returns a #${id} subscription`;
  }
  findAllUsers() {
    try {
      return this.database.user.findMany();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  findOneUser(id: number) {
    try {
      return this.database.user.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findAllJobs({
    search,
    experience,
    workType,
    jobDuration,
    currentPage,
  }) {
    return this.jobService.getJobBoard({
      currentPage,
      search,
      experience,
      workType,
      jobDuration,
    });
  }
  create(createAdminInput: any) {
    console.log(createAdminInput);
    return 'This action adds a new admin';
  }

  findJobById(id: number) {
    try {
      return this.database.job.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  verifyUser(id: number) {
    return `This action verifies a #${id} user`;
  }

  suspendUser(id: number) {
    return `This action bans a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
  // create admin
  // admin login
  // admin change password
  // admin reset password
  // admin logout
  // admin forgot password
  // get all users
  // get all users by role
  // get all active users (user last login date is not null)
  // get all inactive users (user last login date is null)
  // get all user by demographic (Gender, location, age, etc)
  // verification of user
  // suspend/disable user account (user can't login)
}
