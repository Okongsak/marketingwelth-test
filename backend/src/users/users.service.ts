import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

// @Injectable decorator: บอก NestJS ว่า class นี้สามารถ inject dependencies ได้
// UsersService: จัดการ business logic เกี่ยวกับ Users
// เป็น layer กลางระหว่าง Controller และ Database
@Injectable()
export class UsersService {
  // Constructor: รับ dependencies ผ่าน Dependency Injection
  constructor(
    // @InjectRepository(User): ขอ UserRepository จาก TypeORM
    // Repository<User>: TypeORM repository สำหรับจัดการตาราง User
    // มี built-in methods เช่น find, findOne, save, delete
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  // ฟังก์ชันค้นหา user จาก username
  // ใช้เมื่อ login หรือเช็คว่า username มีอยู่แล้วหรือไม่
  findByUsername(username: string) {
    // findOneBy: หา record เดียวที่ตรงกับเงื่อนไข
    // { username }: WHERE username = ?
    // คืนค่า User object หรือ null ถ้าไม่เจอ
    return this.repo.findOneBy({ username });
  }

  // ฟังก์ชันค้นหา user จาก id
  // ใช้เมื่อต้องการดึงข้อมูล user จาก JWT token payload
  findById(id: string) {
    // findOneBy: หา record เดียวที่ตรงกับเงื่อนไข
    // { id }: WHERE id = ?
    // คืนค่า User object หรือ null ถ้าไม่เจอ
    return this.repo.findOneBy({ id });
  }

  // ฟังก์ชันสร้าง user ใหม่
  // รับ Partial<User>: object ที่มีบางส่วนของ User properties
  // เช่น { username: "john", password: "hashedPassword" }
  create(user: Partial<User>) {
    // this.repo.create(user):
    // สร้าง User instance (ยังไม่ save ลง database)
    // แปลง plain object เป็น User entity
    const newUser = this.repo.create(user);

    // this.repo.save(newUser):
    // บันทึกลง database (INSERT INTO users ...)
    // คืนค่า User object พร้อม id และ createdAt ที่ถูกสร้าง
    return this.repo.save(newUser);
  }
}