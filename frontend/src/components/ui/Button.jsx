// src/components/ui/Button.jsx
import React from "react";
import { twMerge } from "tailwind-merge";
import { BUTTON_STYLES } from "../../constants/theme";

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 active:scale-[0.98]";

  const sizeStyles = {
    xs: "text-[11px] px-2.5 py-1 rounded-lg",
    sm: "text-xs px-3 py-1.5 rounded-lg",
    md: "text-sm px-4 py-2 rounded-xl",
    lg: "text-base px-6 py-2.5 rounded-xl",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={twMerge(
        base,
        sizeStyles[size] || sizeStyles.md,
        BUTTON_STYLES[variant] || BUTTON_STYLES.primary,
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-0.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
