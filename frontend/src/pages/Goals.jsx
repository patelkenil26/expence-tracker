// src/pages/Goals.jsx
import React, { useState } from "react";
import { FiFlag, FiPlus, FiTrash2, FiTarget, FiTrendingUp } from "react-icons/fi";
import toast from "react-hot-toast";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";
import { useGoalsData } from "../hooks/useGoalsData";
import { formatCurrency, formatDate } from "../utils/format";

function Goals() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [contribGoal, setContribGoal] = useState(null);
  const [contribAmount, setContribAmount] = useState("");

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    note: "",
  });

  // TanStack Query custom hook for goals
  const {
    goals,
    loading,
    createGoal,
    creating,
    deleteGoal,
    deleting,
    addContribution,
    contributing,
  } = useGoalsData();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!form.name || !form.targetAmount) {
      toast.error("Name and target amount are required.");
      return;
    }

    try {
      await createGoal({
        name: form.name,
        targetAmount: Number(form.targetAmount),
        deadline: form.deadline || undefined,
        note: form.note || "",
      });
      setShowAddModal(false);
      setForm({
        name: "",
        targetAmount: "",
        deadline: "",
        note: "",
      });
    } catch {
      // Handled in TanStack mutation
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Delete this savings goal?")) return;
    try {
      await deleteGoal(id);
    } catch {
      // Handled in TanStack mutation
    }
  };

  const openContribModal = (goal) => {
    setContribGoal(goal);
    setContribAmount("");
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!contribGoal) return;

    const amt = Number(contribAmount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      await addContribution({ id: contribGoal._id, amount: amt });
      setContribGoal(null);
      setContribAmount("");
    } catch {
      // Handled in TanStack mutation
    }
  };

  // Derived summaries
  const totalTarget = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);
  const totalCurrent = goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
  const completedCount = goals.filter((g) => g.status === "completed").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <PageHeader
        title="Savings Goals"
        subtitle="Set milestone financial goals, allocate savings, and track completion progress."
        icon={<FiFlag />}
        actions={
          <Button variant="gradient" onClick={() => setShowAddModal(true)}>
            <FiPlus />
            <span>New Savings Goal</span>
          </Button>
        }
      />

      {/* KPI Cards Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-1">
          <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)]">
            Total Target
          </p>
          <p className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
            {formatCurrency(totalTarget)}
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">Target across all active goals</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-1">
          <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)]">
            Current Savings
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalCurrent)}
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {totalTarget > 0 ? `${Math.round((totalCurrent / totalTarget) * 100)}% achieved` : "0% achieved"}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-1">
          <p className="text-xs font-semibold uppercase text-[var(--color-text-muted)]">
            Milestones Completed
          </p>
          <p className="text-xl sm:text-2xl font-black text-[var(--color-primary)]">
            {completedCount} / {goals.length}
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">Goals reached 100% target</p>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <Card
        title="Active Goals"
        subtitle="Manage contributions and track progress bars"
      >
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
            Loading savings goals...
          </div>
        ) : goals.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs text-slate-400">No savings goals created yet.</p>
            <Button size="xs" variant="outline" onClick={() => setShowAddModal(true)}>
              Create your first savings goal
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((g) => {
              const current = g.currentAmount || 0;
              const target = g.targetAmount || 1;
              const pct = Math.min(100, Math.round((current / target) * 100));
              const isCompleted = g.status === "completed" || pct >= 100;

              return (
                <div
                  key={g._id}
                  className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col justify-between space-y-4 hover:border-[var(--color-primary)] transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {g.name}
                        </h4>
                        {g.deadline && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Target Date: {formatDate(g.deadline)}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30"
                        }`}
                      >
                        {isCompleted ? "Achieved" : `${pct}%`}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Saved:</span>
                        <span className="text-slate-900 dark:text-slate-100">
                          {formatCurrency(current)} / {formatCurrency(target)}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-[var(--color-surface-elevated)] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? "bg-emerald-500" : "bg-[var(--color-primary)]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => openContribModal(g)}
                      disabled={isCompleted}
                    >
                      <FiTrendingUp className="text-xs" />
                      <span>Add Funds</span>
                    </Button>

                    <button
                      onClick={() => handleDeleteGoal(g._id)}
                      disabled={deleting}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Delete goal"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl p-6 transition-all transform scale-100 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[var(--color-text-main)] mb-4 pb-2 border-b border-[var(--color-border)]">
              New Savings Goal
            </h3>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider">
                  Goal Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Vacation Fund, Car Down Payment"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-main)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider">
                  Target Amount (INR)
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={form.targetAmount}
                  onChange={handleFormChange}
                  placeholder="50000"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-main)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider">
                  Target Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-main)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  loading={creating}
                >
                  Save Goal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribute Funds Modal */}
      {contribGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl p-6 transition-all transform scale-100 max-h-[92vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[var(--color-text-main)] mb-2">
              Contribute to {contribGoal.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Add savings to this goal to boost your completion progress.
            </p>

            <form onSubmit={handleContribute} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wider">
                  Deposit Amount (INR)
                </label>
                <input
                  type="number"
                  min="1"
                  value={contribAmount}
                  onChange={(e) => setContribAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-main)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setContribGoal(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  loading={contributing}
                >
                  Add Funds
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
