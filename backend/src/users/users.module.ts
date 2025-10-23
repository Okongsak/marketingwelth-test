import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

// @Module decorator: กำหนดว่า class นี้เป็น NestJS module
// UsersModule: Module สำหรับจัดการ Users ทั้งหมด
@Module({
  imports: [
    // TypeOrmModule.forFeature([User]):
    // ลงทะเบียน User entity เข้ากับ TypeORM ใน module นี้
    // ทำให้สามารถ inject UserRepository ใน service ได้
    // [User] = array ของ entities ที่ต้องการใช้ใน module นี้
    TypeOrmModule.forFeature([User]),
  ],

  // providers: services ที่ใช้ใน module นี้
  // UsersService จะถูกสร้างโดย NestJS Dependency Injection
  providers: [UsersService],

  // exports: ส่งออก UsersService ให้ modules อื่นใช้ได้
  // เช่น AuthModule สามารถ import UsersModule แล้วใช้ UsersService ได้
  exports: [UsersService],
})
export class UsersModule {}