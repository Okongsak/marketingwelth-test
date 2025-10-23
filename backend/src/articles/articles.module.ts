import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article } from './article.entity';

// @Module decorator: กำหนดว่า class นี้เป็น NestJS module
// ArticlesModule: Module สำหรับจัดการ Articles ทั้งหมด
@Module({
  imports: [
    // TypeOrmModule.forFeature([Article]):
    // ลงทะเบียน Article entity เข้ากับ TypeORM
    // ทำให้สามารถ inject ArticleRepository ได้
    TypeOrmModule.forFeature([Article])
  ],
  
  // providers: services ที่ใช้ใน module นี้
  // ArticlesService จะถูกสร้างโดย NestJS DI
  providers: [ArticlesService],
  
  // controllers: endpoints ที่เปิดให้เรียกใช้
  // ArticlesController จัดการ HTTP requests
  controllers: [ArticlesController],
})
export class ArticlesModule {}