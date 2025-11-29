// src/api/statsApi.js
import baseURL from "./baseURL";

export const getSummaryStatsApi = (params) => {
  return baseURL.get("/stats/summary", { params });
};

export const getByCategoryStatsApi = (params) => {
  return baseURL.get("/stats/by-category", { params });
};

export const getMonthlyStatsApi = (params) => {
  return baseURL.get("/stats/monthly", { params });
};

export const getCategoryUsageStatsApi = (params) => {
  return baseURL.get("/stats/category-usage", { params });
};
