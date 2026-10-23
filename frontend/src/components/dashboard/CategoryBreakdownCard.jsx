// src/components/dashboard/CategoryBreakdownCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Card from "../ui/Card";
import { formatCurrency } from "../../utils/format";
import { CHART_COLORS } from "../../constants/theme";

function CategoryBreakdownCard({ data = [], loading }) {
  return (
    <Card
      title="Category Spending Breakdown"
      subtitle="Highest expense categories this month"
      action={
        <Link
          to="/categories"
          className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
        >
          Manage <FiArrowRight className="text-[10px]" />
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
        <div className="py-8 text-center text-xs text-slate-400">
          No category expenses recorded this month yet.
        </div>
      ) : (
        <div className="space-y-3.5">
          {data.slice(0, 5).map((cat, index) => {
            const color = CHART_COLORS[index % CHART_COLORS.length];
            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cat.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(cat.value)}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 w-8 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(cat.percentage, 100)}%`,
                      backgroundColor: color,
                    }}
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

export default CategoryBreakdownCard;
