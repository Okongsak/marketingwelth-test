import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

// @Entity decorator: บอก TypeORM ว่า class นี้คือ database table
// TypeORM จะสร้างตาราง "user" ในฐานข้อมูลโดยอัตโนมัติ
@Entity()
export class User {
  // @PrimaryGeneratedColumn: Primary Key ที่สร้างค่าอัตโนมัติ
  // 'uuid': ใช้ UUID (Universal Unique Identifier) แทนตัวเลข
  // ตัวอย่าง: "550e8400-e29b-41d4-a716-446655440000"
  // ข้อดี: unique ทั่วทั้งระบบ, ปลอดภัยกว่า auto-increment
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column: คอลัมน์ธรรมดาในตาราง
  // { unique: true }: ห้ามมี username ซ้ำกัน
  // Database จะสร้าง unique constraint อัตโนมัติ
  @Column({ unique: true })
  username: string;

  // @Column: เก็บ password (ควรเป็น hashed password)
  // ไม่ควรเก็บ plain text password จริงๆ
  @Column()
  password: string;

  // @CreateDateColumn: บันทึกวันเวลาที่สร้าง record อัตโนมัติ
  // { type: 'timestamp with time zone' }: เก็บเวลาพร้อม timezone
  // TypeORM จะเซ็ตค่าให้อัตโนมัติเมื่อสร้าง user ใหม่
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}