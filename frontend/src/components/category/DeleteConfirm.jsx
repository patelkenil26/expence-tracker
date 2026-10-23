import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { FiAlertTriangle } from "react-icons/fi";

export default function DeleteConfirm({ title, message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="p-5 w-full max-w-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg shrink-0">
            <FiAlertTriangle />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">
            {title}
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-2.5">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}
