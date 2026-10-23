// src/components/ui/Badge.jsx
import React from "react";
import { BADGE_STYLES, BADGE_DOT_COLORS } from "../../constants/theme";

function Badge({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
  className = "",
}) {
  const variantClasses = BADGE_STYLES[variant] || BADGE_STYLES.neutral;
  const sizeClasses =
    size === "xs"
      ? "text-[10px] px-2 py-0.5"
      : size === "md"
      ? "text-xs px-3 py-1"
      : "text-[11px] px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${variantClasses} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            BADGE_DOT_COLORS[variant] || "bg-current"
          }`}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
