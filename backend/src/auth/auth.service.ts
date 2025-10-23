import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

// @Injectable: ทำให้ class นี้สามารถ inject dependencies ได้
// AuthService: จัดการ business logic ทั้งหมดเกี่ยวกับ authentication
@Injectable()
export class AuthService {
  // Constructor: inject dependencies ที่ต้องการใช้
  constructor(
    private usersService: UsersService, // สำหรับจัดการ users
    private jwtService: JwtService, // สำหรับสร้าง JWT token
  ) {}

  // validateUser: ตรวจสอบ username และ password
  // ใช้เมื่อ login
  async validateUser(username: string, pass: string) {
    // หา user จาก username
    const user = await this.usersService.findByUsername(username);
    if (!user) return null; // ไม่เจอ user

    // เปรียบเทียบ password ที่ส่งมากับ hashed password ใน database
    // bcrypt.compare: เปรียบเทียบแบบปลอดภัย
    const matched = await bcrypt.compare(pass, user.password);
    if (!matched) return null; // password ไม่ตรง

    // ถ้าผ่านการตรวจสอบ ลบ password ออกจาก response
    // เพื่อความปลอดภัย (ไม่ส่ง password กลับไป)
    const { password, ...result } = user as any;
    return result; // คืนข้อมูล user ยกเว้น password
  }

  // login: สร้าง JWT access token
  // เรียกหลังจาก validateUser ผ่านแล้ว
  async login(user: any) {
    // สร้าง payload สำหรับ JWT
    // sub = subject (standard JWT claim, ใช้เก็บ user id)
    // username = ชื่อผู้ใช้
    const payload = { sub: user.id, username: user.username };

    // sign: สร้าง JWT token จาก payload
    // ใช้ JWT_SECRET ที่ตั้งไว้ใน JwtModule
    // token จะหมดอายุตาม expiresIn ที่กำหนด
    return { access_token: this.jwtService.sign(payload) };
  }

  // register: สมัครสมาชิกใหม่
  async register(username: string, password: string) {
    // เช็คว่า username มีอยู่แล้วหรือไม่
    const existing = await this.usersService.findByUsername(username);
    if (existing) {
      // ถ้ามีแล้ว throw error
      throw new UnauthorizedException('Username already taken');
    }

    // Hash password ด้วย bcrypt
    // 10 = salt rounds (จำนวนรอบการ hash, ยิ่งเยอะยิ่งปลอดภัยแต่ช้า)
    const hashed = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่ใน database
    const user = await this.usersService.create({
      username,
      password: hashed, // เก็บ hashed password ไม่ใช่ plain text
    });

    // ลบ password ออกจาก response
    const { password: p, ...rest } = user as any;
    return rest; // คืนข้อมูล user ยกเว้น password
  }
}
