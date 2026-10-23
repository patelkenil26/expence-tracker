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
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <th className="py-2.5 pr-3 font-semibold">Date</th>
            <th className="py-2.5 pr-3 font-semibold">Type</th>
            <th className="py-2.5 pr-3 font-semibold">Category</th>
            <th className="py-2.5 pr-3 font-semibold hidden sm:table-cell">Note</th>
            <th className="py-2.5 pr-3 font-semibold text-right">Amount</th>
            {onDelete && <th className="py-2.5 pr-3 font-semibold text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {list.map((tx) => (
            <tr
              key={tx._id}
              className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors"
            >
              <td className="py-2.5 pr-3 text-slate-700 dark:text-slate-200 whitespace-nowrap">
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
                  <span className="ml-1.5 inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Recurring
                  </span>
                )}
              </td>

              <td className="py-2.5 pr-3 font-medium text-slate-800 dark:text-slate-100">
                {tx.category || "-"}
              </td>

              <td className="py-2.5 pr-3 hidden sm:table-cell text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
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
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 dark:hover:border-rose-900 transition cursor-pointer"
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
  );
}

export default TransactionTable;
