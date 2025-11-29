// src/api/alertsApi.js
import baseURL from "./baseURL";

export const getAlertsApi = (params) => {
  return baseURL.get("/alerts", { params });
};
