import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { GoogleStrategy } from './strategy/google.strategy';
//import { NotificationService } from './notification/notification.service';
//import { NovuProvider } from './notification/notification.provider';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    //NotificationService,  ],
  ],
})
export class AuthModule {}
