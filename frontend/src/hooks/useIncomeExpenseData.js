// src/hooks/useIncomeExpenseData.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTransactionsApi,
  createTransactionApi,
  deleteTransactionApi,
} from "../api/transactionApi";
import toast from "react-hot-toast";

const getLastNDaysRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const buildChartData = (items = []) => {
  const map = new Map();
  items.forEach((tx) => {
    if (!tx.date) return;
    const d = new Date(tx.date);
    const key = d.toISOString().slice(0, 10);
    map.set(key, (map.get(key) || 0) + tx.amount);
  });

  const sortedKeys = Array.from(map.keys()).sort();
  return sortedKeys.map((key) => {
    const d = new Date(key);
    return {
      dateKey: key,
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      amount: map.get(key),
    };
  });
};

export function useIncomeExpenseData(type = "income") {
  const queryClient = useQueryClient();

  const dataQuery = useQuery({
    queryKey: ["transactions", type, "60days"],
    queryFn: async () => {
      const { start, end } = getLastNDaysRange(60);
      const res = await getTransactionsApi({
        type,
        startDate: start,
        endDate: end,
        sort: "desc",
        limit: 500,
      });

      const list = Array.isArray(res.data?.data) || Array.isArray(res.data?.transaction)
        ? res.data.data || res.data.transaction
        : [];

      return {
        list,
        chartData: buildChartData(list),
        total: list.reduce((sum, tx) => sum + (tx.amount || 0), 0),
      };
    },
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (formData) => createTransactionApi({ ...formData, type }),
    onSuccess: () => {
      toast.success(`${type === "income" ? "Income" : "Expense"} added successfully!`);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || `Failed to record ${type}.`);
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTransactionApi(id),
    onSuccess: () => {
      toast.success(`${type === "income" ? "Income" : "Expense"} deleted.`);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: () => {
      toast.error(`Failed to delete ${type}.`);
    },
  });

  return {
    list: dataQuery.data?.list || [],
    chartData: dataQuery.data?.chartData || [],
    total: dataQuery.data?.total || 0,
    loading: dataQuery.isLoading,

    createItem: createMutation.mutateAsync,
    createLoading: createMutation.isPending,

    deleteItem: deleteMutation.mutateAsync,
  };
}
