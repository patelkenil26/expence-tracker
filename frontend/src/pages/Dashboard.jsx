// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiPlus } from "react-icons/fi";

// Custom TanStack Query Hook
import { useDashboardData } from "../hooks/useDashboardData";

// Modular UI & Dashboard components
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import TransactionForm from "../components/TransactionForm";

import DashboardStats from "../components/dashboard/DashboardStats";
import AlertsBanner from "../components/dashboard/AlertsBanner";
import RecentTransactionsCard from "../components/dashboard/RecentTransactionsCard";
import FinancialOverviewCard from "../components/dashboard/FinancialOverviewCard";
import ExpenseTrendsCard from "../components/dashboard/ExpenseTrendsCard";
import CategoryBreakdownCard from "../components/dashboard/CategoryBreakdownCard";
import BudgetProgressCard from "../components/dashboard/BudgetProgressCard";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const displayName = user?.name || user?.email?.split("@")[0] || "there";

  const [currentMonth] = useState(() => new Date().getMonth() + 1);
  const [currentYear] = useState(() => new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);

  // TanStack Query custom hook for parallel data fetching & caching
  const {
    summary,
    summaryLoading,
    recent,
    recentLoading,
    expenseChart,
    chartLoading,
    categoryStats,
    categoryLoading,
    budgetProgress,
    budgetLoading,
    alerts,
    alertsLoading,
    createTransaction,
    createLoading,
  } = useDashboardData(currentMonth, currentYear);

  const handleCreateTransaction = async (formData) => {
    try {
      await createTransaction(formData);
      setShowAddModal(false);
    } catch {
      // Error is handled inside the TanStack mutation
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Page Header with Action Buttons */}
      <PageHeader
        title={`Welcome back, ${displayName}`}
        subtitle={`Here's your comprehensive financial overview for ${currentMonth}/${currentYear}.`}
        actions={
          <Button
            variant="gradient"
            onClick={() => setShowAddModal(true)}
            className="shadow-md"
          >
            <FiPlus />
            <span>Record Transaction</span>
          </Button>
        }
      />

      {/* Financial Alerts & Threshold Warning Banner */}
      <AlertsBanner alerts={alerts} loading={alertsLoading} />

      {/* Top 4 KPI Executive Stat Cards */}
      <DashboardStats
        summary={summary}
        loading={summaryLoading}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />

      {/* Middle Row: Recent Transactions + Financial Cash Flow */}
      <section className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RecentTransactionsCard
            transactions={recent}
            loading={recentLoading}
            onAddClick={() => setShowAddModal(true)}
          />
        </div>
        <div className="lg:col-span-5">
          <FinancialOverviewCard
            balance={summary.balance}
            totalIncome={summary.totalIncome}
            totalExpense={summary.totalExpense}
            loading={summaryLoading}
          />
        </div>
      </section>

      {/* Lower Row: Daily Expense Trends Chart + Category Breakdown */}
      <section className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ExpenseTrendsCard data={expenseChart} loading={chartLoading} />
        </div>
        <div className="lg:col-span-5">
          <CategoryBreakdownCard data={categoryStats} loading={categoryLoading} />
        </div>
      </section>

      {/* Bottom Section: Budget Progress Card */}
      <section>
        <BudgetProgressCard data={budgetProgress} loading={budgetLoading} />
      </section>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-6 transition-all transform scale-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  New Transaction
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Record an income or expense with category and notes
                </p>
              </div>
            </div>

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
