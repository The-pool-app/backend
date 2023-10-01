import { Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
//import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor() { }
  register(dto: RegisterDto) {
    return 'User registered';
  }
  login(dto: LoginDto) {
    return 'User logged in true';
  }
  //forgotPassword(resetPasswordDto: any) { }
}
