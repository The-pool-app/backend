import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { GoogleStrategy } from './strategy';
// import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: 60 * 60 * 24 },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
