import { useState, useEffect, useRef } from "react";
import api from "../api/api.jsx";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaUser, FaKey } from "react-icons/fa";

const Register = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const usernameInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && usernameInputRef.current) {
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
  };

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
    return null;
  };

  const handleSubmitRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", { username, password });
      alert("Registration successful. Please login.");
      handleClose();
      nav("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className="register-background" 
      onClick={handleBackgroundClick}
    >
      <div className="register-container">
        <form onSubmit={handleSubmitRegister}>
          <button 
            onClick={handleClose} 
            className="btn-close-register"
            type="button"
            disabled={isLoading}
          >
            <MdClose />
          </button>
          
          <h2 className="register-header">Register</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>
              <FaUser /> Username
            </label>
            <input
              ref={usernameInputRef}
              type="text"
              className="form-input"
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
              type="password"
              className="form-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
              required
              minLength={8}
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Must be at least 8 characters with uppercase, lowercase, and number
            </small>
          </div>
          
          <div className="form-group">
            <label>
              <FaKey /> Confirm Password
            </label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="d-flex-end">
            <button 
              type="submit" 
              className="btn-submit-register"
              disabled={isLoading}
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