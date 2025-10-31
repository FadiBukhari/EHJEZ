import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../useStore";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Enable sending cookies with requests
});

API.interceptors.request.use((config) => {
  // No need to manually add token - cookies are sent automatically
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore.getState();
    const status = error.response?.status;
    const url = error.config?.url || "";

    // Don't logout for 403 on optional features (like viewing room bookings)
    const isOptionalFeature =
      url.includes("/rooms/") && url.includes("/bookings");

    if (status === 404) {
      toast.error("Invalid Credentials. Please try again.");
    } else if (status === 401) {
      // 401 always means token is invalid or expired
      toast.error("Session expired. Please login again.");
      authStore.logout();
      window.location.href = "/signin";
    } else if (status === 403 && !isOptionalFeature) {
      // 403 means forbidden, but only logout if it's not an optional feature
      toast.error("Session expired. Please login again.");
      authStore.logout();
      window.location.href = "/signin";
    } else if (status === 403 && isOptionalFeature) {
      // Silently ignore 403 for optional features
      // The component will handle it gracefully
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }

    return Promise.reject(error);
  }
);

export default API;
