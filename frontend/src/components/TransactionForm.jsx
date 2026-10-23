import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { DEFAULT_CATEGORY_NAMES } from "../constants/categories";

function TransactionForm({ onSubmit, onCancel, loading, initialType = "expense" }) {
  // Redux se custom categories
  const categoryState = useSelector((state) => state.categories) || {};
  const customCategories = categoryState.list || [];

  const allCategories = useMemo(() => {
    const customNames = customCategories.map((c) => c.name).filter(Boolean);
    const merged = [...DEFAULT_CATEGORY_NAMES];

    customNames.forEach((name) => {
      if (!merged.includes(name)) {
        merged.push(name);
      }
    });

    return merged;
  }, [customCategories]);

  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [note, setNote] = useState("");

  // recurring state
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    onSubmit({
      type,
      amount: Number(amount),
      category,
      date,
      note: note.trim() || undefined,
      isRecurring,
      recurringFrequency: isRecurring ? frequency : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {/* Type */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Type
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
              type === "income"
                ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)]"
            }`}
          >
            + Income
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
              type === "expense"
                ? "border-rose-500 bg-rose-500 text-white shadow-sm shadow-rose-500/25"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)]"
            }`}
          >
            - Expense
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Amount (₹)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text-main)] placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      {/* Category + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Category
          </label>
          <select
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-main)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Date
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-main)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Recurring options */}
      <div className="border border-[var(--color-border)] rounded-xl p-3 bg-[var(--color-surface)]/70">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="rounded border-[var(--color-border)] accent-[var(--color-primary)]"
          />
          <span>Make this a recurring transaction</span>
        </label>

        {isRecurring && (
          <div className="mt-2.5">
            <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              Frequency
            </label>
            <select
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text-main)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Note (optional)
        </label>
        <textarea
          rows={2}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-sm text-[var(--color-text-main)] placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-none transition"
          placeholder="e.g. Zomato order, groceries, salary deposit..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text-main)] text-xs sm:text-sm font-semibold hover:bg-[var(--color-surface-elevated)] transition cursor-pointer"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:opacity-90 active:scale-95 disabled:opacity-70 disabled:cursor-wait text-[var(--color-primary-text)] text-xs sm:text-sm font-black shadow-md shadow-[var(--color-primary)]/20 transition cursor-pointer"
        >
          {loading ? "Saving..." : "Save Transaction"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
