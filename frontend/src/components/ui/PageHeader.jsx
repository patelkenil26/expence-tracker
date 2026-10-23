// src/components/ui/PageHeader.jsx
import React from "react";

function PageHeader({ title, subtitle, actions, icon, badge }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-2 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-3.5">
        {icon && (
          <div className="h-11 w-11 rounded-2xl bg-[var(--color-primary)]/15 dark:bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] text-xl shadow-sm shrink-0">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)] tracking-tight">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
