// src/components/TransactionForm.jsx
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

const defaultCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

function TransactionForm({ onSubmit, onCancel, loading }) {
  // 🔹 Redux se custom categories
  const categoryState = useSelector((state) => state.categories) || {};
  const customCategories = categoryState.list || [];

  const allCategories = useMemo(() => {
    const customNames = customCategories.map((c) => c.name).filter(Boolean);
    const merged = [...defaultCategories];

    customNames.forEach((name) => {
      if (!merged.includes(name)) {
        merged.push(name);
      }
    });

    return merged;
  }, [customCategories]);

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [note, setNote] = useState("");

  // 🔹 NEW: recurring state
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
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
          Type
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 px-3 py-2 rounded-lg border text-xs sm:text-sm ${
              type === "income"
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 px-3 py-2 rounded-lg border text-xs sm:text-sm ${
              type === "expense"
                ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
          Amount (₹)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      {/* Category + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Category
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            Date
          </label>
          <input
            type="date"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* 🔁 Recurring options */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="rounded border-slate-300 dark:border-slate-600"
          />
          <span>Make this a recurring transaction</span>
        </label>

        {isRecurring && (
          <div className="mt-2">
            <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              Frequency
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 dark:text-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
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
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
          Note (optional)
        </label>
        <textarea
          rows={2}
          className="w-full rounded-lg border border-slate-300 dark:text-slate-500 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="e.g. Zomato order, petrol, rent for November..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border dark:text-slate-300 border-slate-300 dark:border-slate-700 text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-wait text-white text-xs sm:text-sm font-medium"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
