import React, { useState } from "react";
import Card from "../ui/Card";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";

export default function CategoryForm({ defaultValues, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: defaultValues?.name || "",
    color: defaultValues?.color || "#4f46e5",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-20 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="p-4 w-full max-w-md bg-white dark:bg-slate-950">
        <h2 className="text-sm font-semibold mb-3">
          {defaultValues ? "Edit Category" : "Add Category"}
        </h2>

        <div className="space-y-3">
          <TextInput
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Food, Travel, Salary"
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-600 dark:text-slate-400">
              Color
            </label>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="h-9 w-16 rounded border dark:border-slate-600 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => onSubmit(form)}>
              {defaultValues ? "Save Changes" : "Add Category"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
