import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const matched = await bcrypt.compare(pass, user.password);
    if (!matched) return null;
    const { password, ...result } = user as any;
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(username: string, password: string) {
    const existing = await this.usersService.findByUsername(username);
    if (existing) {
      throw new UnauthorizedException('Username already taken');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ 
      username, 
      password: hashed
    });
    const { password: p, ...rest } = user as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return rest;
  }
}
