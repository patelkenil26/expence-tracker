import React from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";

export default function DeleteConfirm({ title, message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-20 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="p-4 w-full max-w-sm">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
          {title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{message}</p>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}
