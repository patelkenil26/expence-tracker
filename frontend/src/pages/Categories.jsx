// src/pages/Categories.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiTag, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { getCategoryUsageStatsApi } from "../api/statsApi";
import { formatCurrency } from "../utils/format";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../api/categoryApi";
import { setCategories, setCategoryLoading } from "../store/categorySlice";
import CategoryForm from "../components/category/CategoryForm";
import DeleteConfirm from "../components/category/DeleteConfirm";
import { useCallback } from "react";

function Categories() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.categories);

  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===========================
  // Category usage stats (income + expense per category)
  // ===========================
  const [usage, setUsage] = useState([]);
  const [usageLoading, setUsageLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      dispatch(setCategoryLoading(true));
      const res = await getCategoriesApi();
      dispatch(setCategories(res.data.categories || []));
    } catch {
      toast.error("Failed to load categories");
    } finally {
      dispatch(setCategoryLoading(false));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategoryUsage = useCallback(async () => {
    try {
      setUsageLoading(true);

      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const res = await getCategoryUsageStatsApi({
        scope: "month", // this month only
        month,
        year,
      });

      const arr = Array.isArray(res.data?.data) ? res.data.data : [];
      setUsage(arr);
    } catch (err) {
      console.error("Category usage fetch error:", err);
      // optional: toast.error("Failed to load category usage.");
    } finally {
      setUsageLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoryUsage();
  }, [fetchCategoryUsage]);

  // ===========================
  // Merge: categories master + usage stats
  // ===========================
  // Redux / existing categories list (default + custom)
  const categoriesState = useSelector(
    (state) => state.categories || state.category || { list: [] }
  );
  const { list: categoriesList = [] } = categoriesState;

  // usage ko map bana dete hain fast lookup ke liye
  const usageMap = new Map(
    usage.map((u) => [u.category, u]) // key: category name
  );

  // UI ke liye merge: har category + uska income/expense
  const categoriesWithUsage = categoriesList.map((cat) => {
    const stat = usageMap.get(cat.name) || { totalIncome: 0, totalExpense: 0 };
    return {
      ...cat,
      totalIncome: stat.totalIncome || 0,
      totalExpense: stat.totalExpense || 0,
    };
  });

  // koi aisi categories jo transactions me hain, par categoriesList me nahi
  const extraFromUsage = usage
    .filter((u) => !categoriesList.some((c) => c.name === u.category))
    .map((u) => ({
      name: u.category,
      type: "unknown",
      color: "#64748b",
      totalIncome: u.totalIncome || 0,
      totalExpense: u.totalExpense || 0,
    }));

  const finalCategoryUsage = [...categoriesWithUsage, ...extraFromUsage];

  // ===========================
  // CRUD handlers
  // ===========================
  const handleSave = async (data) => {
    try {
      if (editCategory) {
        await updateCategoryApi(editCategory._id, data);
        toast.success("Category updated");
      } else {
        await createCategoryApi(data);
        toast.success("Category created");
      }
      setShowForm(false);
      setEditCategory(null);
      await fetchCategories();
      await fetchCategoryUsage(); // usage bhi refresh
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategoryApi(deleteTarget._id);
      toast.success("Category deleted");
      setDeleteTarget(null);
      await fetchCategories();
      await fetchCategoryUsage(); // usage bhi refresh
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Categories"
        subtitle="Manage your transaction categories and see income/expense usage."
        icon={<FiTag />}
      />

      {/* ========== CARD 1: CATEGORY LIST (CRUD) ========== */}
      <Card className="p-4 sm:p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Your Categories</h3>
          <Button
            variant="primary"
            onClick={() => {
              setEditCategory(null);
              setShowForm(true);
            }}
          >
            <FiPlus className="mr-1" /> Add Category
          </Button>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 dark:text-slate-300">
            Loading...
          </p>
        ) : list.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-300">
            No categories yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {list.map((c) => (
              <div
                key={c._id}
                className="p-3 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-950 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded"
                    style={{ background: c.color }}
                  />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{c.name}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    className="text-indigo-500 hover:text-indigo-600"
                    onClick={() => {
                      setEditCategory(c);
                      setShowForm(true);
                    }}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="text-rose-500 hover:text-rose-600"
                    onClick={() => setDeleteTarget(c)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ========== CARD 2: CATEGORY-WISE INCOME & EXPENSE ========== */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Category wise income & expense (this month)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How much has been spent this month in each category.
            </p>
          </div>
        </div>

        {usageLoading ? (
          <div className="py-4 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Loading category usage...
          </div>
        ) : finalCategoryUsage.length === 0 ? (
          <div className="py-4 text-center text-[11px] text-slate-500 dark:text-slate-400">
            No transactions received for this month yet.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3 text-right">Total Income</th>
                  <th className="py-2 pr-3 text-right">Total Expense</th>
                  <th className="py-2 pr-3 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {finalCategoryUsage.map((cat) => {
                  const income = cat.totalIncome || 0;
                  const expense = cat.totalExpense || 0;
                  const net = income - expense;

                  return (
                    <tr
                      key={cat._id || cat.name}
                      className="border-b border-slate-100 dark:border-slate-800"
                    >
                      <td className="py-2 pr-3">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: cat.color || "#64748b" }}
                          />
                          <span className="text-slate-800 dark:text-slate-100">
                            {cat.name}
                          </span>
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-slate-500 dark:text-slate-400">
                        {cat.type || "—"}
                      </td>
                      <td className="py-2 pr-3 text-right text-emerald-500">
                        {formatCurrency(income)}
                      </td>
                      <td className="py-2 pr-3 text-right text-rose-500">
                        {formatCurrency(expense)}
                      </td>
                      <td
                        className={
                          "py-2 pr-3 text-right font-semibold " +
                          (net >= 0 ? "text-emerald-500" : "text-rose-500")
                        }
                      >
                        {net >= 0 ? "+" : "-"}
                        {formatCurrency(Math.abs(net))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ========== MODALS ========== */}
      {showForm && (
        <CategoryForm
          defaultValues={editCategory}
          onClose={() => {
            setShowForm(false);
            setEditCategory(null);
          }}
          onSubmit={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

export default Categories;
