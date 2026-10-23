// src/components/ui/TextInput.jsx
import React from "react";

function TextInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  className = "",
  ...rest
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors duration-150 bg-[var(--color-surface)] text-[var(--color-text-main)] placeholder:text-slate-400 dark:placeholder:text-slate-500 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 ${
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
            : ""
        }`}
        {...rest}
      />
      {helperText && !error && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
      {error && (
        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default TextInput;
