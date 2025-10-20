import { useEffect, useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return null;
  }

  const storedToken = localStorage.getItem("token");
  
  if (!storedToken) {
    return <Navigate to="/" replace />;
  }

  if (location.pathname === "/") {
    return <Navigate to="/index" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;