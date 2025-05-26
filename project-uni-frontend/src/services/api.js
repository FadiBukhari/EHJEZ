import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../useStore";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore.getState();
    const status = error.response?.status;

    if (status === 404) {
      toast.error("Invalid Credentials. Please try again.");
    } else if (status === 401 || status === 403) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      authStore.logout();
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
