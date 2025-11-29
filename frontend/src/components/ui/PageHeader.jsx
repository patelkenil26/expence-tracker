// src/components/ui/PageHeader.jsx
import React from "react";

function PageHeader({ title, subtitle, actions, icon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 ">
      <div className="flex items-start gap-2">
        {icon && (
          <div className="mt-0.5 text-indigo-500 dark:text-indigo-400">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export default PageHeader;
