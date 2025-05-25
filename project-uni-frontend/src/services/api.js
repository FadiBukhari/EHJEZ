// services/api.js
import axios from "axios";
import { toast } from "react-toastify"; // Optional: for nice error messages
import useAuthStore from "../useStore"; // Zustand store

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Add token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore.getState();
    const status = error.response?.status;
    console.log("API Error:", error);
    console.log("Status Code:", status);
    if (status === 401 || status === 403) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      authStore.logout(); // Clear Zustand state
      window.location.href = "/signin";
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
