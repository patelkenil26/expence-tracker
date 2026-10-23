// src/components/ui/StatCard.jsx
import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { STAT_CARD_STYLES } from "../../constants/theme";

function StatCard({
  label,
  value,
  description,
  icon,
  trend,
  trendDirection = "up", // 'up' | 'down' | 'neutral'
  variant = "default",
  loading = false,
  className = "",
}) {
  const config = STAT_CARD_STYLES[variant] || STAT_CARD_STYLES.default;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${config.glow} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            {loading ? (
              <span className="inline-block h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            ) : (
              value
            )}
          </div>
        </div>

        {icon && (
          <div
            className={`h-11 w-11 rounded-2xl flex items-center justify-center text-lg shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-110 ${config.iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="mt-3.5 flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                trendDirection === "up"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : trendDirection === "down"
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {trendDirection === "up" ? (
                <FiTrendingUp className="text-[10px]" />
              ) : trendDirection === "down" ? (
                <FiTrendingDown className="text-[10px]" />
              ) : null}
              {trend}
            </span>
          )}

          {description && (
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StatCard;
