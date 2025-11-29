// src/api/authApi.js
import baseURL from "./baseURL";

export const signupApi = (data) => {
  return baseURL.post("/auth/signup", data);
};

export const loginApi = (data) => {
  return baseURL.post("/auth/login", data);
};

export const getMeApi = () => {
  return baseURL.get("/auth/me");
};

export const logoutApi = () => {
  return baseURL.post("/auth/logout");
};

export const updateProfileApi = (data) => baseURL.patch("/auth/profile", data);
export const changePasswordApi = (data) =>
  baseURL.patch("/auth/change-password", data);
