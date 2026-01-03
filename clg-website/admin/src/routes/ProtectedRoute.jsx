const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("role");

  if (!role || role !== allowedRole) {
    window.location.href = "http://localhost:3000";
    return null;
  }

  return children;
};

export default ProtectedRoute;
