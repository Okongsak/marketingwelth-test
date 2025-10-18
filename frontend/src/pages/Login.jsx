import { useState, useEffect } from "react";
import api from "../api/api.jsx";
import { useNavigate } from "react-router-dom";
import { FaUser, FaKey } from "react-icons/fa";
import Register from "./Register.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setError(null);
  };

  const handleRegisterForm = () => {
    resetForm();
    setShowRegister(true);
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.access_token);
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
      nav("/index");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    nav("/");
  };

  return (
    <>
      <div className="login-container">
        {!isLoggedIn && (
          <form onSubmit={handleSubmitLogin}>
            <h1 className="login-header">Blog Management</h1>
            <h2 className="login-header">Login</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label>
                <FaUser /> Username
              </label>
              <input
                className="form-input"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="form-group">
              <label>
                <FaKey /> Password
              </label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="d-flex-end">
              <button 
                className="btn-submit-login" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
              <button
                onClick={handleRegisterForm}
                type="button"
                className="btn-create-account"
                disabled={isLoading}
              >
                Create an account
              </button>
            </div>
          </form>
        )}
      </div>

      {isLoggedIn && (
        <div className="logout-container">
          <p>You are logged in.</p>
          <button className="btn-logout" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      )}

      <div>
        <Register
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
        />
      </div>
    </>
  );
};

export default Login;