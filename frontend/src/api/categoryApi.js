import baseURL from "./baseURL";

export const getCategoriesApi = () => baseURL.get("/categories");
export const createCategoryApi = (data) => baseURL.post("/categories", data);
export const updateCategoryApi = (id, data) => baseURL.put(`/categories/${id}`, data);
export const deleteCategoryApi = (id) => baseURL.delete(`/categories/${id}`);
