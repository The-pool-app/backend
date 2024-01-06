import {
  ForbiddenException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto, RegisterDto, ForgotPasswordDto, UpdatePinDto } from './dto';
import { DatabaseService } from '../database/database.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../notification/mail/mail.service';
import { randomBytes } from 'crypto';

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
        `<h1>Welcome to the pool</h1><p>Hi ${
          user.email
        },</p><p>Thank you for joining us. </br> Please click the link below to verify your email address.</p><p>
        your magic link is <a href="${this.config.get(
          'BASE_URL',
        )}/auth/magic-link?token=${token}"> here</a>
        </p><p>Regards,</p><p>The pool team</p>`,
      );
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
  async forgotPin(resetPasswordDto: ForgotPasswordDto) {
    const user = await this.database.user.findUnique({
      where: { email: resetPasswordDto.email },
    });
    if (!user) {
      return {
        message: 'Link to reset password have been sent to provided email',
      };
    }
    const resetToken = this.createResetToken();
    const hash = await this.hashResetToken(resetToken);
    await this.database.passwordResetToken.create({
      data: {
        token: hash,
        userId: user.id,
      },
    });
    await this.notification.sendMailWithResend(
      user.email,
      'Password Reset Request',
      `<p>Hi ${user.firstName},</p><p>You requested to update your password </br> Please click the link below to update your pin. This link is valid for 1 hour</p><p>
        the magic link is <a href="http://localhost:3000/auth/update-pin?token=${resetToken}"> here</a>
        </p><p>Regards,</p><p>The pool team</p>`,
    );
    return {
      message: 'Link to reset password have been sent to provided email',
    };
  }
  async updatePin(updatePinDto: UpdatePinDto, token: string) {
    // get the reset password token from url params
    const resetPasswordToken =
      await this.database.passwordResetToken.findUnique({
        where: { token },
      });
    if (!resetPasswordToken) {
      return {
        message: ' The link to reset password has expired or is invalid',
      };
    }
    // compare the token with the one in the password reset tokens table
    const isTokenValid = await this.verifyResetToken(
      token,
      resetPasswordToken.token,
    );
    if (!isTokenValid) {
      return {
        message: ' The link to reset password has expired or is invalid',
      };
    }
    // compare the time the token was created with the current time to check if it has expired
    const ONE_HOUR = 60 * 60 * 1000; /* ms */
    const isTokenExpired =
      resetPasswordToken.createdAt.getTime() + ONE_HOUR < Date.now();
    if (isTokenExpired) {
      return {
        message: ' The link to reset password has expired or is invalid',
      };
    }
    // if token is valid, update the user password

    const hash = await argon.hash(updatePinDto.pin);
    await this.database.user.update({
      where: { id: resetPasswordToken.userId },
      data: { pin: hash },
    });
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
  async hashResetToken(token: string) {
    const hash = await argon.hash(token);
    return hash;
  }
  createResetToken(length: number = 32) {
    const token = randomBytes(length).toString('hex');
    return token;
  }

  async verifyResetToken(token: string, hash: string) {
    const isTokenValid = await argon.verify(hash, token);
    return isTokenValid;
  }
}
