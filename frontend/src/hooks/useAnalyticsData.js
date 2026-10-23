// src/hooks/useAnalyticsData.js
import { useQuery } from "@tanstack/react-query";
import { getMonthlyStatsApi, getByCategoryStatsApi } from "../api/statsApi";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function useAnalyticsData(selectedYear) {
  const monthlyQuery = useQuery({
    queryKey: ["analytics", "monthly", selectedYear],
    queryFn: async () => {
      const res = await getMonthlyStatsApi({ year: selectedYear });
      const apiData = Array.isArray(res.data?.data) ? res.data.data : [];

      const mapped = MONTH_NAMES.map((label, idx) => {
        const monthNumber = idx + 1;
        const found = apiData.find((m) => m.month === monthNumber) || {};
        return {
          name: label,
          income: found.totalIncome || 0,
          expense: found.totalExpense || 0,
        };
      });

      return {
        monthlyData: mapped,
        yearIncomeTotal: res.data?.totalIncome || 0,
        yearExpenseTotal: res.data?.totalExpense || 0,
      };
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ["analytics", "topCategories", selectedYear],
    queryFn: async () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const res = await getByCategoryStatsApi({
        month,
        year: selectedYear,
        type: "expense",
      });

      const arr = Array.isArray(res.data?.data) ? res.data.data : [];
      return [...arr].sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0)).slice(0, 5);
    },
  });

  return {
    monthlyData: monthlyQuery.data?.monthlyData || [],
    yearIncomeTotal: monthlyQuery.data?.yearIncomeTotal || 0,
    yearExpenseTotal: monthlyQuery.data?.yearExpenseTotal || 0,
    monthlyLoading: monthlyQuery.isLoading,

    topCategories: categoriesQuery.data || [],
    categoriesLoading: categoriesQuery.isLoading,
  };
}
