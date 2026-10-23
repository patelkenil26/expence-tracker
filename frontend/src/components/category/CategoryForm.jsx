import React, { useState } from "react";
import Card from "../ui/Card";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";
import { CHART_COLORS } from "../../constants/theme";

export default function CategoryForm({ defaultValues, initialData, onClose, onSubmit, onCancel }) {
  const initial = initialData || defaultValues;
  const [form, setForm] = useState({
    name: initial?.name || "",
    color: initial?.color || CHART_COLORS[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  const handleClose = onCancel || onClose;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Category Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="e.g. Groceries, Investment, Books"
        required
        autoFocus
      />

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Category Color Tag
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {CHART_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, color }))}
              style={{ backgroundColor: color }}
              className={`h-7 w-7 rounded-full transition-transform cursor-pointer ${
                form.color === color
                  ? "ring-2 ring-offset-2 ring-[var(--color-primary)] scale-110"
                  : "hover:scale-105"
              }`}
              aria-label={`Select color ${color}`}
            />
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="h-8 w-10 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
              title="Custom color"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button variant="ghost" size="sm" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="gradient" size="sm" type="submit">
          {initial ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
