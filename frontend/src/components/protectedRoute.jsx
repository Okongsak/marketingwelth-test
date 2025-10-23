import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

// ProtectedRoute: Component สำหรับป้องกันไม่ให้เข้าหน้าที่ต้อง login
// ถ้ายังไม่ login จะ redirect ไปหน้า login
const ProtectedRoute = () => {
  // State สำหรับเช็คว่ากำลังตรวจสอบสิทธิ์อยู่หรือไม่
  // ป้องกันการ flash/กระพริบของหน้าจอก่อนที่จะรู้ว่า login หรือยัง
  const [isChecking, setIsChecking] = useState(true);
  
  // ดึง location ปัจจุบัน เพื่อเช็คว่าอยู่หน้าไหน
  const location = useLocation();

  // useEffect: ทำงานครั้งเดียวตอน component mount
  // เซ็ตว่าเช็คเสร็จแล้ว (จริงๆ ในโค้ดนี้ยังไม่ได้เช็คอะไร แค่ delay เล็กน้อย)
  useEffect(() => {
    setIsChecking(false); // เซ็ตว่าเช็คเสร็จแล้ว
  }, []); // [] = ทำครั้งเดียวตอนเริ่มต้น

  // ถ้ายังกำลังเช็คอยู่ ไม่แสดงอะไรเลย (loading state)
  // ป้องกันการกระพริบหน้าจอ
  if (isChecking) {
    return null; // หรือจะใส่ <Loading /> ก็ได้
  }

  // เช็ค token ใน localStorage
  // ถ้าไม่มี token = ยังไม่ได้ login
  const storedToken = localStorage.getItem("token");
  
  // ถ้าไม่มี token (ไม่ได้ login)
  // redirect ไปหน้า "/" (หน้า login)
  // replace = แทนที่ history ไม่ให้กดปุ่ม back กลับมาได้
  if (!storedToken) {
    return <Navigate to="/" replace />;
  }

  // ถ้า login แล้ว แต่พยายามเข้าหน้า "/" (หน้า login)
  // redirect ไปหน้า "/index" แทน (ป้องกันไม่ให้เข้าหน้า login ซ้ำ)
  if (location.pathname === "/") {
    return <Navigate to="/index" replace />;
  }

  // ถ้าผ่านการตรวจสอบทั้งหมด (มี token และไม่ได้อยู่หน้า login)
  // แสดง component ลูกที่อยู่ใน route นี้ผ่าน <Outlet />
  // Outlet = ตัวแทนของ child routes
  return <Outlet />;
};

export default ProtectedRoute;