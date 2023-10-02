import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import * as pactum from 'pactum';
import { LoginDto, RegisterDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateJobDto } from 'src/job/dto';
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
      describe('Create Job', () => {
        const dto: CreateJobDto = {
          title: 'Software Engineer',
          company: 'Google',
          companyLocation: 'Lagos',
          jobDescription: 'Software Engineer experience in Node.js',
          jobDuration: 'Full Time',
          experience: 'Senior',
          workType: 'Remote',
        };
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
          return pactum
            .spec()
            .post('/jobs')
            .withBearerToken('$S{userAt}')
            .withBody(dto)
            .expectStatus(201);
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
            .expectJsonLength(1);
        });
      });
      describe('Get Job', () => {});
      describe('Update Job', () => {});
      describe('Delete Job', () => {});
    });
  });
});
