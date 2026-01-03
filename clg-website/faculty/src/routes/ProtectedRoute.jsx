import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="http://localhost:3000" />;
  }

  if (role !== allowedRole) {
    return <Navigate to="http://localhost:3000" />;
  }

  return children;
};

export default ProtectedRoute;
