import { useState, useEffect, useRef } from "react";
import api from "../api/api.jsx";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaUser, FaKey } from "react-icons/fa";

// Register: Component แสดง Modal สำหรับสมัครสมาชิก
// รับ props isOpen (เปิด/ปิด) และ onClose (ฟังก์ชันปิด)
const Register = ({ isOpen, onClose }) => {
  // State เก็บข้อมูล form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // State เก็บข้อความ error
  const [error, setError] = useState(null);
  
  // State สำหรับ loading
  const [isLoading, setIsLoading] = useState(false);
  
  // สำหรับ navigate
  const nav = useNavigate();
  
  // Ref สำหรับ auto-focus ที่ username input
  const usernameInputRef = useRef(null);

  // useEffect: Auto-focus เมื่อเปิด modal
  useEffect(() => {
    if (isOpen && usernameInputRef.current) {
      // Delay เล็กน้อยเพื่อให้ modal แสดงผลเสร็จก่อน
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // ถ้า modal ปิดอยู่ (isOpen = false) ไม่แสดงอะไรเลย
  if (!isOpen) return null;

  // ฟังก์ชันล้างข้อมูล form
  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };

  // ฟังก์ชันปิด modal
  const handleClose = () => {
    if (isLoading) return; // ป้องกันปิดขณะกำลัง loading
    resetForm(); // ล้าง form ก่อนปิด
    onClose(); // เรียกฟังก์ชัน onClose ที่ส่งมาจาก parent
  };

  // ฟังก์ชัน validate password strength
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null; // ผ่านการ validate
  };

  // ฟังก์ชันจัดการเมื่อกด Register
  const handleSubmitRegister = async (event) => {
    event.preventDefault(); // ป้องกัน page refresh
    setIsLoading(true); // เริ่ม loading
    setError(null); // ล้าง error เก่า
    
    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    // เช็คว่า password กับ confirm password ตรงกันไหม
    if (password !== confirmPassword) {
      setError("Passwords do not match"); // แสดง error
      setIsLoading(false);
      return; // หยุดทำงานทันที
    }

    try {
      // ส่งข้อมูล username และ password ไป API
      await api.post("/auth/register", { username, password });
      
      // สมัครสำเร็จ แสดง alert
      alert("Registration successful. Please login.");
      
      // ปิด modal และล้าง form
      handleClose();
      
      // กลับไปหน้า login
      nav("/");
    } catch (err) {
      // ถ้าสมัครไม่สำเร็จ แสดง error message
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false); // หยุด loading ไม่ว่าจะสำเร็จหรือไม่
    }
  };

  // ฟังก์ชันจัดการเมื่อคลิก background (นอก modal)
  const handleBackgroundClick = (event) => {
    // ถ้าคลิกที่ background (ไม่ใช่ modal) ให้ปิด
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    // Background overlay (พื้นหลังมืดๆ)
    // คลิกที่ background สามารถปิด modal ได้
    <div 
      className="register-background" 
      onClick={handleBackgroundClick}
    >
      {/* Modal Container */}
      <div className="register-container">
        <form onSubmit={handleSubmitRegister}>
          {/* ปุ่มปิด modal (X) */}
          <button 
            onClick={handleClose} 
            className="btn-close-register"
            type="button" // ไม่ submit form
            disabled={isLoading} // disable เมื่อกำลัง loading
          >
            <MdClose />
          </button>
          
          {/* Header */}
          <h2 className="register-header">Register</h2>
          
          {/* แสดง error message ถ้ามี */}
          {error && <div className="error-message">{error}</div>}
          
          {/* Input Username */}
          <div className="form-group">
            <label>
              <FaUser /> Username
            </label>
            <input
              ref={usernameInputRef} // ใช้สำหรับ auto-focus
              type="text"
              className="form-input"
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
              type="password" // ซ่อนตัวอักษร
              className="form-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading} // disable เมื่อกำลัง loading
              required // ต้องกรอก
              minLength={8} // ความยาวขั้นต่ำ
            />
            <small style={{ color: '#666', fontSize: '0.85em', marginTop: '4px', display: 'block' }}>
              Must be at least 8 characters with uppercase, lowercase, and number
            </small>
          </div>
          
          {/* Input Confirm Password */}
          <div className="form-group">
            <label>
              <FaKey /> Confirm Password
            </label>
            <input
              type="password" // ซ่อนตัวอักษร
              className="form-input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={isLoading} // disable เมื่อกำลัง loading
              required // ต้องกรอก
            />
          </div>
          
          {/* ปุ่ม Register */}
          <div className="d-flex-end">
            <button 
              type="submit" 
              className="btn-submit-register"
              disabled={isLoading} // disable เมื่อกำลัง loading
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;