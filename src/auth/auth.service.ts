import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { LoginDto, RegisterDto, ForgotPasswordDto, UpdatePinDto } from './dto';
import { DatabaseService } from '../database/database.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../notification/mail/mail.service';
import { randomBytes, createHash } from 'crypto';
import { UserRole } from '@prisma/client';
import { ResponseStatus } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    private database: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
    private notification: MailService,
  ) {}
  async register(dto: RegisterDto) {
    console.log('---->>> Running auth -------<<<<<<<');
    const hash = await argon.hash(dto.password);
    try {
      console.log(hash);
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
      console.log(user);
      await this.database.professional_details.create({
        data: {
          status: 'NOT_LOOKING',
          userId: user.id,
          experienceLevel: 'JUNIOR',
          yearsOfExperience: 0,
        },
      });
      const token = await this.signToken(user.id, dto.email);
      console.log(token);
      await this.notification.sendMailWithMailJet(
        dto.email,
        'Welcome to the pool',
        `
       <div>
       <p> Hi ${dto.email},<br/> Welcome to the pool</p>
       <p>
       Please click the link below to verify your email address.
       your magic link is:<a href="https://pool-app-ss7a.onrender.com/api/v1/auth/magic-link/register?token=${token}"> Here </a>
       </p>
        <br>
        Thank you for joining us.
        <br>
       Regards,
       The pool team.
       </div>
        `,
      );
      return { token };
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
  async login(loginDto: LoginDto): Promise<ResponseStatus> {
    try {
      const user = await this.database.personal_details.findUnique({
        where: {
          email: loginDto.email.trim(),
        },
        include: {
          user: {
            select: {
              roleId: true,
            },
          },
        },
      });
      console.log(user);
      if (!user) {
        throw new ForbiddenException('Invalid credentials');
      }
      const isPasswordValid = await argon.verify(user.pin, loginDto.password);
      if (!isPasswordValid) {
        throw new ForbiddenException('Invalid credentials');
      }
      const token = await this.signToken(user.userId, user.email);
      return {
        message: 'User login successfully',
        success: true,
        data: {
          token,
          role: user.user.roleId,
        },
      };
    } catch (error) {
      Logger.log(error);
      throw new BadRequestException('Error logging in');
    }
  }
  async forgotPin(resetPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.database.personal_details.findUnique({
        where: { email: resetPasswordDto.email },
      });
      if (!user) {
        return {
          message: 'Link to reset password have been sent to provided email',
        };
      }
      const resetToken = this.createResetToken();

      await this.database.passwordResetToken.create({
        data: {
          token: resetToken,
          userId: user.userId,
        },
      });

      await this.notification.sendMailWithMailJet(
        user.email,
        'Password Reset Request',
        `<p>Hi ${user.email},</p><p>You requested to update your password </br> Please click the link below to update your pin. This link is valid for 1 hour</p><p>
        the link is <a href="https://pool-app-ss7a.onrender.com/api/v1/auth/magic-link/update-pin?token=${resetToken}"> here</a>
        </p><p>Regards,</p><p>The pool team</p>`,
      );
      return {
        message: 'Link to reset password have been sent to provided email',
        resetToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updatePin(updatePinDto: UpdatePinDto, token: string) {
    // get the token and hash it, then check if it exists in the database
    // if it does not exist, return error message that the token is invalid
    // if it exists, check if it has expired
    // if it has expired, return error message that the token has expired
    // if it has not expired, update the user password and return success message
    // delete the token
    try {
      if (updatePinDto.password !== updatePinDto.confirmPin) {
        throw new BadRequestException('The pin does not match');
      }
      const resetPasswordToken =
        await this.database.passwordResetToken.findUnique({
          where: { token },
        });
      if (!resetPasswordToken) {
        throw new BadRequestException('Invalid password reset token');
      }
      const TOKEN_EXPIRY_DURATION = 60 * 60 * 1000; /* ms */
      const tokenExpiryTime =
        resetPasswordToken.createdAt.getTime() + TOKEN_EXPIRY_DURATION;
      if (tokenExpiryTime < Date.now()) {
        throw new BadRequestException('The token has expired');
      }
      return this.database.$transaction(async (tx) => {
        const allTokensForUser = await tx.passwordResetToken.findMany({
          where: { userId: resetPasswordToken.userId },
        });
        let matchedRow: { token: string; userId: number; createdAt: Date };
        for (const row of allTokensForUser) {
          if (row.token === token) {
            matchedRow = row;
          }
        }
        if (!matchedRow) {
          await tx.passwordResetToken.deleteMany({
            where: { userId: resetPasswordToken.userId },
          });
          throw new BadRequestException('Invalid password reset token');
        }

        const hash = await argon.hash(updatePinDto.password);
        await this.database.personal_details.update({
          where: { userId: matchedRow.userId },
          data: { pin: hash },
        });
        tx.passwordResetToken.deleteMany({
          where: { userId: resetPasswordToken.userId },
        });
        return { message: 'User pin updated successfully' };
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '4h',
      secret: this.config.get('JWT_SECRET'),
    });
    return access_token;
  }
  async hashResetToken(token: string) {
    return createHash(token).digest('hex');
  }
  createResetToken(length: number = 32) {
    const token = randomBytes(length).toString('hex');
    return token;
  }

  async verifyResetToken(token: string, hash: string) {
    const hashedToken = await this.hashResetToken(token);
    return hashedToken === hash;
  }
  async refresh(userId, req) {
    console.log(userId, req);
    const user = await this.database.personal_details.findUnique({
      where: { userId: userId },
    });
    if (!user) {
      throw new ForbiddenException('Invalid user');
    }
    const token = await this.signToken(user.userId, user.email);
    return { message: 'Token refreshed', token };
  }
}
