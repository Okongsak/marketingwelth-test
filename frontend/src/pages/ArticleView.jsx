import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import api from "../api/api.jsx";

// ArticleView: หน้าแสดงรายละเอียด Article แบบเต็ม
// สามารถแก้ไขหรือลบได้
const ArticleView = () => {
  // ดึง id ของ article จาก URL
  const { id } = useParams();

  // สำหรับ navigate ไปหน้าอื่น
  const nav = useNavigate();

  // State เก็บข้อมูล article
  // เริ่มต้นเป็น null (ยังไม่มีข้อมูล)
  const [article, setArticle] = useState(null);

  // useEffect: ดึงข้อมูล article เมื่อ component mount หรือ id เปลี่ยน
  useEffect(() => {
    api
      .get(`/articles/${id}`) // ดึงข้อมูล article ตาม id
      .then((response) => setArticle(response.data)) // เก็บข้อมูล
      .catch(console.error);
  }, [id]); // ทำงานใหม่เมื่อ id เปลี่ยน

  // ถ้ายังไม่มีข้อมูล (กำลังโหลด) แสดง Loading
  if (!article) return <div className="container">Loading...</div>;

  // ฟังก์ชันลบ Article
  const handleDelete = async () => {
    // ยืนยันก่อนลบ (confirm dialog)
    if (!confirm("Delete?")) return; // ถ้ากด Cancel ให้หยุดทันที

    try {
      // ส่งคำสั่งลบไป API
      await api.delete(`/articles/${id}`);

      // ลบสำเร็จ กลับไปหน้า index
      nav("/index");
    } catch (err) {
      alert("Delete failed.", err);
    }
  };

  return (
    <div className="article-view-container">
      {/* ปุ่ม Back กลับไปหน้า index */}
      <div className="d-flex-start">
        <Link className="back-link" to="/index">
          <TiArrowBack />
          Back
        </Link>
      </div>

      {/* รายละเอียด Article */}
      <div className="article-detail">
        {/* ชื่อ Article */}
        <h1 className="article-header">{article.title}</h1>

        {/* วันที่เผยแพร่ */}
        <small className="show-time">
          {new Date(article.publishedAt).toLocaleString()}
        </small>

        {/* เนื้อหาทั้งหมด */}
        <div className="article-content">{article.content}</div>
      </div>

      {/* ปุ่ม Edit และ Delete */}
      <div className="d-flex-end">
        {/* ปุ่ม Edit: ไปหน้าแก้ไข */}
        <button
          className="btn-submit-edit-article"
          type="button"
          onClick={() => nav(`/edit/${id}`)}
        >
          Edit
        </button>

        {/* ปุ่ม Delete: ลบ Article */}
        <button
          className="btn-delete-article"
          type="button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ArticleView;
