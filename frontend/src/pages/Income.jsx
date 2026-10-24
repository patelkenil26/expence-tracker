// src/pages/Income.jsx
import React, { useState } from "react";
import { FiTrendingUp, FiPlus, FiTrash2 } from "react-icons/fi";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import TransactionForm from "../components/TransactionForm";
import { useIncomeExpenseData } from "../hooks/useIncomeExpenseData";
import { formatCurrency, formatDate } from "../utils/format";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-2.5 shadow-lg backdrop-blur-md text-xs">
        <p className="font-semibold text-slate-500 dark:text-slate-400">Date: {label}</p>
        <p className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

function Income() {
  const [showAddModal, setShowAddModal] = useState(false);

  // TanStack Query custom hook for income
  const {
    list: incomes,
    chartData,
    total: totalIncome,
    loading,
    createItem: createIncome,
    createLoading,
    deleteItem: deleteIncome,
  } = useIncomeExpenseData("income");

  const handleCreateIncome = async (formData) => {
    try {
      await createIncome(formData);
      setShowAddModal(false);
    } catch {
      // Error handled in TanStack mutation
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!window.confirm("Delete this income entry?")) return;
    try {
      await deleteIncome(id);
    } catch {
      // Error handled in TanStack mutation
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <PageHeader
        title="Income Streams"
        subtitle="Track your earnings, salary credits, and freelance revenue over time."
        icon={<FiTrendingUp />}
        actions={
          <Button variant="gradient" onClick={() => setShowAddModal(true)}>
            <FiPlus />
            <span>Record Income</span>
          </Button>
        }
      />

      {/* Top chart card */}
      <Card
        title="Income Trends (Last 60 Days)"
        subtitle="Daily credited amounts across all revenue sources"
        action={
          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">
              60-Day Inflow
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalIncome)}
            </span>
          </div>
        }
      >
        <div className="h-64 w-full pt-2">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">
              Loading income chart...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No income entries recorded for the last 60 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Tooltip content={<CustomChartTooltip />} />
                <Bar
                  dataKey="amount"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Income Records Table */}
      <Card
        title="Income History"
        subtitle="Detailed log of all salary and revenue transactions"
      >
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
            Loading income entries...
          </div>
        ) : incomes.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs text-slate-400">No income transactions found.</p>
            <Button size="xs" variant="outline" onClick={() => setShowAddModal(true)}>
              Add your first income entry
            </Button>
          </div>
        ) : (
          <div>
            {/* Mobile Card List (< 640px) */}
            <div className="block sm:hidden space-y-2.5">
              {incomes.map((tx) => (
                <div
                  key={tx._id}
                  className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      {tx.category || "Income"}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      {formatDate(tx.date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {tx.note ? (
                        <p className="text-xs text-[var(--color-text-main)] font-medium">
                          {tx.note}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--color-text-muted)] italic">
                          No note
                        </p>
                      )}
                    </div>
                    <p className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(tx.amount)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[var(--color-border-subtle)] flex justify-end">
                    <button
                      onClick={() => handleDeleteIncome(tx._id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-rose-600 hover:border-rose-300 active:scale-95 transition"
                    >
                      <FiTrash2 className="text-xs" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= 640px) */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
                    <th className="py-3 pr-3 font-semibold">Date</th>
                    <th className="py-3 pr-3 font-semibold">Category</th>
                    <th className="py-3 pr-3 font-semibold">Note</th>
                    <th className="py-3 pr-3 font-semibold text-right">Amount</th>
                    <th className="py-3 pr-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  {incomes.map((tx) => (
                    <tr
                      key={tx._id}
                      className="hover:bg-[var(--color-surface-elevated)]/50 transition-colors"
                    >
                      <td className="py-3 pr-3 text-[var(--color-text-main)] whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3 pr-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          {tx.category || "Income"}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-[var(--color-text-muted)] max-w-[200px] truncate">
                        {tx.note || "-"}
                      </td>
                      <td className="py-3 pr-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        +{formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <button
                          onClick={() => handleDeleteIncome(tx._id)}
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition cursor-pointer"
                          title="Delete income"
                        >
                          <FiTrash2 className="text-[10px]" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto transition-all transform scale-100">
            <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-main)] mb-4 pb-3 border-b border-[var(--color-border)]">
              Record New Income
            </h3>
            <TransactionForm
              initialType="income"
              loading={createLoading}
              onSubmit={handleCreateIncome}
              onCancel={() => !createLoading && setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Income;
