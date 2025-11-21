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

        // Check if user is authenticated
        if (response.data.authenticated && response.data.user) {
          login(response.data.user);
        } else {
          // No valid session - user is not logged in
          logout();
        }
      } catch {
        // Error occurred - user is not logged in
        logout();
      }
    };

    verifyAuth();
  }, [login, logout, setLoading]);
};

export default useAuthInit;
