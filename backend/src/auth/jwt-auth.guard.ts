import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// @Injectable: ทำให้สามารถใช้เป็น Guard ได้
// JwtAuthGuard: Guard สำหรับป้องกัน routes ที่ต้องการ authentication
// extends AuthGuard('jwt'): ใช้ strategy ชื่อ 'jwt' (JwtStrategy)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
