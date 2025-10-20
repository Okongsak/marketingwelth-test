import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import api from "../api/api.jsx";

const ArticleView = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    api
      .get(`/articles/${id}`)
      .then((response) => setArticle(response.data))
      .catch(console.error);
  }, [id]);

  if (!article) return <div className="container">Loading...</div>;

  const handleDelete = async () => {
    if (!confirm("Delete?")) return;

    try {
      await api.delete(`/articles/${id}`);
      nav("/index");
    } catch (err) {
      alert("Delete failed.", err);
    }
  };

  return (
    <div className="article-view-container">
      <div className="d-flex-start">
        <Link className="back-link" to="/index">
          <TiArrowBack />
          Back
        </Link>
      </div>

      <div className="article-detail">
        <h1 className="article-header">{article.title}</h1>

        <small className="show-time">
          {new Date(article.publishedAt).toLocaleString()}
        </small>

        <div className="article-content">{article.content}</div>
      </div>

      <div className="d-flex-end">
        <button
          className="btn-submit-edit-article"
          type="button"
          onClick={() => nav(`/edit/${id}`)}
        >
          Edit
        </button>

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
