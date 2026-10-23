// src/components/dashboard/ExpenseTrendsCard.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Card from "../ui/Card";
import { formatCurrency } from "../../utils/format";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-2.5 shadow-lg backdrop-blur-md text-xs">
        <p className="font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

function ExpenseTrendsCard({ data = [], loading }) {
  return (
    <Card
      title="Daily Expense Trends"
      subtitle="Last 30 days spending activity pattern"
    >
      {loading ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400 animate-pulse">
          Loading chart data...
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          No expense records for the last 30 days.
        </div>
      ) : (
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-slate-100 dark:stroke-slate-800"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val >= 1000 ? `₹${val / 1000}k` : `₹${val}`)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

export default ExpenseTrendsCard;
