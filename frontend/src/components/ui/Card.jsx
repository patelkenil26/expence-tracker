// src/components/ui/Card.jsx
import React from "react";

function Card({
  title,
  subtitle,
  action,
  children,
  glass = false,
  hoverLift = false,
  className = "",
  bodyClassName = "",
}) {
  const baseCardClass = glass
    ? "glass-card shadow-sm"
    : "bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm";

  const hoverClass = hoverLift
    ? "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[var(--color-primary)]/50"
    : "transition-colors";

  return (
    <div className={`rounded-2xl overflow-hidden ${baseCardClass} ${hoverClass} ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <div>
            {title && (
              <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-main)] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={bodyClassName || "p-4 sm:p-5"}>
        {children}
      </div>
    </div>
  );
}

export default Card;
