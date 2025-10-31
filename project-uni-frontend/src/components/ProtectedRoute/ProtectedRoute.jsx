import { Navigate } from "react-router-dom";
import useAuthStore from "../../useStore";

export function ProtectedRoute({ children, requiredRole }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/signin" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  return children;
}
