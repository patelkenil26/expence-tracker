import React from "react";
import { formatCurrency, formatDate } from "../../utils/format";

function TransactionTable({ list, loading, onDelete }) {
  if (loading) {
    return (
      <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
        Loading transactions...
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-[11px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <th className="py-2 pr-3">Date</th>
            <th className="py-2 pr-3">Type</th>
            <th className="py-2 pr-3">Category</th>
            <th className="py-2 pr-3 hidden sm:table-cell">Note</th>
            <th className="py-2 pr-3 text-right">Amount</th>
            {onDelete && <th className="py-2 pr-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {list.map((tx) => (
            <tr
              key={tx._id}
              className="border-b border-slate-100 dark:border-slate-800"
            >
              <td className="py-2 pr-3 text-slate-700 dark:text-slate-200">
                {formatDate(tx.date)}
              </td>

              <td className="py-2 pr-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    tx.type === "income"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                  }`}
                >
                  {tx.type === "income" ? "Income" : "Expense"}
                </span>

                {tx.isRecurring && (
                  <span className="ml-2 inline-flex px-2 py-0.5 rounded-full text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Recurring
                  </span>
                )}
              </td>

              <td className="py-2 pr-3 text-slate-700 dark:text-slate-200">
                {tx.category || "-"}
              </td>

              <td className="py-2 pr-3 hidden sm:table-cell text-slate-500 dark:text-slate-400">
                {tx.note || "-"}
              </td>

              <td
                className={`py-2 pr-3 text-right font-medium ${
                  tx.type === "income" ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}
                {formatCurrency(tx.amount)}
              </td>

              {onDelete && (
                <td className="py-2 pr-3 text-right">
                  <button
                    onClick={() => onDelete(tx._id)}
                    className="text-[11px] px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300"
                  >
                    Delete
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
