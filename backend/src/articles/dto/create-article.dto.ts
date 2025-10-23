import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

// CreateArticleDto: Data Transfer Object สำหรับสร้าง article
// กำหนดโครงสร้างและ validation rules
export class CreateArticleDto {
  // @IsNotEmpty(): ห้ามเป็นค่าว่าง
  // @IsString(): ต้องเป็น string
  @IsNotEmpty() 
  @IsString() 
  title: string;

  // @IsNotEmpty(): ห้ามเป็นค่าว่าง
  // @IsString(): ต้องเป็น string
  @IsNotEmpty() 
  @IsString() 
  content: string;

  // @IsOptional(): field นี้ไม่บังคับ (optional)
  // @IsDateString(): ถ้ามีค่าต้องเป็น date string ที่ valid
  // รูปแบบ: "2025-01-20T14:00:00Z" หรือ "2025-01-20"
  @IsOptional() 
  @IsDateString() 
  publishedAt?: string;
}