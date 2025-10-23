import { useState, useEffect, useRef } from "react";
import api from "../api/api.jsx";
import { useNavigate } from "react-router-dom";
import { FaUser, FaKey } from "react-icons/fa";
import Register from "./Register.jsx";

// Login: Component สำหรับหน้า Login
// แสดง form login เมื่อยังไม่ได้ login
// แสดงปุ่ม logout เมื่อ login แล้ว
const Login = () => {
  // State เก็บข้อมูล form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // State เก็บข้อความ error (ถ้า login ไม่สำเร็จ)
  const [error, setError] = useState(null);
  
  // State เช็คสถานะว่า login แล้วหรือยัง
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State ควบคุมการแสดง/ซ่อน Register modal
  const [showRegister, setShowRegister] = useState(false);
  
  // State สำหรับ loading
  const [isLoading, setIsLoading] = useState(false);
  
  // สำหรับ navigate ไปหน้าอื่น
  const nav = useNavigate();

  // useEffect: ตรวจสอบ token ใน localStorage ตอน component mount
  // เพื่อเช็คว่า user เคย login ไว้หรือไม่
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // !! แปลง string เป็น boolean
    // ถ้ามี token (string) → true
    // ถ้าไม่มี token (null) → false
    setIsLoggedIn(!!token);
  }, []); // ทำงานแค่ครั้งเดียวตอนเริ่มต้น

  // ฟังก์ชันล้างข้อมูล form
  const resetForm = () => {
    setUsername("");
    setPassword("");
    setError(null);
  };

  // ฟังก์ชันเปิด Register modal
  const handleRegisterForm = () => {
    resetForm(); // ล้าง form ก่อน
    setShowRegister(true); // เปิด modal
  };

  // ฟังก์ชันจัดการเมื่อกด Login
  const handleSubmitLogin = async (event) => {
    event.preventDefault(); // ป้องกัน page refresh
    setIsLoading(true); // เริ่ม loading
    setError(null); // ล้าง error เก่า
    
    try {
      // ส่งข้อมูล username และ password ไป API
      const response = await api.post("/auth/login", { username, password });
      
      // เก็บ token ที่ได้รับจาก API ลง localStorage
      localStorage.setItem("token", response.data.access_token);
      
      // อัพเดทสถานะว่า login แล้ว
      setIsLoggedIn(true);
      
      // ล้าง form
      setUsername("");
      setPassword("");
      
      // ไปหน้า index (หน้าหลักหลัง login)
      nav("/index");
    } catch (err) {
      // ถ้า login ไม่สำเร็จ แสดง error message
      // ดึง message จาก response หรือใช้ข้อความ default
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false); // หยุด loading ไม่ว่าจะสำเร็จหรือไม่
    }
  };

  // ฟังก์ชัน Logout
  const logout = () => {
    // ลบ token ออกจาก localStorage
    localStorage.removeItem("token");
    
    // เซ็ตสถานะเป็นไม่ได้ login
    setIsLoggedIn(false);
    
    // กลับไปหน้า login (/)
    nav("/");
  };

  return (
    <>
      {/* Login Container */}
      <div className="login-container">
        {/* แสดง form login เฉพาะตอนที่ยังไม่ได้ login */}
        {!isLoggedIn && (
          <form onSubmit={handleSubmitLogin}>
            {/* Header */}
            <h1 className="login-header">Blog Management</h1>
            <h2 className="login-header">Login</h2>
            
            {/* แสดง error message ถ้ามี */}
            {error && <div className="error-message">{error}</div>}
            
            {/* Input Username */}
            <div className="form-group">
              <label>
                <FaUser /> Username
              </label>
              <input
                className="form-input"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isLoading} // disable เมื่อกำลัง loading
                required // ต้องกรอก
              />
            </div>
            
            {/* Input Password */}
            <div className="form-group">
              <label>
                <FaKey /> Password
              </label>
              <input
                className="form-input"
                type="password" // ซ่อนตัวอักษร
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading} // disable เมื่อกำลัง loading
                required // ต้องกรอก
              />
            </div>
            
            {/* ปุ่ม Login และ Create Account */}
            <div className="d-flex-end">
              <button 
                className="btn-submit-login" 
                type="submit"
                disabled={isLoading} // disable เมื่อกำลัง loading
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
              <button
                onClick={handleRegisterForm}
                type="button" // ไม่ submit form
                className="btn-create-account"
                disabled={isLoading} // disable เมื่อกำลัง loading
              >
                Create an account
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Logout Section - แสดงเฉพาะตอน login แล้ว */}
      {isLoggedIn && (
        <div className="logout-container">
          <p>You are logged in.</p>
          <button className="btn-logout" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      )}

      {/* Register Modal */}
      <div>
        <Register
          isOpen={showRegister} // ส่ง state ไปบอกว่าเปิดหรือปิด
          onClose={() => setShowRegister(false)} // ส่งฟังก์ชันปิด modal
        />
      </div>
    </>
  );
};

export default Login;