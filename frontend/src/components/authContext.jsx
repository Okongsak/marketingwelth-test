import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { AuthContext } from "./useAuth.jsx";

// AuthProvider: Component ที่ทำหน้าที่จัดการ Authentication ทั้งหมด
// ครอบ component อื่นๆ เพื่อแชร์ state การ login ให้ทุก component ใช้ได้
export const AuthProvider = ({ children }) => {
  // State เก็บสถานะว่า user login แล้วหรือยัง
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State เก็บ token ที่ได้จากการ login
  const [token, setToken] = useState(null);

  // ฟังก์ชันสำหรับ login
  // รับ token เข้ามา แล้วเซ็ตว่า user login แล้ว
  const login = async (tokenValue) => {
    setToken(tokenValue);
    setIsLoggedIn(true);
  };

  // ฟังก์ชันสำหรับ logout
  // ลบ token ทั้งใน state และ localStorage
  // เซ็ตสถานะกลับเป็นไม่ได้ login
  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token"); // ลบ token ออกจาก browser
  };

  // useEffect: ทำงานครั้งเดียวตอน component mount (เริ่มต้นแอพ)
  // เอาไว้เช็คว่ามี token เก่าเหลืออยู่ใน localStorage หรือไม่
  useEffect(() => {
    // ดึง token ที่เคยเก็บไว้จาก localStorage
    const storedToken = localStorage.getItem("token");
    
    // ถ้ามี token อยู่ แสดงว่าเคย login ไว้แล้ว
    // ให้ restore state กลับมา (ไม่ต้อง login ใหม่)
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true); // เซ็ตว่ายัง login อยู่
    } else {
      // ถ้าไม่มี token แสดงว่ายังไม่ได้ login
      setIsLoggedIn(false);
    }
  }, []); // [] หมายความว่าทำงานแค่ครั้งเดียวตอนเริ่มต้น

  // รวมค่าทั้งหมดที่จะแชร์ให้ component อื่นๆ ใช้
  const contextValue = {
    isLoggedIn,  // สถานะว่า login หรือยัง
    token,       // token ปัจจุบัน
    login,       // ฟังก์ชันสำหรับ login
    logout,      // ฟังก์ชันสำหรับ logout
  };

  // Provider: ครอบ children (component ลูก) 
  // ส่ง contextValue ให้ component ลูกทุกตัวเข้าถึงได้ผ่าน useAuth()
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// กำหนด PropTypes เพื่อ validate props
// children ต้องเป็น React node (component, element, text) 
// และต้องมีค่า (required)
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};