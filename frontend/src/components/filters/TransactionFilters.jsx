// src/components/filters/TransactionFilters.jsx
import React from "react";
import TextInput from "../ui/TextInput";
import { FiX } from "react-icons/fi";

function TransactionFilters({ filters, categories, onChange, onClear }) {
  const selectClass =
    "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
      {/* Search */}
      <TextInput
        placeholder="Search note or category..."
        name="search"
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
      />

      {/* Type */}
      <select
        className={selectClass}
        value={filters.type}
        onChange={(e) => onChange("type", e.target.value)}
      >
        <option value="">All types</option>
        <option value="income">Income (+)</option>
        <option value="expense">Expense (-)</option>
      </select>

      {/* Category */}
      <select
        className={selectClass}
        value={filters.category}
        onChange={(e) => onChange("category", e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* From date */}
      <input
        type="date"
        className={selectClass}
        value={filters.startDate}
        onChange={(e) => onChange("startDate", e.target.value)}
        title="Start date"
      />

      {/* To date */}
      <input
        type="date"
        className={selectClass}
        value={filters.endDate}
        onChange={(e) => onChange("endDate", e.target.value)}
        title="End date"
      />

      {/* Sort */}
      <select
        className={selectClass}
        value={filters.sort}
        onChange={(e) => onChange("sort", e.target.value)}
      >
        <option value="desc">Newest first</option>
        <option value="asc">Oldest first</option>
        <option value="high">Amount: High → Low</option>
        <option value="low">Amount: Low → High</option>
      </select>

      {/* Clear button */}
      <div className="sm:col-span-2 lg:col-span-6 flex justify-end">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-elevated)] transition cursor-pointer"
        >
          <FiX className="text-xs" />
          <span>Reset filters</span>
        </button>
      </div>
    </div>
  );
}

export default TransactionFilters;
