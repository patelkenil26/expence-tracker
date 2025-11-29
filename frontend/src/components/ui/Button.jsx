// src/components/ui/Button.jsx
import React from "react";
import { twMerge } from "tailwind-merge";

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  let base =
    "inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium px-4 py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed";

  let styles = "";
  if (variant === "primary") {
    styles =
      "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600";
  } else if (variant === "outline") {
    styles =
      "border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800";
  } else if (variant === "ghost") {
    styles =
      "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800";
  }

  return (
    <button className={twMerge(base, styles, className)} {...props}>
      {children}
    </button>
  );
}

export default Button;
