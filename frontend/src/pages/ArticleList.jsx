import { useEffect, useState } from "react";
import api from "../api/api.jsx";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Login from "./Login.jsx";

// ArticleList: หน้าแสดงรายการ Article ทั้งหมด
// มีระบบค้นหาและ pagination
const ArticleList = () => {
  // State เก็บข้อมูล articles และข้อมูล pagination
  const [data, setData] = useState({
    items: [],        // รายการ articles
    total: 0,         // จำนวนทั้งหมด
    page: 1,          // หน้าปัจจุบัน
    limit: 3,         // จำนวนต่อหน้า
    totalPages: 1,    // จำนวนหน้าทั้งหมด
  });

  // State เก็บคำค้นหาใน input
  const [searchQuery, setSearchQuery] = useState("");
  
  // จัดการ URL search parameters (?page=1&q=react)
  const [searchParams, setSearchParams] = useSearchParams();
  
  // ดึงค่า page จาก URL (ถ้าไม่มีใช้ "1")
  const page = parseInt(searchParams.get("page") || "1", 10);
  
  // กำหนดจำนวน articles ต่อหน้า
  const limit = 3;
  
  // ดึงคำค้นหาจาก URL (q = query)
  const query = searchParams.get("q") || "";

  // useEffect: ดึงข้อมูล articles เมื่อ page หรือ query เปลี่ยน
  useEffect(() => {
    // sync ค่า query จาก URL มาที่ input
    setSearchQuery(query);
    
    // เตรียม parameters สำหรับส่งไป API
    const params = { page, limit };
    if (query) params.q = query; // ถ้ามีคำค้นหา เพิ่ม q เข้าไป
    
    // เรียก API
    api
      .get("/articles", { params })
      .then((response) => setData(response.data)) // เก็บข้อมูลที่ได้
      .catch(console.error);
  }, [page, query]); // ทำงานใหม่เมื่อ page หรือ query เปลี่ยน

  // ฟังก์ชันจัดการเมื่อกด Search
  const handleSearch = (event) => {
    event.preventDefault();
    
    // อัพเดท URL parameters
    // กลับไปหน้า 1 เสมอเมื่อค้นหาใหม่
    setSearchParams({
      q: searchQuery,           // คำค้นหา
      page: "1",                // reset กลับหน้า 1
      limit: String(limit),     // จำนวนต่อหน้า
    });
  };

  // ฟังก์ชันล้างคำค้นหา
  const clearSearch = () => {
    setSearchQuery("");  // ล้าง input
    
    // reset URL กลับไปหน้า 1 และไม่มีคำค้นหา
    setSearchParams({
      page: "1",
      limit: String(limit),
    });
  };

  return (
    <div className="articleList-container">
      {/* Component Login (อาจจะเป็นปุ่ม logout หรืออะไรก็ได้) */}
      <Login />
      
      <div className="show-articleList-section">
        {/* Header และ Search Bar */}
        <div className="articleList-header">
          <h1>Articles</h1>
          
          <form className="form-search" onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search title or content"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <button className="btn-search" type="submit">
              Search
            </button>
            <button
              className="btn-clear-search"
              type="button"
              onClick={clearSearch}
            >
              Clear
            </button>
          </form>
        </div>

        {/* ลิงก์ไปหน้าสร้าง Article ใหม่ */}
        <div className="create-article-link">
          <Link to="/new">
            <IoCreate />
            Create Article
          </Link>
        </div>

        {/* แสดงรายการ Articles */}
        <ul>
          {data.items.map((article) => (
            <li key={article.id}>
              {/* ชื่อ Article (คลิกไปดูรายละเอียด) */}
              <h2 className="article-name">
                <Link to={`/articles/${article.id}`}>{article.title}</Link>
              </h2>
              
              {/* แสดงวันที่เผยแพร่ */}
              <small className="show-time">
                {new Date(article.publishedAt).toLocaleString()}
              </small>
              
              {/* แสดง content ตัวอย่าง 200 ตัวอักษรแรก */}
              <p className="article-sample">
                {article.content.slice(0, 200)}
                {article.content.length > 200 ? "..." : ""}
              </p>
              
              {/* ลิงก์ไปหน้าแก้ไข */}
              <div className="edit-article-link">
                <Link to={`/edit/${article.id}`}>
                  <MdEdit />
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="pagination-container">
          {/* แสดงหน้าปัจจุบัน / ทั้งหมด */}
          <span>
            Page {data.page} / {data.totalPages}
          </span>
          
          {/* สร้างปุ่มสำหรับแต่ละหน้า */}
          <div className="btn-pagination-container">
            {Array.from({ length: data.totalPages }).map((_, index) => {
              const pageNumber = index + 1; // หน้าเริ่มจาก 1
              
              return (
                <button
                  type="button"
                  key={pageNumber}
                  onClick={() =>
                    // เปลี่ยนหน้า โดยเก็บคำค้นหาไว้
                    setSearchParams({
                      q: query,
                      page: String(pageNumber),
                      limit: String(limit),
                    })
                  }
                  disabled={pageNumber === data.page} // disable ปุ่มหน้าปัจจุบัน
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;