import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// @Controller('auth'): กำหนด base path เป็น /auth
// AuthController: จัดการ HTTP requests เกี่ยวกับ authentication
@Controller('auth')
export class AuthController {
  // Constructor: inject AuthService
  constructor(private auth: AuthService) {}

  // @Post('register'): รับ POST request ที่ /auth/register
  // Endpoint สำหรับสมัครสมาชิก
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // @Body(): ดึงข้อมูลจาก request body
    // dto: Data Transfer Object (validated แล้วด้วย class-validator)

    // เรียก AuthService.register() เพื่อสร้าง user ใหม่
    return this.auth.register(dto.username, dto.password);

    // Response: { id: '...', username: '...', createdAt: '...' }
  }

  // @Post('login'): รับ POST request ที่ /auth/login
  // Endpoint สำหรับ login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    // @Body(): ดึง username และ password จาก request body
    // dto: validated แล้วด้วย class-validator

    // 1. Validate credentials
    const user = await this.auth.validateUser(dto.username, dto.password);

    // 2. ถ้า credentials ไม่ถูกต้อง throw error
    if (!user) throw new Error('Invalid credentials');

    // 3. สร้าง JWT token
    return this.auth.login(user);

    // Response: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
  }
}
