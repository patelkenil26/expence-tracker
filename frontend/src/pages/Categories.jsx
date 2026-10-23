// src/pages/Categories.jsx
import React, { useState } from "react";
import { FiTag, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { formatCurrency } from "../utils/format";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

import { useCategoriesData } from "../hooks/useCategoriesData";
import CategoryForm from "../components/category/CategoryForm";
import DeleteConfirm from "../components/category/DeleteConfirm";

function Categories() {
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // TanStack Query custom hook for categories & usage
  const {
    categories: list,
    categoriesLoading,
    usage,
    usageLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoriesData();

  // Merge usage stats with categories
  const usageMap = new Map(usage.map((u) => [u.category, u]));

  const categoriesWithUsage = list.map((cat) => {
    const stat = usageMap.get(cat.name) || { totalIncome: 0, totalExpense: 0 };
    return {
      ...cat,
      totalIncome: stat.totalIncome || 0,
      totalExpense: stat.totalExpense || 0,
    };
  });

  const extraFromUsage = usage
    .filter((u) => !list.some((c) => c.name === u.category))
    .map((u) => ({
      name: u.category,
      type: "unknown",
      color: "#64748b",
      totalIncome: u.totalIncome || 0,
      totalExpense: u.totalExpense || 0,
    }));

  const finalCategoryUsage = [...categoriesWithUsage, ...extraFromUsage];

  const handleSave = async (data) => {
    try {
      if (editCategory) {
        await updateCategory({ id: editCategory._id, data });
      } else {
        await createCategory(data);
      }
      setShowForm(false);
      setEditCategory(null);
    } catch {
      // Handled in TanStack mutation
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget._id);
      setDeleteTarget(null);
    } catch {
      // Handled in TanStack mutation
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <PageHeader
        title="Category Manager"
        subtitle="Organize your income and expense categories, customize tags, and review usage."
        icon={<FiTag />}
        actions={
          <Button
            variant="gradient"
            onClick={() => {
              setEditCategory(null);
              setShowForm(true);
            }}
          >
            <FiPlus />
            <span>Add Category</span>
          </Button>
        }
      />

      {/* Card 1: Custom Categories */}
      <Card
        title="Custom Categories"
        subtitle="Personalized categories created for your transactions"
      >
        {categoriesLoading ? (
          <p className="text-xs text-slate-400 py-4 animate-pulse">
            Loading categories...
          </p>
        ) : list.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs text-slate-400">
              No custom categories yet. Add one to start organizing.
            </p>
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                setEditCategory(null);
                setShowForm(true);
              }}
            >
              Create first category
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {list.map((c) => (
              <div
                key={c._id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:bg-slate-900/60 flex justify-between items-center hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-4 w-4 rounded-full shadow-sm shrink-0"
                    style={{ background: c.color }}
                  />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                    {c.name}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/15 transition cursor-pointer"
                    onClick={() => {
                      setEditCategory(c);
                      setShowForm(true);
                    }}
                    title="Edit category"
                  >
                    <FiEdit className="text-xs" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    onClick={() => setDeleteTarget(c)}
                    title="Delete category"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Card 2: Category Usage & Cash Flow */}
      <Card
        title="Category Cash Flow"
        subtitle="Cumulative income and expenses logged per category for this month"
      >
        {usageLoading ? (
          <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
            Loading category metrics...
          </div>
        ) : finalCategoryUsage.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No transactions logged this month yet.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-3 pr-3 font-semibold">Category</th>
                  <th className="py-3 pr-3 font-semibold text-right">Inflow</th>
                  <th className="py-3 pr-3 font-semibold text-right">Outflow</th>
                  <th className="py-3 pr-3 font-semibold text-right">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {finalCategoryUsage.map((cat, i) => {
                  const net = (cat.totalIncome || 0) - (cat.totalExpense || 0);
                  return (
                    <tr
                      key={cat._id || cat.name || i}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 pr-3 font-semibold text-slate-800 dark:text-slate-200">
                        {cat.name}
                      </td>
                      <td className="py-3 pr-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {cat.totalIncome > 0 ? `+${formatCurrency(cat.totalIncome)}` : "—"}
                      </td>
                      <td className="py-3 pr-3 text-right font-bold text-rose-600 dark:text-rose-400">
                        {cat.totalExpense > 0 ? `-${formatCurrency(cat.totalExpense)}` : "—"}
                      </td>
                      <td
                        className={`py-3 pr-3 text-right font-extrabold ${
                          net > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : net < 0
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-slate-400"
                        }`}
                      >
                        {formatCurrency(net)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl p-6 transition-all transform scale-100">
            <h3 className="text-base font-bold text-[var(--color-text-main)] mb-4 pb-2 border-b border-[var(--color-border)]">
              {editCategory ? "Edit Category" : "New Category"}
            </h3>
            <CategoryForm
              initialData={editCategory}
              onSubmit={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditCategory(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteConfirm
          item={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default Categories;
