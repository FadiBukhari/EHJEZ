import { useNavigate } from "react-router-dom";
import useAuthStore from "../useStore"; // or wherever your store is

const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return handleLogout;
};

export default useLogout;
