import baseURL from "./baseURL";

export const getGoalsApi = (params) => {
  return baseURL.get("/goals", { params });
};

export const createGoalApi = (data) => {
  return baseURL.post("/goals", data);
};

export const updateGoalApi = (id, data) => {
  return baseURL.put(`/goals/${id}`, data);
};

export const deleteGoalApi = (id) => {
  return baseURL.delete(`/goals/${id}`);
};

export const contributeGoalApi = (id, amount) => {
  return baseURL.patch(`/goals/${id}/contribute`, { amount });
};
