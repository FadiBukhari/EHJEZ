import { useEffect } from "react";
import useAuthStore from "../useStore";
import API from "../services/api";

/**
 * Hook to initialize authentication state on app load
 * Verifies the HTTP-only cookie and fetches user data from backend
 */
const useAuthInit = () => {
  const { setLoading, login, logout } = useAuthStore();

  useEffect(() => {
    // Clear any old persisted auth data from localStorage
    // This ensures no sensitive data remains from previous implementation
    const oldAuthData = localStorage.getItem("auth-storage");
    if (oldAuthData) {
      localStorage.removeItem("auth-storage");
    }

    const verifyAuth = async () => {
      try {
        // This will send the HTTP-only cookie automatically
        const response = await API.get("/users/verify");

        // User data comes from JWT token (verified by backend)
        login(response.data.user);
      } catch {
        // No valid session - user is not logged in
        logout();
      }
    };

    verifyAuth();
  }, [login, logout, setLoading]);
};

export default useAuthInit;
