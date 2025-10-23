import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "primereact/editor";
import api from "../api/api.jsx";

// ArticleForm: Component สำหรับสร้าง/แก้ไข Article
// ใช้ form เดียวกันทั้ง Create และ Edit โดยเช็คจาก id
const ArticleForm = () => {
  // ดึง id จาก URL parameter (ถ้ามี id = แก้ไข, ไม่มี id = สร้างใหม่)
  const { id } = useParams();

  // สำหรับ navigate ไปหน้าอื่น
  const nav = useNavigate();

  // State เก็บข้อมูล form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishedAt, setPublishedAt] = useState("");

  // ฟังก์ชันกลับไปหน้า index
  const handleBackIndex = () => {
    nav("/index");
  };

  // ฟังก์ชันแปลง Date object เป็น format ที่ใช้กับ input datetime-local
  // datetime-local ต้องการ format: YYYY-MM-DDTHH:mm
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return ""; // ถ้าไม่มีวันที่ คืนค่าว่าง

    const dt = new Date(dateString); // แปลง string เป็น Date object

    // ฟังก์ชันเสริม: เติม 0 ข้างหน้าถ้าเป็นเลขหลักเดียว (1 → 01)
    const pad = (n) => n.toString().padStart(2, "0");

    // สร้าง string format: 2024-03-15T14:30
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(
      dt.getDate()
    )}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  };

  // useEffect: ถ้ามี id แสดงว่าเป็นโหมดแก้ไข
  // ให้ดึงข้อมูล article เดิมมาแสดงใน form
  useEffect(() => {
    if (id) {
      api
        .get(`/articles/${id}`) // ดึงข้อมูล article ตาม id
        .then((response) => {
          // เซ็ตข้อมูลลงใน form
          setTitle(response.data.title);
          setContent(response.data.content);
          setPublishedAt(formatDateTimeLocal(response.data.publishedAt));
        })
        .catch(console.error);
    }
  }, [id]); // ทำงานใหม่เมื่อ id เปลี่ยน

  // ฟังก์ชันเช็ค content
  const isContentEmpty = (htmlContent) => {
    if (!htmlContent) return true;
    const text = htmlContent
      .replace(/<[^>]+>/g, "") // ลบ HTML tags ออก
      .replace(/&nbsp;/g, "") // ลบ non-breaking space
      .trim();
    return text.length === 0;
  };

  // ฟังก์ชันจัดการเมื่อกด submit form
  const handleSubmitCreate = async (event) => {
    event.preventDefault(); // ป้องกัน page refresh

    // ฟังก์ชันเช็ค content ว่างหรือไม่
    if (isContentEmpty(content)) {
      alert("Content must not be empty!");
      return;
    }

    // เตรียมข้อมูลที่จะส่งไป API
    const payload = {
      title,
      content,
      // แปลง datetime-local เป็น ISO string สำหรับ API
      // ถ้าไม่มีวันที่ ให้ส่ง undefined
      publishedAt: publishedAt
        ? new Date(publishedAt).toISOString()
        : undefined,
    };

    try {
      // ถ้ามี id = แก้ไข (PUT)
      // ถ้าไม่มี id = สร้างใหม่ (POST)
      if (id) {
        await api.put(`/articles/${id}`, payload); // อัพเดท
      } else {
        await api.post("/articles", payload); // สร้างใหม่
      }

      // สำเร็จแล้วกลับไปหน้า index
      nav("/index");
    } catch (err) {
      console.error(err);
      alert("Save failed. Make sure you are logged in.");
    }
  };

  return (
    <div className="create-article-container">
      {/* แสดง title ตามโหมด: มี id = Edit, ไม่มี = Create */}
      <h2>{id ? "Edit" : "Create"} Article</h2>

      <form onSubmit={handleSubmitCreate}>
        {/* Input Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required // ต้องกรอก
          />
        </div>

        {/* Input Published Date */}
        <div className="form-group">
          <label>Published At</label>
          <input
            className="form-input"
            type="datetime-local" // input สำหรับเลือกวันและเวลา
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
          />
        </div>

        {/* Textarea Content */}
        <div className="form-group">
          <label>Content</label>
          <Editor
            value={content}
            onChange={(event) => setContent(event.htmlValue)}
            style={{ height: "320px" }}
            required
          />
        </div>

        {/* ปุ่ม Save และ Cancel */}
        <div className="d-flex-end">
          <button className="btn-submit-create-article" type="submit">
            Save
          </button>
          <button
            className="btn-cancel-create-article"
            type="button"
            onClick={handleBackIndex}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
