// src/components/dashboard/RecentTransactionsCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight, FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { formatCurrency, formatDate } from "../../utils/format";

function RecentTransactionsCard({ transactions = [], loading, onAddClick }) {
  return (
    <Card
      title="Recent Transactions"
      subtitle="Latest income and expense entries"
      action={
        <div className="flex items-center gap-2">
          <Button size="xs" variant="gradient" onClick={onAddClick}>
            <FiPlus className="text-xs" /> Add
          </Button>
          <Link
            to="/transactions"
            className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 pl-1"
          >
            View All <FiArrowRight className="text-[10px]" />
          </Link>
        </div>
      }
    >
      {loading ? (
        <div className="space-y-3 py-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            No transactions recorded yet.
          </p>
          <Button size="xs" variant="outline" onClick={onAddClick}>
            Record your first transaction
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {transactions.slice(0, 5).map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <div
                key={tx._id}
                className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50"
                        : "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50"
                    }`}
                  >
                    {isIncome ? <FiArrowUpRight /> : <FiArrowDownLeft />}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {tx.category || "Transaction"}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {formatDate(tx.date)} {tx.note ? `• ${tx.note}` : ""}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <p
                    className={`text-xs sm:text-sm font-bold ${
                      isIncome
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </p>
                  {tx.isRecurring && (
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                      Recurring
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default RecentTransactionsCard;
