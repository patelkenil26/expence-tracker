// src/components/transactions/TransactionTable.jsx
import React from "react";
import { formatCurrency, formatDate } from "../../utils/format";
import { FiTrash2 } from "react-icons/fi";

function TransactionTable({ list, loading, onDelete }) {
  if (loading) {
    return (
      <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        Loading transactions...
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        No transactions found.
      </div>
    );
  }

  return (
    <div>
      {/* Mobile Card-Based List View (< 640px) */}
      <div className="block sm:hidden space-y-2.5">
        {list.map((tx) => {
          const isIncome = tx.type === "income";
          return (
            <div
              key={tx._id}
              className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                    }`}
                  >
                    {isIncome ? "Income" : "Expense"}
                  </span>
                  {tx.isRecurring && (
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      Recurring
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  {formatDate(tx.date)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[var(--color-text-main)]">
                    {tx.category || "General"}
                  </p>
                  {tx.note && (
                    <p className="text-xs text-[var(--color-text-muted)] line-clamp-1 mt-0.5">
                      {tx.note}
                    </p>
                  )}
                </div>
                <p
                  className={`font-black text-sm sm:text-base ${
                    isIncome
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </p>
              </div>

              {onDelete && (
                <div className="pt-2 border-t border-[var(--color-border-subtle)] flex justify-end">
                  <button
                    onClick={() => onDelete(tx._id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-rose-600 hover:border-rose-300 active:scale-95 transition"
                  >
                    <FiTrash2 className="text-xs" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Full Table View (>= 640px) */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
              <th className="py-2.5 pr-3 font-semibold">Date</th>
              <th className="py-2.5 pr-3 font-semibold">Type</th>
              <th className="py-2.5 pr-3 font-semibold">Category</th>
              <th className="py-2.5 pr-3 font-semibold">Note</th>
              <th className="py-2.5 pr-3 font-semibold text-right">Amount</th>
              {onDelete && <th className="py-2.5 pr-3 font-semibold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-subtle)]">
            {list.map((tx) => (
              <tr
                key={tx._id}
                className="hover:bg-[var(--color-surface-elevated)]/50 transition-colors"
              >
                <td className="py-2.5 pr-3 text-[var(--color-text-main)] whitespace-nowrap">
                  {formatDate(tx.date)}
                </td>

                <td className="py-2.5 pr-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      tx.type === "income"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                    }`}
                  >
                    {tx.type === "income" ? "Income" : "Expense"}
                  </span>

                  {tx.isRecurring && (
                    <span className="ml-1.5 inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      Recurring
                    </span>
                  )}
                </td>

                <td className="py-2.5 pr-3 font-medium text-[var(--color-text-main)]">
                  {tx.category || "-"}
                </td>

                <td className="py-2.5 pr-3 text-[var(--color-text-muted)] max-w-[200px] truncate">
                  {tx.note || "-"}
                </td>

                <td
                  className={`py-2.5 pr-3 text-right font-bold whitespace-nowrap ${
                    tx.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </td>

                {onDelete && (
                  <td className="py-2.5 pr-3 text-right">
                    <button
                      onClick={() => onDelete(tx._id)}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition cursor-pointer"
                      title="Delete transaction"
                    >
                      <FiTrash2 className="text-[10px]" />
                      <span>Delete</span>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
