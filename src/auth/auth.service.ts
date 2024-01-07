import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LoginDto, RegisterDto, ForgotPasswordDto, UpdatePinDto } from './dto';
import { DatabaseService } from '../database/database.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../notification/mail/mail.service';
import { randomBytes } from 'crypto';
import { UserRole } from '@prisma/client';

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
          userDetail: {
            create: {
              email: dto.email,
              pin: hash,
            },
          },
          roleId: dto.role as UserRole,
        },
      });
      const token = await this.signToken(user.id, dto.email);
      await this.notification.sendMailWithResend(
        dto.email,
        'Welcome to the pool',
        `<h1>Welcome to the pool</h1><p>Hi ${
          dto.email
        },</p><p>Thank you for joining us. </br> Please click the link below to verify your email address.</p><p>
        your magic link is <a href="${this.config.get(
          'BASE_URL',
        )}/auth/magic-link?token=${token}"> here</a>
        </p><p>Regards,</p><p>The pool team</p>`,
      );
      return { message: 'Magic link sent to email', token };
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
    const user = await this.database.personal_details.findUnique({
      where: {
        email: loginDto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    const isPasswordValid = await argon.verify(user.pin, loginDto.pin);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }
    const token = await this.signToken(user.userId, user.email);
    return { message: 'User login successfully', token };
  }
  async forgotPin(resetPasswordDto: ForgotPasswordDto) {
    const user = await this.database.personal_details.findUnique({
      where: { email: resetPasswordDto.email },
    });
    if (!user) {
      return {
        message: 'Link to reset password have been sent to provided email',
      };
    }
    const resetToken = this.createResetToken();
    console.log('resetToken:', resetToken);
    // const hash = await this.hashResetToken(resetToken);
    await this.database.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.userId,
      },
    });

    await this.notification.sendMailWithResend(
      user.email,
      'Password Reset Request',
      `<p>Hi ${
        user.email
      },</p><p>You requested to update your password </br> Please click the link below to update your pin. This link is valid for 1 hour</p><p>
        the link is <a href="${this.config.get(
          'BASE_URL',
        )}/auth/update-pin?token=${resetToken}"> here</a>
        </p><p>Regards,</p><p>The pool team</p>`,
    );
    return {
      message: 'Link to reset password have been sent to provided email',
      resetToken,
    };
  }
  async updatePin(updatePinDto: UpdatePinDto, token: string) {
    try {
      console.log('updatePinDto:', updatePinDto, 'token:', token);
      const hashedToken = await this.hashResetToken(token);
      const resetPasswordToken =
        await this.database.passwordResetToken.findFirst({
          where: { token: hashedToken },
        });
      console.log(
        'resetPasswordToken:',
        resetPasswordToken.token,
        'hashedToken:',
        hashedToken,
      );
      if (!resetPasswordToken) {
        throw new ForbiddenException('Invalid password reset token');
      }
      const TOKEN_EXPIRY_DURATION = 60 * 60 * 1000; /* ms */
      return this.database.$transaction(async (tx) => {
        // check if token has expired
        // if expired, delete the token and return error message
        // if not expired, update the user password and return success message
        // delete the token
        const deleteAllTokenForAUser = () =>
          tx.passwordResetToken.deleteMany({
            where: { userId: resetPasswordToken.userId },
          });
        const allTokensForUser = await tx.passwordResetToken.findMany({
          where: { userId: resetPasswordToken.userId },
        });
        let matchedRow: { token: string; userId: number; createdAt: Date };
        for (const row of allTokensForUser) {
          if (row.token === hashedToken) {
            matchedRow = row;
          }
        }
        if (!matchedRow) {
          throw new ForbiddenException('Invalid password reset token');
        }
        deleteAllTokenForAUser();

        const tokenExpiryTime =
          matchedRow.createdAt.getTime() + TOKEN_EXPIRY_DURATION;

        console.log(
          `tokenTime: ${tokenExpiryTime}, current time: ${Date.now()}, diff: ${
            tokenExpiryTime - Date.now()
          }`,
        );
        if (tokenExpiryTime < Date.now()) {
          throw new ForbiddenException('The token has expired');
        }

        const hash = await argon.hash(updatePinDto.pin);
        await this.database.personal_details.update({
          where: { userId: matchedRow.userId },
          data: { pin: hash },
        });
        return { message: 'User pin updated successfully' };
      });
    } catch (error) {
      console.log('error:', error);
      throw new BadRequestException('The Pin update failed, please try again');
    }
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
