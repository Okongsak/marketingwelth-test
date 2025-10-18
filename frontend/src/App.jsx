import { Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./components/authContext.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import ArticleList from "./pages/ArticleList.jsx";
import ArticleView from "./pages/ArticleView.jsx";
import ArticleForm from "./pages/ArticleForm.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/index" element={<ProtectedRoute />}>
          <Route index element={<ArticleList />} />
        </Route>
        <Route path="/articles/:id" element={<ProtectedRoute />}>
          <Route index element={<ArticleView />} />
        </Route>

        <Route path="/new" element={<ProtectedRoute />}>
          <Route index element={<ArticleForm />} />
        </Route>

        <Route path="/edit/:id" element={<ProtectedRoute />}>
          <Route index element={<ArticleForm />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
