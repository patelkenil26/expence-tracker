// src/hooks/useCategoriesData.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../api/categoryApi";
import { getCategoryUsageStatsApi } from "../api/statsApi";
import toast from "react-hot-toast";

export function useCategoriesData() {
  const queryClient = useQueryClient();

  // 1. Fetch categories
  const categoriesQuery = useQuery({
    queryKey: ["categories", "list"],
    queryFn: async () => {
      const res = await getCategoriesApi();
      return Array.isArray(res.data?.categories) ? res.data.categories : [];
    },
  });

  // 2. Fetch usage stats
  const usageQuery = useQuery({
    queryKey: ["categories", "usage"],
    queryFn: async () => {
      const res = await getCategoryUsageStatsApi();
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
  });

  // 3. Create category mutation
  const createMutation = useMutation({
    mutationFn: (payload) => createCategoryApi(payload),
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create category.");
    },
  });

  // 4. Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategoryApi(id, data),
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update category.");
    },
  });

  // 5. Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCategoryApi(id),
    onSuccess: () => {
      toast.success("Category deleted.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete category.");
    },
  });

  return {
    categories: categoriesQuery.data || [],
    categoriesLoading: categoriesQuery.isLoading,

    usage: usageQuery.data || [],
    usageLoading: usageQuery.isLoading,

    createCategory: createMutation.mutateAsync,
    creating: createMutation.isPending,

    updateCategory: updateMutation.mutateAsync,
    updating: updateMutation.isPending,

    deleteCategory: deleteMutation.mutateAsync,
    deleting: deleteMutation.isPending,
  };
}
