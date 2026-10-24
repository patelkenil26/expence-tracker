// src/pages/Budgets.jsx
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FiTarget, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";

import { useBudgetsData } from "../hooks/useBudgetsData";
import { formatCurrency } from "../utils/format";
import { DEFAULT_CATEGORY_NAMES } from "../constants/categories";

function Budgets() {
  const categoriesState = useSelector((state) => state.categories) || {};
  const customCategories = categoriesState.list || [];

  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());

  const [form, setForm] = useState({
    category: "Food",
    amount: "",
  });

  // TanStack Query custom hook for budgets and progress
  const {
    budgets: list,
    progress,
    loading,
    saveBudget,
    saving,
    deleteBudget,
    deleting,
  } = useBudgetsData(month, year);

  // Merge default + custom categories
  const allCategories = useMemo(() => {
    const customNames = customCategories.map((c) => c.name).filter(Boolean);
    const merged = [...DEFAULT_CATEGORY_NAMES];
    customNames.forEach((name) => {
      if (!merged.includes(name)) merged.push(name);
    });
    return merged;
  }, [customCategories]);

  // Map progress by category for quick lookup
  const progressByCategory = useMemo(() => {
    const map = new Map();
    (progress || []).forEach((p) => {
      map.set(p.category, p);
    });
    return map;
  }, [progress]);

  const rows = useMemo(() => {
    return (list || []).map((b) => {
      const p = progressByCategory.get(b.category);
      return {
        ...b,
        spent: p?.spent || 0,
        percentage: p?.percentage || 0,
      };
    });
  }, [list, progressByCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountNum = Number(form.amount);
    if (!form.category || !amountNum || amountNum <= 0) {
      toast.error("Please enter a valid category and amount.");
      return;
    }

    try {
      await saveBudget({
        category: form.category,
        amount: amountNum,
        month,
        year,
      });
      setForm((prev) => ({ ...prev, amount: "" }));
    } catch {
      // Error handled in TanStack mutation
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget limit?")) return;
    try {
      await deleteBudget(id);
    } catch {
      // Error handled in TanStack mutation
    }
  };

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <PageHeader
        title="Budget Limits"
        subtitle="Set category spending limits and monitor threshold health in real-time."
        icon={<FiTarget />}
      />

      {/* Date Pickers Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Month:</span>
            <select
              value={month}
              onChange={handleMonthChange}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] px-3 py-1.5 text-xs outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
            >
              {[
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
              ].map((mLabel, idx) => (
                <option key={mLabel} value={idx + 1}>
                  {mLabel}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Year:</span>
            <select
              value={year}
              onChange={handleYearChange}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] px-3 py-1.5 text-xs outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const y = new Date().getFullYear() - 2 + i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Active Period: {month}/{year}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Set Budget Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            title="Set Category Limit"
            subtitle="Choose a category and define max threshold for the month"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <TextInput
                    label="Budget Limit (INR)"
                    name="amount"
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="gradient" loading={saving}>
                  Save Budget Limit
                </Button>
              </div>

              <p className="text-[11px] text-slate-400">
                If a budget already exists for this category and month, saving will automatically update the threshold.
              </p>
            </form>
          </Card>
        </div>

        {/* Budget Health Overview (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title="Threshold Health"
            subtitle="Live status of category utilization"
          >
            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
                Loading budget health...
              </div>
            ) : rows.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No budgets set for this month yet.
              </div>
            ) : (
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {rows.map((row) => {
                  const pct = Math.round(row.percentage || 0);
                  const isOver = pct >= 100;
                  const isWarning = pct >= 75 && pct < 100;

                  const barColor = isOver
                    ? "bg-rose-500"
                    : isWarning
                    ? "bg-amber-500"
                    : "bg-emerald-500";

                  return (
                    <div key={row._id} className="space-y-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 dark:text-slate-200">
                          {row.category}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {formatCurrency(row.spent)} / {formatCurrency(row.amount)}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        <span>{pct}% utilized</span>
                        {isOver ? (
                          <span className="text-rose-500 font-bold">
                            Over budget by {formatCurrency(row.spent - row.amount)}
                          </span>
                        ) : isWarning ? (
                          <span className="text-amber-500 font-bold">
                            Close to limit
                          </span>
                        ) : (
                          <span className="text-emerald-500 font-bold">
                            On track
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Table of all active budgets */}
      <Card
        title={`All Budgets for ${month}/${year}`}
        subtitle="Manage limits and delete obsolete entries"
      >
        {loading ? (
          <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
            Loading budgets...
          </div>
        ) : rows.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No budgets defined for this month.
          </div>
        ) : (
          <>
            {/* Mobile Card List View (< 640px) */}
            <div className="block sm:hidden space-y-3">
              {rows.map((row) => (
                <div
                  key={row._id}
                  className="p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[var(--color-text-main)]">
                      {row.category}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (row.percentage || 0) >= 100
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                          : (row.percentage || 0) >= 75
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      }`}
                    >
                      {Math.round(row.percentage || 0)}% spent
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[var(--color-border-subtle)]">
                    <div>
                      <span className="text-[11px] text-[var(--color-text-muted)] block">Monthly Limit</span>
                      <span className="font-extrabold text-[var(--color-text-main)]">
                        {formatCurrency(row.amount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[var(--color-text-muted)] block">Spent So Far</span>
                      <span className="font-bold text-slate-600 dark:text-slate-300">
                        {formatCurrency(row.spent)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-[var(--color-border-subtle)]">
                    <button
                      onClick={() => handleDelete(row._id)}
                      disabled={deleting}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition cursor-pointer"
                    >
                      <FiTrash2 className="text-xs" />
                      <span>Delete Budget</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 640px) */}
            <div className="hidden sm:block w-full overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-3 pr-3 font-semibold">Category</th>
                    <th className="py-3 pr-3 font-semibold">Monthly Limit</th>
                    <th className="py-3 pr-3 font-semibold">Amount Spent</th>
                    <th className="py-3 pr-3 font-semibold">Status</th>
                    <th className="py-3 pr-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {rows.map((row) => (
                    <tr
                      key={row._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 pr-3 font-semibold text-slate-800 dark:text-slate-100">
                        {row.category}
                      </td>
                      <td className="py-3 pr-3 font-extrabold text-slate-900 dark:text-slate-100">
                        {formatCurrency(row.amount)}
                      </td>
                      <td className="py-3 pr-3 font-bold text-slate-600 dark:text-slate-300">
                        {formatCurrency(row.spent)}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            (row.percentage || 0) >= 100
                              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                              : (row.percentage || 0) >= 75
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          }`}
                        >
                          {Math.round(row.percentage || 0)}%
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <button
                          onClick={() => handleDelete(row._id)}
                          disabled={deleting}
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition cursor-pointer"
                          title="Delete budget"
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
          </>
        )}
      </Card>
    </div>
  );
}

export default Budgets;
