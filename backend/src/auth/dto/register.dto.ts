import { IsNotEmpty, IsString, MinLength } from 'class-validator';

// RegisterDto: Data Transfer Object สำหรับ register
// เพิ่ม validation @MinLength เพิ่มจาก LoginDto
export class RegisterDto {
  // @IsNotEmpty(): ห้ามเป็นค่าว่าง
  // @IsString(): ต้องเป็น string
  @IsNotEmpty()
  @IsString()
  username: string;

  // @IsNotEmpty(): ห้ามเป็นค่าว่าง
  // @IsString(): ต้องเป็น string
  // @MinLength(6): ความยาวขั้นต่ำ 6 ตัวอักษร
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
