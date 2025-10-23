import { DataSourceOptions } from 'typeorm';
import { Article } from '../articles/article.entity';
import { User } from '../users/user.entity';
import * as dotenv from 'dotenv';

// โหลด environment variables จากไฟล์ .env
dotenv.config();

// ormConfig: การตั้งค่าการเชื่อมต่อฐานข้อมูล TypeORM
const ormConfig: DataSourceOptions = {
  // type: ประเภทของฐานข้อมูล (PostgreSQL)
  type: 'postgres',
  
  // host: ที่อยู่ของ database server
  // ดึงจาก .env หรือใช้ 'localhost' ถ้าไม่มี
  host: process.env.POSTGRES_HOST || 'localhost',
  
  // port: พอร์ตของ PostgreSQL (default: 5432)
  // + หน้า = แปลง string เป็น number
  port: +(process.env.POSTGRES_PORT || 5432),

  // username: ชื่อผู้ใช้ database
  username: process.env.POSTGRES_USER || 'postgres',
  
  // password: รหัสผ่าน database
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  
  // database: ชื่อฐานข้อมูลที่จะใช้
  database: process.env.POSTGRES_DB || 'blogdb',
  
  // entities: รายการ Entity classes ทั้งหมดที่ใช้ในระบบ
  // TypeORM จะสร้างตารางตาม Entity เหล่านี้
  entities: [Article, User],
  
  // synchronize: ซิงค์ schema อัตโนมัติเมื่อเริ่มแอพ
  // true = TypeORM จะสร้าง/อัพเดทตารางให้ตรงกับ Entity
  // ⚠️ ห้ามใช้ true ใน production! (อาจทำข้อมูลหาย)
  // ใช้เฉพาะตอน development
  synchronize: process.env.TYPEORM_SYNC === 'true',
  
  // logging: แสดง SQL queries ใน console หรือไม่
  // false = ไม่แสดง (ใช้ใน production)
  // true = แสดงทุก query (ใช้ตอน debug)
  logging: false,
};

export default ormConfig;