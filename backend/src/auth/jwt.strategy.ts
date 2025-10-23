import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

// @Injectable: ทำให้ class นี้สามารถ inject dependencies ได้
// JwtStrategy: กลยุทธ์สำหรับตรวจสอบ JWT token
// ใช้ร่วมกับ Passport.js
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // เรียก constructor ของ parent class (PassportStrategy)
    // ตั้งค่าวิธีการดึง token และ secret key
    super({
      // jwtFromRequest: บอกว่าจะดึง JWT token จากไหน
      // fromAuthHeaderAsBearerToken(): ดึงจาก Authorization header
      // รูปแบบ: "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // secretOrKey: Secret key สำหรับ verify JWT signature
      // ต้องตรงกับ key ที่ใช้ sign token ตอน login
      secretOrKey: process.env.JWT_SECRET || 'changeme',
    });
  }

  // validate: ฟังก์ชันที่ทำงานหลังจาก JWT ถูก verify สำเร็จ
  // payload: ข้อมูลที่ decode ได้จาก JWT token
  // return: ข้อมูล user ที่จะถูกใส่เข้า request object (req.user)
  async validate(payload: any) {
    // payload.sub = user id (standard JWT claim)
    // payload.username = username
    // return object นี้จะกลายเป็น req.user ใน controller
    return { id: payload.sub, username: payload.username };
  }
}
