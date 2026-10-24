// src/pages/Expense.jsx
import React, { useState } from "react";
import { FiTrendingDown, FiPlus, FiTrash2 } from "react-icons/fi";

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
        <p className="font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

function Expense() {
  const [showAddModal, setShowAddModal] = useState(false);

  // TanStack Query custom hook for expense
  const {
    list: expenses,
    chartData,
    total: totalExpense,
    loading,
    createItem: createExpense,
    createLoading,
    deleteItem: deleteExpense,
  } = useIncomeExpenseData("expense");

  const handleCreateExpense = async (formData) => {
    try {
      await createExpense(formData);
      setShowAddModal(false);
    } catch {
      // Error handled in TanStack mutation
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Delete this expense entry?")) return;
    try {
      await deleteExpense(id);
    } catch {
      // Error handled in TanStack mutation
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <PageHeader
        title="Expense Outflow"
        subtitle="Monitor all outgoing spending, categorize costs, and track daily outflow."
        icon={<FiTrendingDown />}
        actions={
          <Button variant="gradient" onClick={() => setShowAddModal(true)}>
            <FiPlus />
            <span>Record Expense</span>
          </Button>
        }
      />

      {/* Top chart card */}
      <Card
        title="Expense Trends (Last 60 Days)"
        subtitle="Daily debited amounts across all spending categories"
        action={
          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">
              60-Day Outflow
            </span>
            <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">
              {formatCurrency(totalExpense)}
            </span>
          </div>
        }
      >
        <div className="h-64 w-full pt-2">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">
              Loading expense chart...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No expense entries recorded for the last 60 days.
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
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Expense Records Table */}
      <Card
        title="Expense Log"
        subtitle="Detailed list of all spending transactions with category tags"
      >
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
            Loading expense entries...
          </div>
        ) : expenses.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs text-slate-400">No expense transactions found.</p>
            <Button size="xs" variant="outline" onClick={() => setShowAddModal(true)}>
              Record your first expense
            </Button>
          </div>
        ) : (
          <div>
            {/* Mobile Card List (< 640px) */}
            <div className="block sm:hidden space-y-2.5">
              {expenses.map((tx) => (
                <div
                  key={tx._id}
                  className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                      {tx.category || "Expense"}
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
                    <p className="font-black text-sm text-rose-600 dark:text-rose-400">
                      -{formatCurrency(tx.amount)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[var(--color-border-subtle)] flex justify-end">
                    <button
                      onClick={() => handleDeleteExpense(tx._id)}
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
                  {expenses.map((tx) => (
                    <tr
                      key={tx._id}
                      className="hover:bg-[var(--color-surface-elevated)]/50 transition-colors"
                    >
                      <td className="py-3 pr-3 text-[var(--color-text-main)] whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3 pr-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                          {tx.category || "Expense"}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-[var(--color-text-muted)] max-w-[200px] truncate">
                        {tx.note || "-"}
                      </td>
                      <td className="py-3 pr-3 text-right font-extrabold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                        -{formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <button
                          onClick={() => handleDeleteExpense(tx._id)}
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition cursor-pointer"
                          title="Delete expense"
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
              Record New Expense
            </h3>
            <TransactionForm
              initialType="expense"
              loading={createLoading}
              onSubmit={handleCreateExpense}
              onCancel={() => !createLoading && setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Expense;
