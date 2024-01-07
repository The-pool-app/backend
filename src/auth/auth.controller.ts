import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, UpdatePinDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import * as argon from 'argon2';
import { DatabaseService } from 'src/database/database.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private database: DatabaseService,
  ) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('register/google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() _req) {
    return;
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Post('forgot-pin')
  async resetPassword(@Body() email: ForgotPasswordDto) {
    return this.authService.forgotPin(email);
  }

  @Post('update-pin')
  @HttpCode(HttpStatus.OK)
  async updatePin(@Body() dto: UpdatePinDto, @Query('token') token) {
    try {
      console.log('updatePinDto:', dto, 'token:', token);
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

        const hash = await argon.hash(dto.pin);
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
    // return this.authService.updatePin(dto, token);
  }
  async hashResetToken(token: string) {
    const hash = await argon.hash(token);
    return hash;
  }
}
