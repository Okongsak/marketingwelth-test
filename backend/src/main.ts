import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// โหลด environment variables จากไฟล์ .env
// ต้องเรียกก่อน bootstrap เพื่อให้ process.env มีค่าพร้อมใช้งาน
dotenv.config();

// ฟังก์ชัน bootstrap: จุดเริ่มต้นของแอพพลิเคชัน NestJS
async function bootstrap() {
  // สร้าง NestJS application instance จาก AppModule
  // AppModule เป็น root module ที่รวม modules อื่นๆ ทั้งหมด
  const app = await NestFactory.create(AppModule);

  // เปิดใช้งาน CORS (Cross-Origin Resource Sharing)
  // เพื่อให้ frontend (React) ที่รันบน port อื่นสามารถเรียก API ได้
  app.enableCors({
    // origin: กำหนด URL ของ frontend ที่อนุญาตให้เรียก API
    // ในที่นี้คือ React app ที่รันบน localhost:5173 (Vite default port)
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',

    // methods: HTTP methods ที่อนุญาต
    // GET = ดึงข้อมูล, POST = สร้าง, PUT = อัพเดท, DELETE = ลบ
    // OPTIONS = preflight request (ใช้สำหรับ CORS checking)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

    // credentials: อนุญาตให้ส่ง cookies และ authentication headers
    // จำเป็นถ้าใช้ JWT token ใน Authorization header
    credentials: true,
  });

  // เริ่มต้น server ฟัง HTTP requests
  // ใช้ PORT จาก environment variable หรือ 3000 ถ้าไม่มี
  await app.listen(process.env.PORT || 3000);

  // แสดง log ว่า server รันบน port ไหน
  console.log(`Server running on ${process.env.PORT || 3000}`);
}

// เรียกใช้ฟังก์ชัน bootstrap เพื่อเริ่มต้นแอพ
bootstrap();