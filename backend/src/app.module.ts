import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import ormConfig from './config/ormconfig';

// @Module decorator: กำหนดว่า class นี้เป็น NestJS module
// AppModule: Root module หลักของแอพพลิเคชัน
// รวม modules ย่อยทั้งหมดเข้าด้วยกัน
@Module({
  imports: [
    // TypeOrmModule.forRoot: ตั้งค่าการเชื่อมต่อ Database
    // ใช้ config จากไฟล์ ormconfig
    // TypeORM = ORM (Object-Relational Mapping) สำหรับจัดการฐานข้อมูล
    // แปลง JavaScript objects เป็น SQL queries อัตโนมัติ
    TypeOrmModule.forRoot(ormConfig),

    // ArticlesModule: Module จัดการ Articles (CRUD operations)
    // มี Controller, Service, Entity สำหรับ articles
    ArticlesModule,

    // UsersModule: Module จัดการ Users
    // มี Controller, Service, Entity สำหรับ users
    UsersModule,

    // AuthModule: Module จัดการ Authentication
    // Login, Register, JWT token generation
    AuthModule,
  ],
})
export class AppModule {}