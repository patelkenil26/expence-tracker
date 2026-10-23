// src/components/dashboard/DashboardStats.jsx
import React from "react";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPercent } from "react-icons/fi";
import StatCard from "../ui/StatCard";
import { formatCurrency } from "../../utils/format";

function DashboardStats({ summary, loading, currentMonth, currentYear }) {
  const { totalIncome = 0, totalExpense = 0, balance = 0 } = summary;

  // Calculate savings rate %
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
      : 0;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Net Balance"
        value={formatCurrency(balance)}
        description={`Calculated for ${currentMonth}/${currentYear}`}
        icon={<FiDollarSign />}
        variant="balance"
        loading={loading}
      />

      <StatCard
        label="Monthly Income"
        value={formatCurrency(totalIncome)}
        description="Salary, freelance & other credits"
        icon={<FiTrendingUp />}
        variant="income"
        trend={totalIncome > 0 ? "Active" : null}
        trendDirection="up"
        loading={loading}
      />

      <StatCard
        label="Monthly Expenses"
        value={formatCurrency(totalExpense)}
        description="All living costs & debits"
        icon={<FiTrendingDown />}
        variant="expense"
        trend={totalExpense > 0 ? "Tracked" : null}
        trendDirection="down"
        loading={loading}
      />

      <StatCard
        label="Savings Rate"
        value={`${savingsRate}%`}
        description={
          savingsRate >= 20
            ? "Healthy financial buffer"
            : savingsRate > 0
            ? "Keep monitoring expenses"
            : "Expenses exceed income"
        }
        icon={<FiPercent />}
        variant={savingsRate >= 20 ? "income" : savingsRate > 0 ? "warning" : "expense"}
        loading={loading}
      />
    </section>
  );
}

export default DashboardStats;
