import { useNavigate } from "react-router-dom";
import useAuthStore from "../useStore";
import API from "../services/api";

const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend to clear the HTTP-only cookie
      await API.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state and redirect
      logout();
      navigate("/");
    }
  };

  return handleLogout;
};

export default useLogout;
