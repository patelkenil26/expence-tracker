// src/hooks/useBudgetsData.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetsApi,
  saveBudgetApi,
  deleteBudgetApi,
  getBudgetProgressApi,
} from "../api/budgetApi";
import toast from "react-hot-toast";

export function useBudgetsData(month, year) {
  const queryClient = useQueryClient();

  // 1. Fetch budgets list
  const budgetsQuery = useQuery({
    queryKey: ["budgets", "list", month, year],
    queryFn: async () => {
      const res = await getBudgetsApi({ month, year });
      return Array.isArray(res.data?.budgets) ? res.data.budgets : [];
    },
  });

  // 2. Fetch budget progress
  const progressQuery = useQuery({
    queryKey: ["budgets", "progress", month, year],
    queryFn: async () => {
      const res = await getBudgetProgressApi({ month, year });
      return Array.isArray(res.data?.summary) ? res.data.summary : [];
    },
  });

  // 3. Save budget mutation
  const saveMutation = useMutation({
    mutationFn: (payload) => saveBudgetApi(payload),
    onSuccess: () => {
      toast.success("Budget saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to save budget.");
    },
  });

  // 4. Delete budget mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBudgetApi(id),
    onSuccess: () => {
      toast.success("Budget limit deleted.");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete budget.");
    },
  });

  return {
    budgets: budgetsQuery.data || [],
    progress: progressQuery.data || [],
    loading: budgetsQuery.isLoading || progressQuery.isLoading,

    saveBudget: saveMutation.mutateAsync,
    saving: saveMutation.isPending,

    deleteBudget: deleteMutation.mutateAsync,
    deleting: deleteMutation.isPending,
  };
}
