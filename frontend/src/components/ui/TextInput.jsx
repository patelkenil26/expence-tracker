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
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 ${
          error ? "border-rose-400" : ""
        }`}
        {...rest}
      />
      {helperText && !error && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
      {error && (
        <p className="text-[11px] text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}

export default TextInput;
