// src/api/transactionApi.js
import baseURL from "./baseURL";

export const getTransactionsApi = (params) =>
  baseURL.get("/transactions", { params });

export const createTransactionApi = (data) =>
  baseURL.post("/transactions", data);

export const updateTransactionApi = (id, data) =>
  baseURL.put(`/transactions/${id}`, data);

export const deleteTransactionApi = (id) =>
  baseURL.delete(`/transactions/${id}`);
