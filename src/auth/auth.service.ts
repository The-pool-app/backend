import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto, ResetPasswordDto, UpdatePinDto } from './dto';
import { DatabaseService } from '../database/database.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { NotificationService } from 'src/notification/notification.service';
import { MailService } from 'src/notification/mail/mail.service';
//import emailjs from '@emailjs/nodejs';

@Injectable()
export class AuthService {
  constructor(
    private database: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
    private notification: MailService,
  ) {}
  async register(dto: RegisterDto) {
    const hash = await argon.hash(dto.pin);
    try {
      const user = await this.database.user.create({
        data: {
          email: dto.email,
          pin: hash,
        },
      });
      const token = await this.signToken(user.id, user.email);
      await this.notification.sendMailWithResend(
        user.email,
        'Welcome to the pool',
        `<h1>Welcome to the pool</h1><p>Hi ${user.email},</p><p>Thank you for joining us. </br> Please click the link below to verify your email address.</p><p>
        your magic link is <a href="http://localhost:3000/auth/magic-link?token=${token}"> here</a>
        </p><p>Regards,</p><p>The pool team</p>`,
      );
      // this.notification.sendMailWithTemplate(
      //   user.email,
      //   'Welcome to the pool',
      //   `<h1>Welcome to the pool</h1><p>Hi ${user.email},</p><p>Thank you for joining us. </br> Please click the link below to verify your email address.</p><p>
      //   your magic link is <a href="http://localhost:3000/auth/magic-link?token=${token}">here</a>
      //   </p>`,
      // );
      return { message: 'User created successfully', token };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
        throw error;
      }
    }
  }
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    const payload = {
      email: req.user.email,
      sub: req.user.userId,
    };
    const token = this.signToken(payload.sub, payload.email);
    return {
      message: 'User information from google',
      user: req.user,
      token,
    };
  }
  async login(loginDto: LoginDto) {
    const user = await this.database.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    const isPasswordValid = await argon.verify(user.pin, loginDto.pin);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }
    const token = await this.signToken(user.id, user.email);
    return { message: 'User login successfully', token };
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.database.user.findUnique({
      where: { email: resetPasswordDto.email },
    });
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    const token = await this.signToken(user.id, user.email);
    await this.notification.sendMailWithResend(
      user.email,
      'Password Reset Request',
      `<p>Hi ${user.firstName},</p><p>You requested to update your password </br> Please click the link below to update your pin.</p><p>
        the magic link is <a href="http://localhost:3000/auth/magic-link?token=${token}"> here</a>
        </p><p>Regards,</p><p>The pool team</p>`,
    );
    return { message: 'User password updated successfully' };
  }
  async resetPin(resetPinDto: UpdatePinDto) {
    // decode the jwt token sent from the client
    // get the user id from the token
    // update the user pin
    // return success message
    console.log(resetPinDto);
    return { message: 'User pin updated successfully' };
  }
  async signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
    return access_token;
  }
}
