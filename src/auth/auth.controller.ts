import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, UpdatePinDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
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
  async updatePin(@Body() dto: UpdatePinDto, @Query('token') token: string) {
    return this.authService.updatePin(dto, token);
  }

  @Get(`magic-link/register`)
  async registerRedirect(@Query('token') token: string, @Res() res: Response) {
    const deepLinkURL = `com.thepool.join://auth/magic-link?token=${token}`;
    res.redirect(deepLinkURL);
  }

  @Get('magic-link/update-pin')
  async updatePinRedirect(@Query('token') token: string, @Res() res: Response) {
    const deepLinkURL = `com.thepool.join://auth/update-pin?token=${token}`;
    res.redirect(deepLinkURL);
  }
}
