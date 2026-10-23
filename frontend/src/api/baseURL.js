import axios from "axios";
import { API_BASE_URL } from "../config/env.config";

/**
 * Global Axios Client Instance
 * Configured with request authentication interceptors and global 401 session expiry handlers.
 */
const baseURL = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Injects active JWT Bearer token into Authorization header
baseURL.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Gracefully handles 401 session expiry & cleans up storage
baseURL.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path !== "/login" && path !== "/signup" && path !== "/") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default baseURL;
