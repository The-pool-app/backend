import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { JobModule } from './job/job.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    JobModule,
    MailModule,
  ],
})
export class AppModule {}
console.log(
  process.env.NODE_ENV,
  'process.env.NODE_ENV',
  process.env.DATABASE_URL,
  'process.env.DATABASE_URL',
);
