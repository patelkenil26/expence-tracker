// src/pages/Budgets.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiTarget, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";

import {
  getBudgetsApi,
  saveBudgetApi,
  deleteBudgetApi,
  getBudgetProgressApi,
} from "../api/budgetApi";

import {
  setBudgets,
  setBudgetProgress,
  setBudgetsLoading,
  setBudgetsError,
} from "../store/budgetsSlice";
import { formatCurrency } from "../utils/format";

const defaultCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

function Budgets() {
  const dispatch = useDispatch();
  const { list, progress, loading } = useSelector((state) => state.budgets);
  const categoriesState = useSelector((state) => state.categories) || {};
  const customCategories = categoriesState.list || [];

  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());

  const [form, setForm] = useState({
    category: "Food",
    amount: "",
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // merge default + custom categories
  const allCategories = useMemo(() => {
    const customNames = customCategories.map((c) => c.name).filter(Boolean);
    const merged = [...defaultCategories];
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

  // ------------ API calls ------------
  const fetchBudgetsAndProgress = async (m = month, y = year) => {
    try {
      dispatch(setBudgetsLoading(true));
      dispatch(setBudgetsError(null));

      const [budgetsRes, progressRes] = await Promise.all([
        getBudgetsApi({ month: m, year: y }),
        getBudgetProgressApi({ month: m, year: y }),
      ]);

      const budgetsData = Array.isArray(budgetsRes.data?.budgets)
        ? budgetsRes.data.budgets
        : [];
      const progressData = Array.isArray(progressRes.data?.summary)
        ? progressRes.data.summary
        : [];

      dispatch(setBudgets(budgetsData));
      dispatch(setBudgetProgress(progressData));
    } catch (err) {
      console.error("Budgets load error:", err);
      dispatch(
        setBudgetsError(
          err?.response?.data?.message || "Failed to load budgets."
        )
      );
      toast.error("Failed to load budgets.");
    } finally {
      dispatch(setBudgetsLoading(false));
    }
  };

  useEffect(() => {
    fetchBudgetsAndProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

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
      setSaving(true);
      await saveBudgetApi({
        category: form.category,
        amount: amountNum,
        month,
        year,
      });

      toast.success("Budget saved successfully.");
      setForm((prev) => ({ ...prev, amount: "" }));
      fetchBudgetsAndProgress(month, year);
    } catch (err) {
      console.error("Save budget error:", err);
      const msg =
        err?.response?.data?.message || "Failed to save budget. Try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;

    try {
      setDeletingId(id);
      await deleteBudgetApi(id);
      toast.success("Budget deleted.");
      fetchBudgetsAndProgress(month, year);
    } catch (err) {
      console.error("Delete budget error:", err);
      toast.error("Failed to delete budget.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setYear(Number(e.target.value));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Budgets"
        subtitle="Set monthly spending limits for each category and track how close you are."
        icon={<FiTarget />}
      />

      {/* Filters & summary */}
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Month</span>
          <select
            value={month}
            onChange={handleMonthChange}
            className="rounded-lg border dark:text-slate-300 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-1 text-xs"
          >
            {[
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
            ].map((mLabel, idx) => (
              <option key={mLabel} value={idx + 1}>
                {mLabel}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">Year</span>
          <select
            value={year}
            onChange={handleYearChange}
            className="rounded-lg border dark:text-slate-300 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2 py-1 text-xs"
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

        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Budgets apply for: {month}/{year}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr,1fr]">
        {/* Form card */}
        <Card className="p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Set category budget
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Choose a category and define how much you want to spend this month.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border   dark:text-slate-300 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
                  label="Budget amount (₹)"
                  name="amount"
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className="dark:text-slate-300"
                />
              </div>
            </div>

            <div className="pt-1">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Save budget"}
              </Button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              If a budget for this category & month already exists, it will be
              updated.
            </p>
          </form>
        </Card>

        {/* Quick summary card */}
        <Card className="p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
            Budget health
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            See which categories are on track and which are close to crossing
            the limit.
          </p>

          {loading ? (
            <div className="py-4 text-[11px] text-slate-500 dark:text-slate-400">
              Loading summary...
            </div>
          ) : rows.length === 0 ? (
            <div className="py-4 text-[11px] text-slate-500 dark:text-slate-400">
              No budgets set for this month yet.
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-auto pr-1">
              {rows.map((row) => {
                const pct = row.percentage || 0;
                let barClass =
                  "h-1.5 rounded-full transition-all duration-300 ";
                if (pct >= 100) {
                  barClass += "bg-rose-500";
                } else if (pct >= 70) {
                  barClass += "bg-amber-500";
                } else {
                  barClass += "bg-emerald-500";
                }

                return (
                  <div key={row._id} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {row.category}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {formatCurrency(row.spent)} /{" "}
                        {formatCurrency(row.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={barClass}
                        style={{ width: `${Math.min(pct, 120)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{pct}% used</span>
                      {pct >= 100 ? (
                        <span className="text-rose-500">
                          Over budget by{" "}
                          {formatCurrency(row.spent - row.amount)}
                        </span>
                      ) : pct >= 70 ? (
                        <span className="text-amber-500">
                          Close to limit – watch spending
                        </span>
                      ) : (
                        <span className="text-emerald-500">
                          On track – within budget
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

      {/* Table of budgets */}
      <Card className="p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          All budgets for {month}/{year}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Manage your category-wise limits. Delete entries you no longer need.
        </p>

        {loading ? (
          <div className="py-4 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Loading budgets...
          </div>
        ) : rows.length === 0 ? (
          <div className="py-4 text-center text-[11px] text-slate-500 dark:text-slate-400">
            No budgets defined yet.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Budget</th>
                  <th className="py-2 pr-3">Spent</th>
                  <th className="py-2 pr-3">Used</th>
                  <th className="py-2 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const pct = row.percentage || 0;
                  return (
                    <tr
                      key={row._id}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="py-2 pr-3 text-slate-700 dark:text-slate-200">
                        {row.category}
                      </td>
                      <td className="py-2 pr-3 text-slate-700 dark:text-slate-200">
                        {formatCurrency(row.amount)}
                      </td>
                      <td className="py-2 pr-3 text-slate-700 dark:text-slate-200">
                        {formatCurrency(row.spent)}
                      </td>
                      <td className="py-2 pr-3 text-slate-700 dark:text-slate-200">
                        {pct}%
                      </td>
                      <td className="py-2 pr-3 text-right">
                        <button
                          onClick={() => handleDelete(row._id)}
                          disabled={deletingId === row._id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-[10px] hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-300"
                        >
                          <FiTrash2 />
                          <span>
                            {deletingId === row._id ? "Deleting..." : "Delete"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Budgets;
