/**
 * Centralized Category Configuration & Metadata
 * Provides standard categories, badges, colors, and default groupings.
 */

export const DEFAULT_CATEGORY_NAMES = [
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

export const CATEGORY_METADATA = {
  Salary: {
    label: "Salary",
    type: "income",
    color: "#10b981", // emerald
    bgLight: "rgba(16, 185, 129, 0.12)",
    borderLight: "rgba(16, 185, 129, 0.25)",
  },
  Freelance: {
    label: "Freelance",
    type: "income",
    color: "#06b6d4", // cyan
    bgLight: "rgba(6, 182, 212, 0.12)",
    borderLight: "rgba(6, 182, 212, 0.25)",
  },
  Business: {
    label: "Business",
    type: "income",
    color: "#6366f1", // indigo
    bgLight: "rgba(99, 102, 241, 0.12)",
    borderLight: "rgba(99, 102, 241, 0.25)",
  },
  Food: {
    label: "Food & Dining",
    type: "expense",
    color: "#f59e0b", // amber
    bgLight: "rgba(245, 158, 11, 0.12)",
    borderLight: "rgba(245, 158, 11, 0.25)",
  },
  Travel: {
    label: "Travel & Fuel",
    type: "expense",
    color: "#3b82f6", // blue
    bgLight: "rgba(59, 130, 246, 0.12)",
    borderLight: "rgba(59, 130, 246, 0.25)",
  },
  Rent: {
    label: "Rent & Housing",
    type: "expense",
    color: "#ec4899", // pink
    bgLight: "rgba(236, 72, 153, 0.12)",
    borderLight: "rgba(236, 72, 153, 0.25)",
  },
  Shopping: {
    label: "Shopping",
    type: "expense",
    color: "#8b5cf6", // purple
    bgLight: "rgba(139, 92, 246, 0.12)",
    borderLight: "rgba(139, 92, 246, 0.25)",
  },
  Bills: {
    label: "Bills & Utilities",
    type: "expense",
    color: "#ef4444", // red
    bgLight: "rgba(239, 68, 68, 0.12)",
    borderLight: "rgba(239, 68, 68, 0.25)",
  },
  Entertainment: {
    label: "Entertainment",
    type: "expense",
    color: "#14b8a6", // teal
    bgLight: "rgba(20, 184, 166, 0.12)",
    borderLight: "rgba(20, 184, 166, 0.25)",
  },
  Health: {
    label: "Health & Fitness",
    type: "expense",
    color: "#10b981", // emerald
    bgLight: "rgba(16, 185, 129, 0.12)",
    borderLight: "rgba(16, 185, 129, 0.25)",
  },
  Other: {
    label: "Other",
    type: "both",
    color: "#64748b", // slate
    bgLight: "rgba(100, 116, 139, 0.12)",
    borderLight: "rgba(100, 116, 139, 0.25)",
  },
};

export const getCategoryColor = (name) => {
  return CATEGORY_METADATA[name]?.color || "#6366f1";
};
