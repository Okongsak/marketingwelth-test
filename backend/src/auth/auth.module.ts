import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';

// @Module: กำหนดว่า class นี้เป็น NestJS module
// AuthModule: Module สำหรับจัดการ Authentication ทั้งหมด
@Module({
  imports: [
    // UsersModule: import เพื่อใช้ UsersService
    UsersModule,

    // PassportModule: ระบบ authentication middleware
    // ใช้ร่วมกับ strategies (JWT, Local, OAuth, etc.)
    PassportModule,

    // JwtModule: จัดการ JWT token
    JwtModule.register({
      // secret: key สำหรับ sign และ verify token
      // ⚠️ ต้องเก็บเป็นความลับ! ห้ามเผยแพร่
      secret: process.env.JWT_SECRET || 'changeme',

      // signOptions: ตัวเลือกเมื่อสร้าง token
      // expiresIn: กำหนดอายุของ token
      // '3600s' = 3600 วินาที = 1 ชั่วโมง
      // หมดเวลาแล้วต้อง login ใหม่
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '3600s' },
    }),
  ],

  // providers: services และ strategies ที่ใช้ใน module นี้
  providers: [
    AuthService, // Business logic
    JwtStrategy, // JWT verification strategy
  ],

  // controllers: endpoints ที่เปิดให้เรียกใช้
  controllers: [AuthController], // /auth/login, /auth/register

  // exports: ส่งออก AuthService ให้ modules อื่นใช้ได้
  exports: [AuthService],
})
export class AuthModule {}
