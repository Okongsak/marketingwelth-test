import { createContext, useContext } from "react";

// สร้าง Context สำหรับเก็บข้อมูล Authentication
// Context = พื้นที่กลางสำหรับแชร์ข้อมูลให้ทุก component เข้าถึงได้
// โดยไม่ต้องส่ง props ลงไปทีละชั้น
export const AuthContext = createContext();

// Custom Hook สำหรับใช้ AuthContext ง่ายๆ
// แทนที่จะเขียน useContext(AuthContext) ทุกครั้ง
// ให้เขียนแค่ useAuth() ได้เลย สั้นและอ่านง่ายกว่า
export const useAuth = () => {
  // ดึงค่าจาก AuthContext มาใช้
  return useContext(AuthContext);
};