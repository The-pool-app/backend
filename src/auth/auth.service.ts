import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { DatabaseService } from 'src/database/database.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private database: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
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
  //forgotPassword(resetPasswordDto: any) { }
  async signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
    return access_token;
  }
}
