import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  // login check
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
