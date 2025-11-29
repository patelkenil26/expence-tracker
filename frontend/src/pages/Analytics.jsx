// src/pages/Analytics.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { FiBarChart2 } from "react-icons/fi";
import toast from "react-hot-toast";

import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import { formatCurrency } from "../utils/format";
import { getMonthlyStatsApi, getByCategoryStatsApi } from "../api/statsApi";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function Analytics() {
  const { user } = useSelector((state) => state.auth);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [yearIncomeTotal, setYearIncomeTotal] = useState(0);
  const [yearExpenseTotal, setYearExpenseTotal] = useState(0);

  const [topCategories, setTopCategories] = useState([]);
  const [topCatLoading, setTopCatLoading] = useState(false);

  // ============================
  // Monthly comparison (income vs expense)
  // ============================
  const fetchMonthly = useCallback(async () => {
    try {
      setMonthlyLoading(true);
      const res = await getMonthlyStatsApi({ year: selectedYear });

      const apiData = Array.isArray(res.data?.data) ? res.data.data : [];

      // 12 months ka fixed array banate hain – missing months = 0
      const mapped = MONTH_NAMES.map((label, idx) => {
        const monthNumber = idx + 1;
        const found = apiData.find((m) => m.month === monthNumber) || {};
        return {
          name: label,
          income: found.totalIncome || 0,
          expense: found.totalExpense || 0,
        };
      });

      setMonthlyData(mapped);
      setYearIncomeTotal(res.data?.totalIncome || 0);
      setYearExpenseTotal(res.data?.totalExpense || 0);
    } catch (err) {
      console.error("Monthly analytics error:", err);
      toast.error("Failed to load monthly comparison.");
    } finally {
      setMonthlyLoading(false);
    }
  }, [selectedYear]);

  // ============================
  // Top expense categories (this month)
  // ============================
  const fetchTopCategories = useCallback(async () => {
    try {
      setTopCatLoading(true);
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = selectedYear;

      const res = await getByCategoryStatsApi({
        month,
        year,
        type: "expense",
      });

      const arr = Array.isArray(res.data?.data) ? res.data.data : [];

      const sorted = [...arr].sort(
        (a, b) => (b.totalAmount || 0) - (a.totalAmount || 0)
      );

      setTopCategories(sorted);
    } catch (err) {
      console.error("Top categories error:", err);
      toast.error("Failed to load top expense categories.");
    } finally {
      setTopCatLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    fetchMonthly();
    fetchTopCategories();
  }, [fetchMonthly, fetchTopCategories]);

  const hasMonthlyData = monthlyData.some(
    (m) => m.income > 0 || m.expense > 0
  );

  const totalTopExpense =
    topCategories.reduce((sum, c) => sum + (c.totalAmount || 0), 0) || 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analytics"
        subtitle="Deep dive into your income and expenses over time."
        icon={<FiBarChart2 />}
        actions={
          <select
            className="text-xs sm:text-sm border dark:text-slate-300 border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-900"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 5 }).map((_, idx) => {
              const y = new Date().getFullYear() - idx;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        }
      />

      {/* MONTHLY COMPARISON CARD */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Monthly comparison – {selectedYear}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compare your total income vs expenses month by month.
            </p>
          </div>
          <div className="text-right text-[11px] space-y-0.5">
            <p className="text-emerald-600 dark:text-emerald-400">
              Total income: {formatCurrency(yearIncomeTotal)}
            </p>
            <p className="text-rose-600 dark:text-rose-400">
              Total expense: {formatCurrency(yearExpenseTotal)}
            </p>
          </div>
        </div>

        <div className="h-64">
          {monthlyLoading ? (
            <div className="h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
              Loading monthly stats...
            </div>
          ) : !hasMonthlyData ? (
            <div className="h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
              No monthly stats available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  radius={[4, 4, 0, 0]}
                  fill="#22c55e"
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  radius={[4, 4, 0, 0]}
                  fill="#ef4444"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* TOP EXPENSE CATEGORIES CARD */}
      <Card className="p-4 sm:p-5">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Top expense categories (this month)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            See where most of your money is going in {selectedYear}.
          </p>
        </div>

        {topCatLoading ? (
          <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Loading category stats...
          </div>
        ) : topCategories.length === 0 ? (
          <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
            No expense data for this month.
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            {topCategories.map((cat) => {
              const amount = cat.totalAmount || 0;
              const pct =
                totalTopExpense > 0
                  ? Math.round((amount / totalTopExpense) * 100)
                  : 0;

              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-200">
                      {cat.category}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {formatCurrency(amount)}{" "}
                      <span className="text-[10px] text-slate-400">
                        ({pct}% of top)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Analytics;
