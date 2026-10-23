// src/hooks/useDashboardData.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSummaryStatsApi, getByCategoryStatsApi } from "../api/statsApi";
import { getTransactionsApi, createTransactionApi } from "../api/transactionApi";
import { getBudgetProgressApi } from "../api/budgetApi";
import { getAlertsApi } from "../api/alertsApi";
import toast from "react-hot-toast";

// Helper for date ranges
const getLastNDaysRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const buildDailyChartData = (items = []) => {
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

/**
 * Senior Architecture Hook: useDashboardData
 * Leverages TanStack Query for caching, parallel queries, background revalidation,
 * and automated cache invalidation.
 */
export function useDashboardData(month, year) {
  const queryClient = useQueryClient();

  // 1. Monthly Summary Stats Query
  const summaryQuery = useQuery({
    queryKey: ["stats", "summary", month, year],
    queryFn: async () => {
      const res = await getSummaryStatsApi({ month, year });
      const data = res.data || {};
      return {
        totalIncome: data.totalIncome || 0,
        totalExpense: data.totalExpense || 0,
        balance: data.balance ?? (data.totalIncome || 0) - (data.totalExpense || 0),
      };
    },
  });

  // 2. Recent Transactions Query
  const recentQuery = useQuery({
    queryKey: ["transactions", "recent"],
    queryFn: async () => {
      const res = await getTransactionsApi({ limit: 5, sort: "desc" });
      return Array.isArray(res.data?.data) || Array.isArray(res.data?.transaction)
        ? res.data.data || res.data.transaction
        : [];
    },
  });

  // 3. 30-Day Expense Trend Chart Query
  const chartQuery = useQuery({
    queryKey: ["transactions", "chart", "30days"],
    queryFn: async () => {
      const { start, end } = getLastNDaysRange(30);
      const res = await getTransactionsApi({
        type: "expense",
        startDate: start,
        endDate: end,
        sort: "asc",
        limit: 500,
      });
      const list = Array.isArray(res.data?.data) || Array.isArray(res.data?.transaction)
        ? res.data.data || res.data.transaction
        : [];
      return buildDailyChartData(list);
    },
  });

  // 4. Category-Wise Stats Query
  const categoryQuery = useQuery({
    queryKey: ["stats", "byCategory", month, year],
    queryFn: async () => {
      const res = await getByCategoryStatsApi({
        month,
        year,
        type: "expense",
      });
      const raw = Array.isArray(res.data?.data) ? res.data.data : [];
      const total = raw.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
      return raw
        .map((item) => ({
          name: item.category || "Other",
          value: item.totalAmount || 0,
          percentage: total > 0 ? Math.round(((item.totalAmount || 0) / total) * 100) : 0,
        }))
        .sort((a, b) => b.value - a.value);
    },
  });

  // 5. Budget Progress Query
  const budgetQuery = useQuery({
    queryKey: ["budgets", "progress", month, year],
    queryFn: async () => {
      const res = await getBudgetProgressApi({ month, year });
      return Array.isArray(res.data?.summary) ? res.data.summary : [];
    },
  });

  // 6. Alerts Query
  const alertsQuery = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const res = await getAlertsApi();
      return res.data?.alerts || { budgets: [], goals: [] };
    },
  });

  // 7. Create Transaction Mutation with Auto Invalidation
  const createMutation = useMutation({
    mutationFn: (formData) => createTransactionApi(formData),
    onSuccess: () => {
      toast.success("Transaction recorded successfully!");
      // Automatically invalidate all related queries so dashboard refreshes instantly
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create transaction.");
    },
  });

  return {
    summary: summaryQuery.data || { totalIncome: 0, totalExpense: 0, balance: 0 },
    summaryLoading: summaryQuery.isLoading,

    recent: recentQuery.data || [],
    recentLoading: recentQuery.isLoading,

    expenseChart: chartQuery.data || [],
    chartLoading: chartQuery.isLoading,

    categoryStats: categoryQuery.data || [],
    categoryLoading: categoryQuery.isLoading,

    budgetProgress: budgetQuery.data || [],
    budgetLoading: budgetQuery.isLoading,

    alerts: alertsQuery.data || { budgets: [], goals: [] },
    alertsLoading: alertsQuery.isLoading,

    createTransaction: createMutation.mutateAsync,
    createLoading: createMutation.isPending,
  };
}
