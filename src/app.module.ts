import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { JobModule } from './job/job.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { ChatModule } from './chat/chat.module';
import { PaymentModule } from './payment/payment.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { AdminModule } from './admin/admin.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    JobModule,
    NotificationModule,
    PaymentModule,
    ChatModule,
    AdminModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      include: [AdminModule],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
