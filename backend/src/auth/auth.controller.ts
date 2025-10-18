import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.username, dto.password);
  }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.username, dto.password);
    if (!user) throw new Error('Invalid credentials');
    return this.auth.login(user);
  }
}
