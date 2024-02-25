import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from './media/cloudinary.module';
import { CandidateModule } from './candidate/candidate.module';
import { RecruiterModule } from './recruiter/recruiter.module';
import { RouterModule } from '@nestjs/core';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    CloudinaryModule,
    CandidateModule,
    RecruiterModule,
    RouterModule.register([
      {
        path: 'user',
        module: UserModule,
        children: [
          {
            path: 'candidate',
            module: CandidateModule,
          },
          {
            path: 'recruiter',
            module: RecruiterModule,
          },
        ],
      },
    ]),
  ],
})
export class UserModule {}
