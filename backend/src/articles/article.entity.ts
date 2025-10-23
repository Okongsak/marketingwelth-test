import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// @Entity decorator: บอก TypeORM ว่า class นี้คือ database table
// TypeORM จะสร้างตาราง "article" ในฐานข้อมูล
@Entity()
export class Article {
  // @PrimaryGeneratedColumn('uuid'): Primary Key แบบ UUID
  // สร้างค่า unique identifier อัตโนมัติ
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({ length: 255 }): คอลัมน์ string ความยาวสูงสุด 255 ตัวอักษร
  // ใช้สำหรับ title (ไม่ควรยาวเกินไป)
  @Column({ length: 255 })
  title: string;

  // @Column('text'): คอลัมน์ text ไม่จำกัดความยาว
  // ใช้สำหรับ content (อาจยาวมาก)
  @Column('text')
  content: string;

  // @CreateDateColumn: บันทึกวันเวลาที่สร้าง record อัตโนมัติ
  // { type: 'timestamp with time zone' }: เก็บเวลาพร้อม timezone
  // แต่ในที่นี้ใช้เป็น publishedAt (วันที่เผยแพร่) ไม่ใช่ createdAt
  // อาจจะดีกว่าถ้าใช้ @Column แทน เพราะต้องการควบคุมค่าเอง
  @CreateDateColumn({ type: 'timestamp with time zone' })
  publishedAt: Date;
}