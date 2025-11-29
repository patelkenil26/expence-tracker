// src/pages/Income.jsx
import React, { useEffect, useState, useCallback } from "react";
import { FiTrendingUp } from "react-icons/fi";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Income() {
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const auth = useSelector((state) => state.auth);

  // helper: last 60 days ka date range
  const getLastNDaysRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };

  // chart grouping
  const buildChartData = (items) => {
    // date -> totalAmount
    const map = new Map();

    items.forEach((tx) => {
      if (!tx.date) return;
      const d = new Date(tx.date);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD

      map.set(key, (map.get(key) || 0) + tx.amount);
    });

    const sortedKeys = Array.from(map.keys()).sort();

    return sortedKeys.map((key) => {
      const d = new Date(key);
      const options = { day: "numeric", month: "short" }; // 12 Feb
      const label = d.toLocaleDateString("en-GB", options);

      return {
        dateKey: key,
        label,
        amount: map.get(key),
      };
    });
  };

  // income list + chart fetch
  const fetchIncomeData = useCallback(async () => {
    try {
      setLoading(true);
      setListLoading(true);

      const { start, end } = getLastNDaysRange(60);

      const res = await getTransactionsApi({
        type: "income",
        startDate: start,
        endDate: end,
        sort: "asc", // chart ke liye ascending
        limit: 500,
      });

      const list = Array.isArray(res.data?.data) ? res.data.data : [];

      setIncomes(
        [...list].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );

      setChartData(buildChartData(list));
    } catch (err) {
      console.error("Income fetch error:", err);
      toast.error("Failed to load income data.");
    } finally {
      setLoading(false);
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomeData();
  }, [fetchIncomeData]);

  // create income
  const handleCreateIncome = async (payload) => {
    try {
      setCreateLoading(true);
      // force type = "income" (agar form me user expense select kare to bhi ignore)
      await createTransactionApi({ ...payload, type: "income" });
      toast.success("Income added successfully.");
      setShowAddModal(false);
      fetchIncomeData();
    } catch (err) {
      console.error("Create income error:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to add income. Please try again.";
      toast.error(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  // delete income
  const handleDeleteIncome = async (id) => {
    if (!window.confirm("Delete this income entry?")) return;
    try {
      await deleteTransactionApi(id);
      toast.success("Income deleted.");
      setIncomes((prev) => prev.filter((tx) => tx._id !== id));
      setChartData((prev) => buildChartData(prev.filter((tx) => tx._id !== id)));
      // better: refetch
      fetchIncomeData();
    } catch (err) {
      console.error("Delete income error:", err);
      toast.error("Failed to delete income.");
    }
  };

  const totalIncome = incomes.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Income"
        subtitle="Track your earnings over time and analyse your income trends."
        icon={<FiTrendingUp />}
        actions={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add Income
          </Button>
        }
      />

      {/* Top chart card */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Income Overview (last 60 days)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bars show total income per day. Hover to see exact amounts.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Total in last 60 days
            </p>
            <p className="text-sm font-semibold text-emerald-500">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </div>

        <div className="h-56">
          {loading ? (
            <div className="h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
              Loading income chart...
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
              No income data for the selected period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Bar
                  dataKey="amount"
                  name="Income"
                  radius={[4, 4, 0, 0]}
                  fill="#8b5cf6"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Bottom list card */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Income sources
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed list of all income entries (last 60 days).
            </p>
          </div>
        </div>

        {listLoading ? (
          <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Loading income list...
          </div>
        ) : incomes.length === 0 ? (
          <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
            No income entries found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {incomes.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between py-3 text-xs"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {tx.category || "Income"}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatDate(tx.date)} · {tx.note || "No note"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-emerald-500">
                    {formatCurrency(tx.amount)}
                  </span>
                  <button
                    onClick={() => handleDeleteIncome(tx._id)}
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

      {/* Add Income modal reusing TransactionForm */}
      {showAddModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Add income
            </h2>
            <TransactionForm
              loading={createLoading}
              onSubmit={handleCreateIncome}
              onCancel={() => !createLoading && setShowAddModal(false)}
              // TransactionForm ke andar type select hai, but hum onSubmit me force kar rahe "income"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Income;
