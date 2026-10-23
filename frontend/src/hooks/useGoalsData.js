// src/hooks/useGoalsData.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGoalsApi,
  createGoalApi,
  updateGoalApi,
  deleteGoalApi,
  contributeGoalApi,
} from "../api/goalsApi";
import toast from "react-hot-toast";

export function useGoalsData() {
  const queryClient = useQueryClient();

  // 1. Fetch goals query
  const goalsQuery = useQuery({
    queryKey: ["goals", "list"],
    queryFn: async () => {
      const res = await getGoalsApi();
      return Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.goals)
        ? res.data.goals
        : [];
    },
  });

  // 2. Create goal mutation
  const createMutation = useMutation({
    mutationFn: (payload) => createGoalApi(payload),
    onSuccess: () => {
      toast.success("Savings goal created!");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create goal.");
    },
  });

  // 3. Update goal mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateGoalApi(id, data),
    onSuccess: () => {
      toast.success("Goal updated!");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update goal.");
    },
  });

  // 4. Delete goal mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteGoalApi(id),
    onSuccess: () => {
      toast.success("Goal deleted.");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete goal.");
    },
  });

  // 5. Contribute to goal mutation
  const contributeMutation = useMutation({
    mutationFn: ({ id, amount }) => contributeGoalApi(id, amount),
    onSuccess: () => {
      toast.success("Funds added to goal!");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to add funds.");
    },
  });

  return {
    goals: goalsQuery.data || [],
    loading: goalsQuery.isLoading,

    createGoal: createMutation.mutateAsync,
    creating: createMutation.isPending,

    updateGoal: updateMutation.mutateAsync,
    updating: updateMutation.isPending,

    deleteGoal: deleteMutation.mutateAsync,
    deleting: deleteMutation.isPending,

    addContribution: contributeMutation.mutateAsync,
    contributing: contributeMutation.isPending,
  };
}
