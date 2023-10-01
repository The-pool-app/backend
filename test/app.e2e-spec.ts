import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
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
  });
  afterAll(() => {
    app.close();
    database.cleanDb();
  });
  describe('Auth Module', () => {
    describe('Auth Controller', () => {
      describe('Register User', () => {
        it('should register a user', () => {});
      });
      describe('Login User', () => {
        it('should login a user', () => { });
      });
      describe('Forgot Password', () => { });
      describe('Reset Password', () => { });
    });
  });
  describe('User Module', () => {
    describe('User Controller', () => {
      describe('Get Current User', () => {});
      describe('Update User', () => {});
      describe('Delete User', () => {});
    });
  });
  describe('Job Module', () => {
    describe('Job Controller', () => {
      describe('Create Job', () => {});
      describe('Get Jobs', () => {});
      describe('Get Job', () => {});
      describe('Update Job', () => {});
      describe('Delete Job', () => {});
    });
  });
});
