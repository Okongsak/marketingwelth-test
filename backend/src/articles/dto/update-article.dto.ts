import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';

// UpdateArticleDto: Data Transfer Object สำหรับอัพเดท article
// extends PartialType(CreateArticleDto):
//   - สืบทอด fields ทั้งหมดจาก CreateArticleDto
//   - แต่ทำให้ทุก field เป็น optional
//   - สืบทอด validators ทั้งหมด
export class UpdateArticleDto extends PartialType(CreateArticleDto) {}