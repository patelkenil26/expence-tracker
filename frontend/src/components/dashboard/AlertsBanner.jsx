// src/components/dashboard/AlertsBanner.jsx
import React, { useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

function AlertsBanner({ alerts, loading }) {
  const [dismissed, setDismissed] = useState(false);

  if (loading || dismissed) return null;

  const budgetAlerts = alerts?.budgets || [];
  const goalAlerts = alerts?.goals || [];

  if (budgetAlerts.length === 0 && goalAlerts.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 border border-amber-300/60 dark:border-amber-700/60 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 text-lg border border-amber-200 dark:border-amber-800">
            <FiAlertTriangle />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Financial Alerts & Budget Notifications
            </h4>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              {budgetAlerts.map((b, idx) => (
                <div key={idx} className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    • {b.category}:
                  </span>
                  <span>{b.message || "Budget threshold reached."}</span>
                  <Link
                    to="/budgets"
                    className="font-bold text-[var(--color-primary)] underline hover:no-underline ml-1"
                  >
                    Adjust Budget
                  </Link>
                </div>
              ))}

              {goalAlerts.map((g, idx) => (
                <div key={idx} className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <FiCheckCircle className="text-[11px]" />
                    {g.name || g.title || "Goal"}:
                  </span>
                  <span>{g.message || "Target achieved!"}</span>
                  <Link
                    to="/goals"
                    className="font-bold text-[var(--color-primary)] underline hover:no-underline ml-1"
                  >
                    View Goals
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          aria-label="Dismiss alert"
        >
          <FiX className="text-base" />
        </button>
      </div>
    </div>
  );
}

export default AlertsBanner;
