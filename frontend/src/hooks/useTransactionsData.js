// src/hooks/useTransactionsData.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactionsApi, deleteTransactionApi } from "../api/transactionApi";
import toast from "react-hot-toast";

export function useTransactionsData(filters) {
  const queryClient = useQueryClient();

  const queryParams = {
    limit: 500,
  };
  if (filters.type) queryParams.type = filters.type;
  if (filters.category) queryParams.category = filters.category;
  if (filters.startDate) queryParams.startDate = filters.startDate;
  if (filters.endDate) queryParams.endDate = filters.endDate;
  if (filters.sort === "asc" || filters.sort === "desc") {
    queryParams.sort = filters.sort;
  }

  // TanStack Query for transactions list
  const transactionsQuery = useQuery({
    queryKey: [
      "transactions",
      filters.type,
      filters.category,
      filters.startDate,
      filters.endDate,
      filters.sort === "asc" || filters.sort === "desc" ? filters.sort : "desc",
    ],
    queryFn: async () => {
      const res = await getTransactionsApi(queryParams);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTransactionApi(id),
    onSuccess: () => {
      toast.success("Transaction deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: () => {
      toast.error("Failed to delete transaction.");
    },
  });

  return {
    transactions: transactionsQuery.data || [],
    loading: transactionsQuery.isLoading,
    deleteTransaction: deleteMutation.mutateAsync,
  };
}
