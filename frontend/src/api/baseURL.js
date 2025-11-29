// src/api/baseURL.js
import axios from "axios";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL &&
    import.meta.env.VITE_API_BASE_URL.trim()) ||
  "http://localhost:8000/api";

const baseURL = axios.create({
  baseURL: API_BASE_URL, // ✅ yaha "baseURL" key important hai
  withCredentials: false,
});

// Har request me token add karna
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

export default baseURL;
