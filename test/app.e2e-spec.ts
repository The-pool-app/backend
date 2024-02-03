import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import * as pactum from 'pactum';
import { LoginDto, RegisterDto, UpdatePinDto } from 'src/auth/dto';
import { UpdatePersonalDetailsDto } from 'src/user/dto';
import { CreateJobDto, EditJobDto } from 'src/job/dto';
import { MailService } from '../src/notification/mail/mail.service';
import {
  ApplicantExperienceLevel,
  jobDuration,
  workType,
} from '@prisma/client';

describe('Pool App End to End Tests', () => {
  let app: INestApplication;
  let database: DatabaseService;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue({
        sendMailWithResend: jest.fn(),
      })
      .compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    const port = process.env.PORT || 3001;
    await app.listen(port);
    database = app.get(DatabaseService);
    await database.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3001');
  });
  afterAll(() => {
    app.close();
  });

  describe('Health Check', () => {
    it('should return 200', () => {
      return pactum.spec().get('/health').expectStatus(200);
    });
    it('should return all system information', () => {
      return pactum
        .spec()
        .get('/health')
        .expectBodyContains('All systems are operational');
    });
  });
  describe('Auth Module', () => {
    describe('Auth Controller', () => {
      describe('Register User', () => {
        const dto: RegisterDto = {
          email: 'john@test.com',
          pin: '123456',
          role: 'CANDIDATE',
        };

        it('should throw error if email is empty', () => {
          return pactum
            .spec()
            .post('/auth/register')
            .withBody({ ...dto, email: '' })
            .expectStatus(400);
        });
        it('should throw error if pin is empty', () => {
          return pactum
            .spec()
            .post('/auth/register')
            .withBody({ email: dto.email, pin: '' })
            .expectStatus(400);
        });
        it('should throw error is no body is provided', () => {
          return pactum.spec().post('/auth/register').expectStatus(400);
        });
        it('should register a user', () => {
          return pactum
            .spec()
            .post('/auth/register')
            .withBody(dto)
            .expectStatus(201);
        });

        it('should throw error if email already exists', async () => {
          await pactum.spec().post('/auth/register').withBody(dto);
          return pactum
            .spec()
            .post('/auth/register')
            .withBody(dto)
            .expectStatus(403);
        });
      });
      describe('Login User', () => {
        const dto: LoginDto = {
          email: 'john@test.com',
          pin: '123456',
        };
        it('should throw error if email is empty', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody({ ...dto, email: '' })
            .expectStatus(400);
        });
        it('should throw error if pin is empty', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody({ email: dto.email, pin: '' })
            .expectStatus(400);
        });
        it('should throw error if pin is less than 4', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody({ email: dto.email, pin: '123' })
            .expectStatus(400);
        });
        it('should throw error is no body is provided', () => {
          return pactum.spec().post('/auth/login').expectStatus(400);
        });
        it('should login a user', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody(dto)
            .expectStatus(200);
        });
        it('should generate access token for user', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody(dto)
            .expectStatus(200)
            .stores('userAt', 'token');
        });
      });
      describe('Recover Pin', () => {
        it('should throw error if email is empty', () => {
          return pactum
            .spec()
            .post('/auth/forgot-pin')
            .withBody({ email: '' })
            .expectStatus(400);
        });
        it('should throw specific message if email is not found in the DB', () => {
          return pactum
            .spec()
            .post('/auth/forgot-pin')
            .withBody({ email: 'john@test3.com' })
            .expectBodyContains(
              'Link to reset password have been sent to provided email',
            );
        });
        it('should generate a password reset token and hash it', () => {
          return pactum
            .spec()
            .post('/auth/forgot-pin')
            .withBody({ email: 'john@test.com' })
            .expectBodyContains('resetToken')
            .stores('resetToken', 'resetToken');
        });
      });
      describe('Update Pin', () => {
        const updatePinDto: UpdatePinDto = {
          pin: '123456',
          confirmPin: '123456',
        };

        it('should throw error if pin and confirm Pin are not same update pin', () => {
          return pactum
            .spec()
            .post('/auth/update-pin')
            .withBody({ ...updatePinDto, confirmPin: '1234567' })
            .expectStatus(400)
            .inspect();
        });
        it('should throw error if pin is less than 4 characters', () => {
          return pactum
            .spec()
            .post('/auth/update-pin')
            .withBody({ ...updatePinDto, pin: '123' })
            .expectStatus(400);
        });
        it('should show specific message token is invalid', async () => {
          // get the reset password token from url params
          return pactum
            .spec()
            .post('/auth/update-pin')
            .withQueryParams('token', 'sample-query-param')
            .withBody(updatePinDto)
            .expectBodyContains('Invalid password reset token');
        });
        it('should show specific status code if link is invalid', async () => {
          // get the reset password token from url params
          return pactum
            .spec()
            .post('/auth/update-pin')
            .withQueryParams('token', 'some-invalid-token')
            .withBody(updatePinDto)
            .expectStatus(400);
        });
        it('should update pin', () => {
          return pactum
            .spec()
            .post('/auth/update-pin')
            .withQueryParams('token', '$S{resetToken}')
            .withBody(updatePinDto)
            .expectStatus(200);
        });
        it('should show successful message after pin update', () => {
          return pactum
            .spec()
            .post('/auth/update-pin')
            .withQueryParams('token', '$S{resetToken}')
            .withBody(updatePinDto)
            .expectBodyContains('User pin updated successfully')
            .inspect();
        });
      });
    });
  });
  describe('User Module', () => {
    describe('User Controller', () => {
      describe('Get Current User', () => {
        it('should throw error if no token is provided', () => {
          return pactum.spec().get('/users/me').expectStatus(401);
        });
        it('return current user', () => {
          return pactum
            .spec()
            .get('/users/me')
            .withBearerToken('$S{userAt}')
            .expectStatus(200);
        });
      });
      describe('Update User Personal Details', () => {
        const dto: UpdatePersonalDetailsDto = {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '08012345678',
          sex: 'MALE',
          dateOfBirth: '2007-03-01T13:00:00Z',
          jobRole: 'Software Engineer',
          yearsOfExperience: 3,
        };
        it('should throw error when body is empty', () => {
          return pactum
            .spec()
            .patch('/users/personal-details')
            .withBearerToken('$S{userAt}')
            .withBody({})
            .expectStatus(400);
        });
        it('should update user', () => {
          return pactum
            .spec()
            .patch('/users/personal-details')
            .withBearerToken('$S{userAt}')
            .withBody(dto)
            .expectStatus(200)
            .inspect();
        });
      });
      describe('Update User Professional details', () => {});
      describe('Update User Education details', () => {});
      describe('Update User Work Experience details', () => {});
    });
  });
  // describe('Job Module', () => {
  //   describe('Job Controller', () => {
  //     const dto: CreateJobDto = {
  //       title: 'Software Engineer',
  //       company: 'Google',
  //       companyLocation: 'Lagos',
  //       jobDescription: 'Software Engineer experience in Node.js',
  //       jobDuration: jobDuration.FULL_TIME,
  //       experience: ApplicantExperienceLevel.MID_LEVEL,
  //       workType: workType.HYBRID,
  //       salaryRange: 'NGN 1000000',
  //     };
  //     const createJob = (body = dto) =>
  //       pactum
  //         .spec()
  //         .post('/jobs')
  //         .withBearerToken('$S{userAt}')
  //         .withBody(body);
  //     describe('Create Job', () => {
  //       it('should throw error if no token and body is provided', () => {
  //         return pactum.spec().post('/jobs').expectStatus(401);
  //       });
  //       it('should throw error if no body is provided', () => {
  //         return pactum
  //           .spec()
  //           .post('/jobs')
  //           .withBearerToken('$S{userAt}')
  //           .expectStatus(400);
  //       });
  //       it('should create a job', () => {
  //         return createJob().expectStatus(201);
  //       });
  //     });
  //     describe('Get Jobs', () => {
  //       it('should throw error if no token is provided', () => {
  //         return pactum.spec().get('/jobs').expectStatus(401);
  //       });
  //       it('should return jobs', () => {
  //         return pactum
  //           .spec()
  //           .get('/jobs')
  //           .withBearerToken('$S{userAt}')
  //           .expectStatus(200)
  //           .expectJsonLength(1)
  //           .stores('jobId', 'id');
  //       });
  //       it('should return only a defined number of jobs, default is 10', async () => {
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         await createJob();
  //         return pactum
  //           .spec()
  //           .get('/jobs')
  //           .withQueryParams({ limit: 10 })
  //           .withBearerToken('$S{userAt}')
  //           .expectStatus(200)
  //           .expectJsonLength(10);
  //       });
  //       it('should search for jobs by role', async () => {
  //         return pactum
  //           .spec()
  //           .get('/jobs')
  //           .withQueryParams({ search: 'Software Engineer' })
  //           .withBearerToken('$S{userAt}')
  //           .expectStatus(200)
  //           .expectJsonLength(10);
  //       });
  //       // it('should search for jobs by location', () => {
  //       //   return pactum
  //       //     .spec()
  //       //     .get('/jobs?location=Lagos')
  //       //     .expectStatus(200)
  //       //     .expectJsonLength(1);
  //       // });
  //       // it('should search for jobs by role and location', () => {});
  //       // it('should filter  jobs by worktype', () => {});
  //       // it('should filter  jobs by date of creation', () => {});
  //     });
  //     describe('Get Job', () => {
  //       it('should throw error if no token is provided', () => {
  //         return pactum.spec().get('/jobs/1').expectStatus(401);
  //       });
  //       it('should return job', () => {
  //         return pactum
  //           .spec()
  //           .get('/jobs/{id}')
  //           .withPathParams('id', '$S{jobId}')
  //           .withBearerToken('$S{userAt}')
  //           .expectStatus(200)
  //           .expectBodyContains('Software Engineer');
  //       });
  //     });
  //     describe('Update Job', () => {
  //       const dto: EditJobDto = {
  //         title: 'Software Engineer',
  //         company: 'Google',
  //         companyLocation: 'Lagos',
  //         jobDescription: 'Software Engineer experience in Node.js',
  //         jobDuration: jobDuration.FULL_TIME,
  //         experience: ApplicantExperienceLevel.MID_LEVEL,
  //         workType: workType.REMOTE,
  //         salaryRange: 'NGN 1000000 - NGN 2000000',
  //       };
  //       it('should update job', () => {
  //         return pactum
  //           .spec()
  //           .patch('/jobs/{id}')
  //           .withPathParams('id', '$S{jobId}')
  //           .withBody(dto)
  //           .withBearerToken('$S{userAt}')
  //           .expectStatus(202)
  //           .expectBodyContains('Job updated successfully');
  //       });
  //     });
  //     describe('Delete Job', () => {
  //       it('should delete job', () => {
  //         return pactum
  //           .spec()
  //           .delete('/jobs/{id}')
  //           .withPathParams('id', '$S{jobId}')
  //           .withBearerToken('$S{userAt}')
  //           .expectStatus(204);
  //       });
  //     });
  //   });
  // });
  describe('Payment Module', () => {});
  describe('Chat Module', () => {});
  describe('Notification Module', () => {});
  describe('Admin Module', () => {});
});
