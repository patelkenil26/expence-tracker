// src/api/budgetApi.js
import baseURL from "./baseURL";

export const getBudgetsApi = (params) => {
  return baseURL.get("/budgets", { params });
};

export const saveBudgetApi = (data) => {
  return baseURL.post("/budgets", data);
};

export const deleteBudgetApi = (id) => {
  return baseURL.delete(`/budgets/${id}`);
};

export const getBudgetProgressApi = (params) => {
  return baseURL.get("/budgets/progress", { params });
};
