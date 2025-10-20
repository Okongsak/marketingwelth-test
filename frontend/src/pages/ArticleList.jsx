import { useEffect, useState } from "react";
import api from "../api/api.jsx";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoCreate } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Login from "./Login.jsx";

const ArticleList = () => {
  const [data, setData] = useState({
    items: [],        // รายการ articles
    total: 0,         // จำนวนทั้งหมด
    page: 1,          // หน้าปัจจุบัน
    limit: 3,         // จำนวนต่อหน้า
    totalPages: 1,    // จำนวนหน้าทั้งหมด
  });

  const [searchQuery, setSearchQuery] = useState("");
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get("page") || "1", 10);
  
  const limit = 3;
  
  const query = searchParams.get("q") || "";

  useEffect(() => {
    setSearchQuery(query);
    
    const params = { page, limit };
    if (query) params.q = query;
    
    api
      .get("/articles", { params })
      .then((response) => setData(response.data))
      .catch(console.error);
  }, [page, query]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchParams({
      q: searchQuery,
      page: "1",
      limit: String(limit),
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    
    setSearchParams({
      page: "1",
      limit: String(limit),
    });
  };

  return (
    <div className="articleList-container">
      <Login />
      
      <div className="show-articleList-section">
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

        <div className="create-article-link">
          <Link to="/new">
            <IoCreate />
            Create Article
          </Link>
        </div>

        <ul>
          {data.items.map((article) => (
            <li key={article.id}>
              <h2 className="article-name">
                <Link to={`/articles/${article.id}`}>{article.title}</Link>
              </h2>
              
              <small className="show-time">
                {new Date(article.publishedAt).toLocaleString()}
              </small>
              
              <p className="article-sample">
                {article.content.slice(0, 200)}
                {article.content.length > 200 ? "..." : ""}
              </p>
              
              <div className="edit-article-link">
                <Link to={`/edit/${article.id}`}>
                  <MdEdit />
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="pagination-container">
          <span>
            Page {data.page} / {data.totalPages}
          </span>
          
          <div className="btn-pagination-container">
            {Array.from({ length: data.totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              
              return (
                <button
                  type="button"
                  key={pageNumber}
                  onClick={() =>
                    setSearchParams({
                      q: query,
                      page: String(pageNumber),
                      limit: String(limit),
                    })
                  }
                  disabled={pageNumber === data.page}
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