// src/pages/Analytics.jsx
import React, { useState } from "react";
import { FiBarChart2 } from "react-icons/fi";

import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import { formatCurrency } from "../utils/format";
import { useAnalyticsData } from "../hooks/useAnalyticsData";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function CustomAnalyticsTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-2.5 shadow-lg backdrop-blur-md text-xs space-y-1">
        <p className="font-semibold text-slate-500 dark:text-slate-400">Month: {label}</p>
        {payload.map((item) => (
          <p
            key={item.dataKey}
            className={`font-bold ${
              item.dataKey === "income"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {item.name}: {formatCurrency(item.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function Analytics() {
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  // TanStack Query custom hook for analytics data
  const {
    monthlyData,
    yearIncomeTotal,
    yearExpenseTotal,
    monthlyLoading,
    topCategories,
    categoriesLoading,
  } = useAnalyticsData(selectedYear);

  const hasMonthlyData = monthlyData.some((m) => m.income > 0 || m.expense > 0);
  const totalTopExpense =
    topCategories.reduce((sum, c) => sum + (c.totalAmount || 0), 0) || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <PageHeader
        title="Financial Analytics"
        subtitle="Annual performance comparison, month-over-month trends, and category distribution."
        icon={<FiBarChart2 />}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Year:</span>
            <select
              className="text-xs sm:text-sm border border-[var(--color-border)] rounded-xl px-3 py-1.5 bg-[var(--color-surface)] text-[var(--color-text-main)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
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
          </div>
        }
      />

      {/* Monthly Comparison Card */}
      <Card
        title={`Monthly Comparison — ${selectedYear}`}
        subtitle="Compare total income inflow vs expense outflow month by month"
        action={
          <div className="text-right text-xs space-y-0.5">
            <p className="text-emerald-600 dark:text-emerald-400 font-bold">
              Total Inflow: {formatCurrency(yearIncomeTotal)}
            </p>
            <p className="text-rose-600 dark:text-rose-400 font-bold">
              Total Outflow: {formatCurrency(yearExpenseTotal)}
            </p>
          </div>
        }
      >
        <div className="h-72 w-full pt-2">
          {monthlyLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">
              Loading monthly stats...
            </div>
          ) : !hasMonthlyData ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No monthly activity recorded for {selectedYear}.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  vertical={false}
                />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `₹${val / 1000}k` : `₹${val}`)}
                />
                <Tooltip content={<CustomAnalyticsTooltip />} />
                <Bar dataKey="income" name="Income" radius={[4, 4, 0, 0]} fill="#10b981" maxBarSize={24} />
                <Bar dataKey="expense" name="Expense" radius={[4, 4, 0, 0]} fill="#f43f5e" maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Top Expense Categories Card */}
      <Card
        title="Top Outflow Categories"
        subtitle={`Leading expense destinations in ${selectedYear}`}
      >
        {categoriesLoading ? (
          <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
            Loading category stats...
          </div>
        ) : topCategories.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No expense data available for this month.
          </div>
        ) : (
          <div className="space-y-4">
            {topCategories.map((cat) => {
              const amount = cat.totalAmount || 0;
              const pct = totalTopExpense > 0 ? Math.round((amount / totalTopExpense) * 100) : 0;

              return (
                <div key={cat.category} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">
                      {cat.category}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {formatCurrency(amount)}{" "}
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({pct}% of leading outflow)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-[var(--color-surface-elevated)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
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
