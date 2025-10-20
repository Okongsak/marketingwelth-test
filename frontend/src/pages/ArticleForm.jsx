import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api.jsx";

const ArticleForm = () => {
  const { id } = useParams();
  
  const nav = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishedAt, setPublishedAt] = useState("");

  const handleBackIndex = () => {
    nav("/index");
  };

  const formatDateTimeLocal = (dateString) => {
    
    const dt = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, "0");
    
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(
      dt.getDate()
    )}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  };

  useEffect(() => {
    if (id) {
      api
        .get(`/articles/${id}`)
        .then((response) => {
          setTitle(response.data.title);
          setContent(response.data.content);
          setPublishedAt(formatDateTimeLocal(response.data.publishedAt));
        })
        .catch(console.error);
    }
  }, [id]);

  const handleSubmitCreate = async (event) => {
    event.preventDefault();
    
    const payload = {
      title,
      content,
      publishedAt: publishedAt
        ? new Date(publishedAt).toISOString()
        : undefined,
    };

    try {
      if (id) {
        await api.put(`/articles/${id}`, payload);
      } else {
        await api.post("/articles", payload);
      }
      
      nav("/index");
    } catch (err) {
      console.error(err);
      alert("Save failed. Make sure you are logged in.");
    }
  };

  return (
    <div className="create-article-container">
      <h2>{id ? "Edit" : "Create"} Article</h2>
      
      <form onSubmit={handleSubmitCreate}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-input"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Published At</label>
          <input
            className="form-input"
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            className="form-textarea"
            rows="10"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
        </div>

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