import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('articles'): base path = /articles
// ArticlesController: จัดการ HTTP requests สำหรับ articles
@Controller('articles')
export class ArticlesController {
  // Constructor: inject ArticlesService
  constructor(private readonly svc: ArticlesService) {}

  // @Get(): รับ GET request ที่ /articles
  // Endpoint สำหรับดึงรายการ articles (มี search และ pagination)
  @Get()
  findAll(
    @Query('q') q?: string, // ?q=react
    @Query('page') page = '1', // ?page=2
    @Query('limit') limit = '10', // ?limit=20
  ) {
    // แปลง string เป็น number และ validate
    // Math.max(1, ...): ต้องมากกว่า 1 เสมอ (ป้องกันค่าติดลบ)
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);

    // Math.min(100, ...): จำกัดไม่เกิน 100 (ป้องกัน load มากเกินไป)
    const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));

    // เรียก service เพื่อดึงข้อมูล
    return this.svc.findAll({ q, page: parsedPage, limit: parsedLimit });
  }

  // @Get(':id'): รับ GET request ที่ /articles/:id
  // Endpoint สำหรับดึง article เดียว
  // :id = URL parameter (เช่น /articles/550e8400-e29b-41d4-a716-446655440000)
  @Get(':id')
  findOne(@Param('id') id: string) {
    // @Param('id'): ดึงค่า id จาก URL parameter
    return this.svc.findOne(id);
  }

  // @UseGuards(JwtAuthGuard): ป้องกัน endpoint นี้
  // ต้อง login และมี valid JWT token ถึงจะเรียกได้
  // @Post(): รับ POST request ที่ /articles
  // Endpoint สำหรับสร้าง article ใหม่
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateArticleDto, // ข้อมูลจาก request body
    @Request() req // request object (มี req.user จาก JWT)
  ) {
    // req.user มาจาก JwtStrategy.validate()
    // { id: '...', username: '...' }
    // สามารถเอาไปใช้ได้ เช่น เก็บว่า article นี้สร้างโดยใคร
    return this.svc.create(dto);
  }

  // @UseGuards(JwtAuthGuard): ป้องกัน endpoint นี้
  // @Put(':id'): รับ PUT request ที่ /articles/:id
  // Endpoint สำหรับอัพเดท article
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string, // ดึง id จาก URL
    @Body() dto: UpdateArticleDto, // ข้อมูลที่จะอัพเดท
  ) {
    return this.svc.update(id, dto);
  }

  // @UseGuards(JwtAuthGuard): ป้องกัน endpoint นี้
  // @Delete(':id'): รับ DELETE request ที่ /articles/:id
  // Endpoint สำหรับลบ article
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
