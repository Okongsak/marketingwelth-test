import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

// @Injectable: ทำให้ class นี้สามารถ inject dependencies ได้
// ArticlesService: จัดการ business logic ทั้งหมดเกี่ยวกับ Articles
@Injectable()
export class ArticlesService {
  // Constructor: inject Article Repository
  constructor(
    @InjectRepository(Article) private repo: Repository<Article>
  ) {}

  // create: สร้าง article ใหม่
  async create(dto: CreateArticleDto) {
    // this.repo.create(): สร้าง Article entity instance
    // ยังไม่ได้บันทึกลง database
    const entity = this.repo.create({
      title: dto.title,
      content: dto.content,
      // ถ้ามี publishedAt ให้ใช้ค่าที่ส่งมา
      // ถ้าไม่มีให้ใช้วันเวลาปัจจุบัน
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
    });
    
    // this.repo.save(): บันทึก entity ลง database
    // INSERT INTO article (id, title, content, publishedAt) VALUES (...)
    return this.repo.save(entity);
  }

  // findAll: ดึงรายการ articles ทั้งหมด
  // รองรับ search, pagination
  async findAll(opts: { q?: string; page?: number; limit?: number } = {}) {
    // ตั้งค่า default values
    const page = opts.page || 1;      // หน้าปัจจุบัน (default: 1)
    const limit = opts.limit || 10;   // จำนวนต่อหน้า (default: 10)
    
    // createQueryBuilder: สร้าง SQL query แบบ flexible
    // 'a' = alias สำหรับตาราง article
    const queryBuilder = this.repo.createQueryBuilder('a');
    
    // ถ้ามีคำค้นหา (q) ให้เพิ่มเงื่อนไข WHERE
    if (opts.q) {
      // andWhere: เพิ่มเงื่อนไข WHERE แบบ AND
      // ILIKE: case-insensitive search (PostgreSQL)
      // ค้นหาใน title หรือ content
      // %...%: wildcard สำหรับค้นหาข้อความที่มีคำนี้อยู่
      queryBuilder.andWhere(
        '(a.title ILIKE :q OR a.content ILIKE :q)', 
        { q: `%${opts.q}%` }
      );
    }
    
    // orderBy: เรียงลำดับตาม publishedAt จากใหม่ไปเก่า
    // skip: ข้าม records (สำหรับ pagination)
    //   หน้า 1: skip 0,  หน้า 2: skip 10,  หน้า 3: skip 20
    // take: จำนวน records ที่ดึง (limit)
    queryBuilder
      .orderBy('a.publishedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    // getManyAndCount: ดึงทั้ง items และ total count
    // [items, total] = destructuring array
    const [items, total] = await queryBuilder.getManyAndCount();
    
    // คืนค่า pagination response
    return {
      items,                             // รายการ articles
      total,                             // จำนวนทั้งหมด
      page,                              // หน้าปัจจุบัน
      limit,                             // จำนวนต่อหน้า
      totalPages: Math.ceil(total / limit), // จำนวนหน้าทั้งหมด
    };
  }

  // findOne: ดึง article เดียวจาก id
  async findOne(id: string) {
    // findOneBy: หา record ที่ตรงกับเงื่อนไข
    // SELECT * FROM article WHERE id = ?
    const article = await this.repo.findOneBy({ id });
    
    // ถ้าไม่เจอ throw NotFoundException
    // NestJS จะแปลงเป็น HTTP 404 automatically
    if (!article) throw new NotFoundException('Article not found');
    
    return article;
  }

  // update: อัพเดท article
  async update(id: string, dto: UpdateArticleDto) {
    // หา article ที่ต้องการอัพเดท
    // ถ้าไม่เจอจะ throw NotFoundException จาก findOne()
    const article = await this.findOne(id);
    
    // อัพเดทเฉพาะ fields ที่ส่งมา (partial update)
    // !== undefined: เช็คว่ามีค่าส่งมาหรือไม่ (รวมถึง null)
    if (dto.title !== undefined) article.title = dto.title;
    if (dto.content !== undefined) article.content = dto.content;
    if (dto.publishedAt) article.publishedAt = new Date(dto.publishedAt);
    
    // บันทึกการเปลี่ยนแปลง
    // UPDATE article SET ... WHERE id = ?
    return this.repo.save(article);
  }

  // remove: ลบ article
  async remove(id: string) {
    // หา article ที่ต้องการลบ
    // ถ้าไม่เจอจะ throw NotFoundException
    const article = await this.findOne(id);
    
    // ลบ article ออกจาก database
    // DELETE FROM article WHERE id = ?
    return this.repo.remove(article);
  }
}