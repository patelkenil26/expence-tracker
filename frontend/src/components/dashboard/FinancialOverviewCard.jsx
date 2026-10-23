// src/components/dashboard/FinancialOverviewCard.jsx
import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { formatCurrency } from "../../utils/format";

function FinancialOverviewCard({ balance = 0, totalIncome = 0, totalExpense = 0, loading }) {
  const totalFlow = totalIncome + totalExpense;
  const incomePercent = totalFlow > 0 ? Math.round((totalIncome / totalFlow) * 100) : 50;
  const expensePercent = totalFlow > 0 ? Math.round((totalExpense / totalFlow) * 100) : 50;

  const isPositive = balance >= 0;

  return (
    <Card
      title="Financial Cash Flow"
      subtitle="Income vs Expense distribution for current cycle"
      action={
        <Badge variant={isPositive ? "success" : "danger"} dot>
          {isPositive ? "Positive Flow" : "Cash Deficit"}
        </Badge>
      }
    >
      {loading ? (
        <div className="py-8 space-y-4 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Visual distribution bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400">
                Income: {incomePercent}%
              </span>
              <span className="text-rose-600 dark:text-rose-400">
                Expense: {expensePercent}%
              </span>
            </div>

            <div className="h-3.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex p-0.5 border border-slate-200/60 dark:border-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${incomePercent}%` }}
              />
              <div
                className="h-full rounded-full bg-rose-500 transition-all duration-500"
                style={{ width: `${expensePercent}%` }}
              />
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                Total Inflow
              </p>
              <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {formatCurrency(totalIncome)}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">100% credited</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                Total Outflow
              </p>
              <p className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                {formatCurrency(totalExpense)}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Debited this month</p>
            </div>
          </div>

          {/* Net Margin */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-primary)]/10 dark:bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Net Savings Remaining:
            </span>
            <span
              className={`font-black ${
                isPositive
                  ? "text-[var(--color-text-main)]"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

export default FinancialOverviewCard;
