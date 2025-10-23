import { IsNotEmpty, IsString } from 'class-validator';

// LoginDto: Data Transfer Object สำหรับ login
// กำหนดโครงสร้างและ validation rules ของข้อมูลที่รับเข้ามา
export class LoginDto {
  // @IsNotEmpty(): ห้ามเป็นค่าว่าง (null, undefined, "")
  // @IsString(): ต้องเป็น string เท่านั้น
  @IsNotEmpty()
  @IsString()
  username: string;

  // @IsNotEmpty(): ห้ามเป็นค่าว่าง
  // @IsString(): ต้องเป็น string เท่านั้น
  @IsNotEmpty()
  @IsString()
  password: string;
}
