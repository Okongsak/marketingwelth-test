import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(@InjectRepository(Article) private repo: Repository<Article>) {}
  async create(dto: CreateArticleDto) {
    const entity = this.repo.create({
      title: dto.title,
      content: dto.content,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
    });
    return this.repo.save(entity);
  }
  async findAll(opts: { q?: string; page?: number; limit?: number } = {}) {
    const page = opts.page || 1;
    const limit = opts.limit || 10;
    const queryBuilder = this.repo.createQueryBuilder('a');
    if (opts.q) {
      queryBuilder.andWhere(
        '(a.title ILIKE :q OR a.content ILIKE :q)', 
        { q: `%${opts.q}%` }
      );
    }
    queryBuilder
      .orderBy('a.publishedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [items, total] = await queryBuilder.getManyAndCount();
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // findOne: ดึง article เดียวจาก id
  async findOne(id: string) {
    // findOneBy: หา record ที่ตรงกับเงื่อนไข
    // SELECT * FROM article WHERE id = ?
    const article = await this.repo.findOneBy({ id });
    if (!article) throw new NotFoundException('Article not found');

    return article;
  }

  // update: อัพเดท article
  async update(id: string, dto: UpdateArticleDto) {
    const article = await this.findOne(id);
    if (dto.title !== undefined) article.title = dto.title;
    if (dto.content !== undefined) article.content = dto.content;
    if (dto.publishedAt) article.publishedAt = new Date(dto.publishedAt);
    return this.repo.save(article);
  }

  // remove: ลบ article
  async remove(id: string) {
    const article = await this.findOne(id);
    return this.repo.remove(article);
  }
}
