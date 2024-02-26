import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  cleanDb() {
    // return this.$executeRaw`DROP SCHEMA IF EXISTS public CASCADE`;
    return this.$transaction([
      this.company.deleteMany(),
      this.education.deleteMany(),
      this.job_details.deleteMany(),
      this.messages.deleteMany(),
      this.role.deleteMany(),
      this.passwordResetToken.deleteMany(),
      this.work_experience.deleteMany(),
      this.personal_details.deleteMany(),
      this.professional_details.deleteMany(),
      this.subscription_plans.deleteMany(),
      this.subscription.deleteMany(),
      this.job.deleteMany(),
      this.user_activities.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
