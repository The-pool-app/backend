import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import * as pactum from 'pactum';
import { LoginDto, RegisterDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateJobDto, EditJobDto } from 'src/job/dto';
describe('Pool App End to End Tests', () => {
  let app: INestApplication;
  let database: DatabaseService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);
    database = app.get(DatabaseService);
    await database.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth Module', () => {
    describe('Auth Controller', () => {
      describe('Register User', () => {
        const dto: RegisterDto = {
          email: 'john@test.com',
          pin: '123456',
        };

        it('should throw error if email is empty', () => {
          return pactum
            .spec()
            .post('/auth/register')
            .withBody({ ...dto, email: '' })
            .expectStatus(400);
        });
        it('should throw error if password is empty', () => {
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
        it('should throw error if password is empty', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody({ email: dto.email, pin: '' })
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
      describe('Update User', () => {
        const dto: EditUserDto = {
          firstName: 'John',
          lastName: 'Doe',
          jobRole: ['Software Engineer'],
          phoneNumber: '08012345678',
          sex: 'Male',
          dateOfBirth: '1999-01-01',
        };
        it('should throw error when body is empty', () => {
          return pactum
            .spec()
            .patch('/users/me')
            .withBearerToken('$S{userAt}')
            .withBody({})
            .expectStatus(400);
        });
        it('should update user', () => {
          return pactum
            .spec()
            .patch('/users/me')
            .withBearerToken('$S{userAt}')
            .withBody(dto)
            .expectStatus(400);
        });
      });
    });
  });
  describe('Job Module', () => {
    describe('Job Controller', () => {
      const dto: CreateJobDto = {
        title: 'Software Engineer',
        company: 'Google',
        companyLocation: 'Lagos',
        jobDescription: 'Software Engineer experience in Node.js',
        jobDuration: 'Full Time',
        experience: 'Senior',
        workType: 'Remote',
      };
      const createJob = (body = dto) =>
        pactum
          .spec()
          .post('/jobs')
          .withBearerToken('$S{userAt}')
          .withBody(body);
      describe('Create Job', () => {
        it('should throw error if no token and body is provided', () => {
          return pactum.spec().post('/jobs').expectStatus(401);
        });
        it('should throw error if no body is provided', () => {
          return pactum
            .spec()
            .post('/jobs')
            .withBearerToken('$S{userAt}')
            .expectStatus(400);
        });
        it('should create a job', () => {
          return createJob().expectStatus(201);
        });
      });
      describe('Get Jobs', () => {
        it('should throw error if no token is provided', () => {
          return pactum.spec().get('/jobs').expectStatus(401);
        });
        it('should return jobs', () => {
          return pactum
            .spec()
            .get('/jobs')
            .withBearerToken('$S{userAt}')
            .expectStatus(200)
            .expectJsonLength(1)
            .stores('jobId', 'id');
        });
        it('should return only a defined number of jobs, default is 10', async () => {
          await createJob();
          await createJob();
          await createJob();
          await createJob();
          await createJob();
          await createJob();
          await createJob();
          await createJob();
          await createJob();
          await createJob();
          await createJob();
          await createJob();
          await createJob();
          return pactum
            .spec()
            .get('/jobs')
            .withQueryParams({ limit: 10 })
            .withBearerToken('$S{userAt}')
            .expectStatus(200)
            .expectJsonLength(10);
        });
        it('should search for jobs by role', async () => {
          return pactum
            .spec()
            .get('/jobs')
            .withQueryParams({ search: 'Software Engineer' })
            .withBearerToken('$S{userAt}')
            .expectStatus(200)
            .expectJsonLength(10)
            .inspect();
        });
        // it('should search for jobs by location', () => {
        //   return pactum
        //     .spec()
        //     .get('/jobs?location=Lagos')
        //     .expectStatus(200)
        //     .expectJsonLength(1);
        // });
        // it('should search for jobs by role and location', () => {});
        // it('should filter  jobs by worktype', () => {});
        // it('should filter  jobs by date of creation', () => {});
      });
      describe('Get Job', () => {
        it('should throw error if no token is provided', () => {
          return pactum.spec().get('/jobs/1').expectStatus(401);
        });
        it('should return job', () => {
          return pactum
            .spec()
            .get('/jobs/{id}')
            .withPathParams('id', '$S{jobId}')
            .withBearerToken('$S{userAt}')
            .expectStatus(200)
            .expectBodyContains('Software Engineer');
        });
      });
      describe('Update Job', () => {
        const dto: EditJobDto = {
          title: 'Software Engineer',
          company: 'Google',
          companyLocation: 'Lagos',
          jobDescription: 'Software Engineer experience in Node.js',
          jobDuration: 'Full Time',
          experience: 'Senior',
          workType: 'Hybrid',
        };
        it('should update job', () => {
          return pactum
            .spec()
            .patch('/jobs/{id}')
            .withPathParams('id', '$S{jobId}')
            .withBody(dto)
            .withBearerToken('$S{userAt}')
            .expectStatus(202)
            .expectBodyContains('Job updated successfully');
        });
      });
      describe('Delete Job', () => {
        it('should delete job', () => {
          return pactum
            .spec()
            .delete('/jobs/{id}')
            .withPathParams('id', '$S{jobId}')
            .withBearerToken('$S{userAt}')
            .expectStatus(204);
        });
      });
    });
  });
});
