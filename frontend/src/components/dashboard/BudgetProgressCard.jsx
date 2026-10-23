// src/components/dashboard/BudgetProgressCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Card from "../ui/Card";
import { formatCurrency } from "../../utils/format";

function BudgetProgressCard({ data = [], loading }) {
  return (
    <Card
      title="Budget Utilization"
      subtitle="Monthly spending limits and threshold health"
      action={
        <Link
          to="/budgets"
          className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
        >
          Adjust <FiArrowRight className="text-[10px]" />
        </Link>
      }
    >
      {loading ? (
        <div className="space-y-3 py-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 space-y-2">
          <p>No active budgets set for this month.</p>
          <Link
            to="/budgets"
            className="inline-block text-xs font-bold text-[var(--color-primary)] underline"
          >
            Create a budget limit
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.slice(0, 5).map((item) => {
            const pct = Math.round(item.percentage || 0);
            const isOver = pct > 100;
            const isWarning = pct >= 80 && pct <= 100;

            const barColor = isOver
              ? "bg-rose-500"
              : isWarning
              ? "bg-amber-500"
              : "bg-emerald-500";

            const badgeColor = isOver
              ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40"
              : isWarning
              ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40"
              : "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40";

            return (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${badgeColor}`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default BudgetProgressCard;
