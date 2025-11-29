import React from "react";
import TextInput from "../ui/TextInput";

function TransactionFilters({ filters, categories, onChange, onClear }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-4 dark:text-slate-300">
      {/* Search */}
      <TextInput
        placeholder="Search by note/category"
        name="search"
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
      />

      {/* Type */}
      <select
        className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm"
        value={filters.type}
        onChange={(e) => onChange("type", e.target.value)}
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Category */}
      <select
        className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm"
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
        className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm"
        value={filters.startDate}
        onChange={(e) => onChange("startDate", e.target.value)}
      />

      {/* To date */}
      <input
        type="date"
        className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm"
        value={filters.endDate}
        onChange={(e) => onChange("endDate", e.target.value)}
      />

      {/* Sort */}
      <select
        className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm"
        value={filters.sort}
        onChange={(e) => onChange("sort", e.target.value)}
      >
        <option value="desc">Newest first</option>
        <option value="asc">Oldest first</option>
        <option value="high">Amount high → low</option>
        <option value="low">Amount low → high</option>
      </select>

      {/* Clear button – mobile me niche aayega */}
      <button
        type="button"
        onClick={onClear}
        className="sm:col-span-2 lg:col-span-6 text-xs px-3 py-2 mt-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Clear filters
      </button>
    </div>
  );
}

export default TransactionFilters;
