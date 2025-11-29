// src/pages/Expense.jsx
import React, { useEffect, useState, useCallback } from "react";
import { FiTrendingDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import TransactionForm from "../components/TransactionForm";
import { getTransactionsApi, createTransactionApi, deleteTransactionApi } from "../api/transactionApi";
import { formatCurrency, formatDate } from "../utils/format";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Expense() {
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const auth = useSelector((state) => state.auth);

  const getLastNDaysRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };

  const buildChartData = (items) => {
    const map = new Map();

    items.forEach((tx) => {
      if (!tx.date) return;
      const d = new Date(tx.date);
      const key = d.toISOString().slice(0, 10);

      map.set(key, (map.get(key) || 0) + tx.amount);
    });

    const sortedKeys = Array.from(map.keys()).sort();

    return sortedKeys.map((key) => {
      const d = new Date(key);
      const options = { day: "numeric", month: "short" };
      const label = d.toLocaleDateString("en-GB", options);

      return {
        dateKey: key,
        label,
        amount: map.get(key),
      };
    });
  };

  const fetchExpenseData = useCallback(async () => {
    try {
      setLoading(true);
      setListLoading(true);

      const { start, end } = getLastNDaysRange(30);

      const res = await getTransactionsApi({
        type: "expense",
        startDate: start,
        endDate: end,
        sort: "asc",
        limit: 500,
      });

      const list = Array.isArray(res.data?.data) ? res.data.data : [];

      setExpenses(
        [...list].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );

      setChartData(buildChartData(list));
    } catch (err) {
      console.error("Expense fetch error:", err);
      toast.error("Failed to load expense data.");
    } finally {
      setLoading(false);
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenseData();
  }, [fetchExpenseData]);

  const handleCreateExpense = async (payload) => {
    try {
      setCreateLoading(true);
      await createTransactionApi({ ...payload, type: "expense" });
      toast.success("Expense added successfully.");
      setShowAddModal(false);
      fetchExpenseData();
    } catch (err) {
      console.error("Create expense error:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to add expense. Please try again.";
      toast.error(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteTransactionApi(id);
      toast.success("Expense deleted.");
      fetchExpenseData();
    } catch (err) {
      console.error("Delete expense error:", err);
      toast.error("Failed to delete expense.");
    }
  };

  const totalExpense = expenses.reduce(
    (sum, tx) => sum + (tx.amount || 0),
    0
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Expense"
        subtitle="Track your spending trends and see where your money goes."
        icon={<FiTrendingDown />}
        actions={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Expense
          </Button>
        }
      />

      {/* Expense overview chart */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Expense Overview (last 30 days)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Line chart showing how your expenses changed over time.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Total in last 30 days
            </p>
            <p className="text-sm font-semibold text-rose-500">
              {formatCurrency(totalExpense)}
            </p>
          </div>
        </div>

        <div className="h-56">
          {loading ? (
            <div className="h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
              Loading expense chart...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
              No expense data for the selected period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  fill="url(#expenseFill)"
                  name="Expense"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* All expenses list */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              All expenses
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              List of all expense entries (last 30 days).
            </p>
          </div>
        </div>

        {listLoading ? (
          <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Loading expenses...
          </div>
        ) : expenses.length === 0 ? (
          <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
            No expense entries found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between py-3 text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {tx.category || "Expense"}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatDate(tx.date)} · {tx.note || "No note"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-rose-500">
                    -{formatCurrency(tx.amount)}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(tx._id)}
                    className="text-[11px] px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Expense modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Add expense
            </h2>
            <TransactionForm
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
