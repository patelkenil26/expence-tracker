// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { getAlertsApi } from "../api/alertsApi";

import { useSelector } from "react-redux";
import { FiUser, FiCreditCard, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";

import { getSummaryStatsApi, getByCategoryStatsApi } from "../api/statsApi";
import {
  getTransactionsApi,
  createTransactionApi,
} from "../api/transactionApi";
import { getBudgetProgressApi } from "../api/budgetApi";

import { formatCurrency, formatDate } from "../utils/format";
import TransactionForm from "../components/TransactionForm";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ===========================
// Helpers
// ===========================
const getLastNDaysRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const buildDailyChartData = (items) => {
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
    const label = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }); // 17 Feb
    return {
      dateKey: key,
      label,
      amount: map.get(key),
    };
  });
};

// ===========================
// Main Dashboard component
// ===========================
function Dashboard() {
  const auth = useSelector((state) => state.auth);

  const userName =
    auth?.user?.name ||
    (auth?.user?.email ? auth.user.email.split("@")[0] : "there");

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [recent, setRecent] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expenseChart, setExpenseChart] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // category stats (this month)
  const [categoryStats, setCategoryStats] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // budget progress (this month)
  const [budgetProgress, setBudgetProgress] = useState([]);
  const [budgetLoading, setBudgetLoading] = useState(false);

  const [currentMonth] = useState(() => new Date().getMonth() + 1);
  const [currentYear] = useState(() => new Date().getFullYear());

  const [alerts, setAlerts] = useState({ budgets: [], goals: [] });
  const [alertsLoading, setAlertsLoading] = useState(false);

  // ===========================
  // Fetch summary stats
  // ===========================
  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const res = await getSummaryStatsApi({
        month: currentMonth,
        year: currentYear,
      });

      const data = res.data || {};
      setSummary({
        totalIncome: data.totalIncome || 0,
        totalExpense: data.totalExpense || 0,
        balance:
          data.balance || (data.totalIncome || 0) - (data.totalExpense || 0),
      });
    } catch (err) {
      console.error("Summary stats error:", err);
      toast.error("Failed to load summary stats.");
    } finally {
      setSummaryLoading(false);
    }
  }, [currentMonth, currentYear]);

  // ===========================
  // Fetch recent transactions (all types)
  // ===========================
  const fetchRecentTransactions = useCallback(async () => {
    try {
      setRecentLoading(true);
      const res = await getTransactionsApi({
        limit: 5,
        sort: "desc",
      });

      const list =
        Array.isArray(res.data?.data) || Array.isArray(res.data?.transaction)
          ? res.data.data || res.data.transaction
          : [];
      setRecent(list);
    } catch (err) {
      console.error("Recent transactions error:", err);
      toast.error("Failed to load recent transactions.");
    } finally {
      setRecentLoading(false);
    }
  }, []);

  // ===========================
  // Fetch last 30 days expenses (list + chart)
  // ===========================
  const fetchExpenses = useCallback(async () => {
    try {
      setExpensesLoading(true);
      const { start, end } = getLastNDaysRange(30);

      const res = await getTransactionsApi({
        type: "expense",
        startDate: start,
        endDate: end,
        sort: "asc",
        limit: 500,
      });

      const list =
        Array.isArray(res.data?.data) || Array.isArray(res.data?.transaction)
          ? res.data.data || res.data.transaction
          : [];

      const sortedForList = [...list].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setExpenses(sortedForList);
      setExpenseChart(buildDailyChartData(list));
    } catch (err) {
      console.error("Expenses fetch error:", err);
      toast.error("Failed to load expense data.");
    } finally {
      setExpensesLoading(false);
    }
  }, []);

  // ===========================
  // Fetch category-wise stats (this month)
  // ===========================
  const fetchCategoryStats = useCallback(async () => {
    try {
      setCategoryLoading(true);
      const res = await getByCategoryStatsApi({
        month: currentMonth,
        year: currentYear,
        type: "expense",
      });

      const raw = Array.isArray(res.data?.data) ? res.data.data : [];
      const total = raw.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

      const mapped = raw
        .map((item) => ({
          name: item.category || "Other",
          value: item.totalAmount || 0,
          percentage:
            total > 0 ? Math.round(((item.totalAmount || 0) / total) * 100) : 0,
        }))
        // sabse jyada kharch wale upar
        .sort((a, b) => b.value - a.value);

      setCategoryStats(mapped);
    } catch (err) {
      console.error("Category stats error:", err);
      // silent fail bhi theek hai yaha
    } finally {
      setCategoryLoading(false);
    }
  }, [currentMonth, currentYear]);

  // ===========================
  // Fetch budget progress (this month)
  // ===========================
  const fetchBudgetProgress = useCallback(async () => {
    try {
      setBudgetLoading(true);
      const res = await getBudgetProgressApi({
        month: currentMonth,
        year: currentYear,
      });

      const list = Array.isArray(res.data?.summary) ? res.data.summary : [];
      setBudgetProgress(list);
    } catch (err) {
      console.error("Budget progress error:", err);
    } finally {
      setBudgetLoading(false);
    }
  }, [currentMonth, currentYear]);

  // ===========================
  // Effects
  // ===========================
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchRecentTransactions();
  }, [fetchRecentTransactions]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    fetchCategoryStats();
  }, [fetchCategoryStats]);

  useEffect(() => {
    fetchBudgetProgress();
  }, [fetchBudgetProgress]);

  // ===========================
  // CREATE TRANSACTION (modal)
  // ===========================
  const handleCreateTransaction = async (payload) => {
    try {
      setCreateLoading(true);
      await createTransactionApi(payload);

      toast.success(
        payload.type === "income"
          ? "Income added successfully."
          : "Expense added successfully."
      );

      setShowAddModal(false);

      // refresh dashboard data
      await Promise.all([
        fetchSummary(),
        fetchRecentTransactions(),
        fetchExpenses(),
        fetchCategoryStats(),
        fetchBudgetProgress(),
      ]);
    } catch (err) {
      console.error("Create transaction error:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to add transaction. Please try again.";
      toast.error(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const totalBalance = summary.balance;
  const totalIncome = summary.totalIncome;
  const totalExpense = summary.totalExpense;

  return (
    <div className="relative min-h-[calc(100vh-3rem)] bg-slate-100 dark:bg-slate-900 px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER / WELCOME */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Dashboard
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <FiUser className="text-indigo-500" />
              <span>Welcome back, {userName}</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track your income, expenses and get a clear picture of your money.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700">
              <FiCreditCard />
              <span>Personal Expense Tracker</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700">
              <FiLock />
              <span>Secure · Private</span>
            </span>
          </div>
        </header>

        {/* TOP SUMMARY CARDS */}
        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total Balance"
            value={summaryLoading ? "Loading..." : formatCurrency(totalBalance)}
            description={`Income minus expenses for ${currentMonth}/${currentYear}.`}
            variant="balance"
          />
          <SummaryCard
            label="Total Income (this month)"
            value={summaryLoading ? "Loading..." : formatCurrency(totalIncome)}
            description="All money coming in – salary, freelance, etc."
            variant="income"
          />
          <SummaryCard
            label="Total Expenses (this month)"
            value={summaryLoading ? "Loading..." : formatCurrency(totalExpense)}
            description="All money going out – food, rent, travel, etc."
            variant="expense"
          />
        </section>

        {/* MIDDLE ROW: Recent Transactions + Financial Overview */}
        <section className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
          <RecentTransactionsCard
            transactions={recent}
            loading={recentLoading}
            onAddClick={() => setShowAddModal(true)}
          />

          <FinancialOverviewCard
            balance={totalBalance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            loading={summaryLoading}
          />
        </section>

        {/* BOTTOM ROW: Expenses list + Last 30 days chart */}
        <section className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
          <ExpensesListCard expenses={expenses} loading={expensesLoading} />
          <Last30DaysExpensesCard
            data={expenseChart}
            loading={expensesLoading}
          />
        </section>

        {/* ANALYTICS ROW: Top categories + Budget overview */}
        <section className="grid gap-4 lg:grid-cols-2">
          <TopCategoriesCard data={categoryStats} loading={categoryLoading} />
          <BudgetProgressCard data={budgetProgress} loading={budgetLoading} />
        </section>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Add new transaction
            </h2>
            <TransactionForm
              loading={createLoading}
              onSubmit={handleCreateTransaction}
              onCancel={() => !createLoading && setShowAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

// ===========================
// Reusable sub-components
// ===========================

function SummaryCard({ label, value, description, variant = "default" }) {
  let wrapperClass =
    "rounded-2xl p-4 shadow-sm border transition-colors bg-white dark:bg-slate-950 ";
  if (variant === "income") {
    wrapperClass +=
      "border-emerald-100 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/20";
  } else if (variant === "expense") {
    wrapperClass +=
      "border-rose-100 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/20";
  } else {
    wrapperClass += "border-slate-200 dark:border-slate-800";
  }

  return (
    <div className={wrapperClass}>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-50">
        {value}
      </p>
      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function RecentTransactionsCard({ transactions, loading, onAddClick }) {
  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Recent Transactions
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Latest expenses and incomes – sorted by date.
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="text-[11px] px-3 py-1 rounded-lg border dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          + Add
        </button>
      </div>

      {loading ? (
        <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
          Abhi koi transaction nahi. Jaldi hi yaha real data aayega.
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-900"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-100">
                  {tx.category || "Transaction"}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formatDate(tx.date)} · {tx.note || "No note"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    tx.type === "income"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                  }`}
                >
                  {tx.type === "income" ? "Income" : "Expense"}
                </span>

                {tx.isRecurring && (
                  <span className="ml-1 inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Recurring
                  </span>
                )}

                <span
                  className={`text-xs font-semibold ${
                    tx.type === "income" ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FinancialOverviewCard({
  balance,
  totalIncome,
  totalExpense,
  loading,
}) {
  const data = [
    { name: "Balance", value: Math.max(balance, 0) },
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpense },
  ];

  const COLORS = ["#4f46e5", "#22c55e", "#ef4444"];

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Financial Overview
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Snapshot of your balance, income and expenses.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Total balance
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {loading ? "..." : formatCurrency(balance)}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
          Loading overview...
        </div>
      ) : (
        <div className="flex-1 flex items-center gap-3">
          <div className="w-1/2 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-2 text-[11px]">
            <LegendItem
              color={COLORS[0]}
              label="Total Balance"
              value={formatCurrency(balance)}
            />
            <LegendItem
              color={COLORS[1]}
              label="Total Income"
              value={formatCurrency(totalIncome)}
            />
            <LegendItem
              color={COLORS[2]}
              label="Total Expenses"
              value={formatCurrency(totalExpense)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
      </div>
      <span className="font-medium text-slate-800 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}

function ExpensesListCard({ expenses, loading }) {
  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Expenses
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Recent expense entries from the last 30 days.
        </p>
      </div>

      {loading ? (
        <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
          Loading expenses...
        </div>
      ) : expenses.length === 0 ? (
        <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
          No expenses in the last 30 days.
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.slice(0, 5).map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-900"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-100">
                  {tx.category || "Expense"}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formatDate(tx.date)} · {tx.note || "No note"}
                </span>
              </div>
              <span className="text-xs font-semibold text-rose-500">
                -{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Last30DaysExpensesCard({ data, loading }) {
  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Last 30 Days Expenses
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Daily view of how much you spent recently.
        </p>
      </div>

      <div className="h-48">
        {loading ? (
          <div className="h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
            Loading chart...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400">
            No expense data for the last 30 days.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
                name="Expense"
                radius={[4, 4, 0, 0]}
                fill="#8b5cf6"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function TopCategoriesCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Top spending categories
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Loading category breakdown...
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Top spending categories
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          No category-wise expense data for this month yet.
        </p>
      </div>
    );
  }

  const COLORS = [
    "#4f46e5",
    "#22c55e",
    "#f97316",
    "#e11d48",
    "#06b6d4",
    "#a855f7",
    "#facc15",
  ];

  // sirf top 5 dikha rahe hain
  const top = data.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Top spending categories
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          See where most of your money is going this month.
        </p>
      </div>

      <div className="flex-1 flex gap-3">
        <div className="w-1/2 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={top}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={3}
              >
                {top.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 space-y-2 text-[11px] max-h-40 overflow-auto pr-1">
          {top.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-700 dark:text-slate-200">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-800 dark:text-slate-100">
                  {formatCurrency(item.value)}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {item.percentage}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BudgetProgressCard({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Budget overview
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Loading budget data...
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Budget overview
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          No budgets set for this month yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Budget overview
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Category-wise spending vs your monthly limits.
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-auto pr-1">
        {data.map((item) => {
          const pct = item.percentage || 0;
          let barClass = "h-1.5 rounded-full transition-all duration-300 ";
          if (pct >= 100) {
            barClass += "bg-rose-500";
          } else if (pct >= 70) {
            barClass += "bg-amber-500";
          } else {
            barClass += "bg-emerald-500";
          }

          return (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {item.category}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
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
                    Over by {formatCurrency(item.spent - item.budget)}
                  </span>
                ) : pct >= 70 ? (
                  <span className="text-amber-500">
                    Close to limit – track carefully
                  </span>
                ) : (
                  <span className="text-emerald-500">Safe – within budget</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
