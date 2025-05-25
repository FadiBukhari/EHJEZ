import { Navigate } from "react-router-dom";
import useAuthStore from "../../useAuthStore";

export function ProtectedRoute({ children, requiredRole }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  return children;
}
