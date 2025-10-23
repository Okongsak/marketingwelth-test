import axios from 'axios';

// สร้าง axios instance พิเศษสำหรับ API ของเรา
// แทนที่จะใช้ axios ตรงๆ เราสร้าง instance ที่มีการตั้งค่าเริ่มต้นเอาไว้
const api = axios.create({
  // URL พื้นฐานของ API
  // ดึงจาก environment variable ชื่อ VITE_API_BASE
  // ถ้าไม่มีให้ใช้ localhost:3000 แทน
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000',
  
  // กำหนด headers เริ่มต้นสำหรับทุก request
  // บอก server ว่าเราส่งข้อมูลเป็น JSON
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: ตัวดักจับ request ก่อนส่งไป server
// ทำงานทุกครั้งที่เรียกใช้ api.get(), api.post(), etc.
api.interceptors.request.use(config => {
  // ดึง token จาก localStorage (token ที่เก็บไว้ตอน login)
  const token = localStorage.getItem('token');
  
  // ถ้ามี token ให้เพิ่ม Authorization header เข้าไปใน request
  // Bearer เป็นประเภทของ authentication ที่นิยมใช้กับ JWT
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  // คืน config ที่แก้ไขแล้วกลับไปเพื่อส่ง request ต่อ
  return config;
});

// export ตัว api instance ออกไปให้ component อื่นใช้งาน
export default api;