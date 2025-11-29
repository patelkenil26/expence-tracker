import React, { useCallback, useEffect, useState } from "react";
import { FiFlag, FiPlus, FiTrash2, FiTarget, FiTrendingUp } from "react-icons/fi";
import toast from "react-hot-toast";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";
import {
  getGoalsApi,
  createGoalApi,
  deleteGoalApi,
  contributeGoalApi,
} from "../api/goalsApi";
import { formatCurrency, formatDate } from "../utils/format";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [contribGoal, setContribGoal] = useState(null);
  const [contribAmount, setContribAmount] = useState("");
  const [contribLoading, setContribLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    note: "",
  });

  // -------------------------
  // Fetch goals
  // -------------------------
  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getGoalsApi();
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setGoals(list);
    } catch (err) {
      console.error("Get goals error:", err);
      toast.error("Failed to load goals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // -------------------------
  // Add goal
  // -------------------------
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
      setAddLoading(true);
      await createGoalApi({
        name: form.name,
        targetAmount: Number(form.targetAmount),
        deadline: form.deadline || undefined,
        note: form.note || "",
      });
      toast.success("Goal created.");
      setShowAddModal(false);
      setForm({
        name: "",
        targetAmount: "",
        deadline: "",
        note: "",
      });
      fetchGoals();
    } catch (err) {
      console.error("Create goal error:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to create goal. Please try again.";
      toast.error(msg);
    } finally {
      setAddLoading(false);
    }
  };

  // -------------------------
  // Delete goal
  // -------------------------
  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await deleteGoalApi(id);
      toast.success("Goal deleted.");
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      console.error("Delete goal error:", err);
      toast.error("Failed to delete goal.");
    }
  };

  // -------------------------
  // Contribute to goal
  // -------------------------
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
      setContribLoading(true);
      await contributeGoalApi(contribGoal._id, amt);
      toast.success("Contribution added.");
      setContribGoal(null);
      setContribAmount("");
      fetchGoals();
    } catch (err) {
      console.error("Contribute goal error:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to add contribution. Please try again.";
      toast.error(msg);
    } finally {
      setContribLoading(false);
    }
  };

  // -------------------------
  // Derived summary
  // -------------------------
  const totalTarget = goals.reduce(
    (sum, g) => sum + (g.targetAmount || 0),
    0
  );
  const totalCurrent = goals.reduce(
    (sum, g) => sum + (g.currentAmount || 0),
    0
  );
  const completedCount = goals.filter((g) => g.status === "completed").length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Goals"
        subtitle="Set financial goals and track your progress over time."
        icon={<FiFlag />}
        actions={
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus className="text-xs" />
            <span className="text-xs sm:text-sm">Add Goal</span>
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Total target amount
              </p>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-1">
                {formatCurrency(totalTarget)}
              </p>
            </div>
            <FiTarget className="text-slate-400 dark:text-slate-500 text-xl" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Saved towards goals
              </p>
              <p className="text-lg font-semibold text-emerald-500 mt-1">
                {formatCurrency(totalCurrent)}
              </p>
            </div>
            <FiTrendingUp className="text-emerald-400 text-xl" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Completed goals
              </p>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 mt-1">
                {completedCount} / {goals.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Goals list */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              All goals
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create savings targets and monitor how close you are.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Loading goals...
          </div>
        ) : goals.length === 0 ? (
          <div className="py-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
            No goals yet. Create your first saving goal.
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => {
              const target = goal.targetAmount || 0;
              const current = goal.currentAmount || 0;
              const percent =
                target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

              const isCompleted = goal.status === "completed";

              return (
                <div
                  key={goal._id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-3 py-3 text-xs flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {goal.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {isCompleted ? "Completed" : "Active"}
                      </span>
                    </div>
                    {goal.note && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {goal.note}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {formatCurrency(current)} / {formatCurrency(target)} ·{" "}
                      <span className="font-semibold">{percent}%</span> completed
                      {goal.deadline && (
                        <>
                          {" · "}
                          Target by {formatDate(goal.deadline)}
                        </>
                      )}
                    </p>

                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-1">
                      <div
                        className={`h-full ${
                          isCompleted ? "bg-emerald-500" : "bg-indigo-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 sm:mt-0 flex items-center gap-2 justify-end">
                    {!isCompleted && (
                      <Button
                        variant="outline"
                        size="xs"
                        className="text-[11px]"
                        onClick={() => openContribModal(goal)}
                      >
                        Add progress
                      </Button>
                    )}
                    <button
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300"
                    >
                      <FiTrash2 className="text-[10px]" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Add Goal modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Add goal
            </h2>
            <form onSubmit={handleCreateGoal} className="space-y-3 text-sm">
              <TextInput
                label="Goal name"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="e.g. New Phone, Emergency Fund"
              />
              <TextInput
                label="Target amount (₹)"
                name="targetAmount"
                type="number"
                min="0"
                value={form.targetAmount}
                onChange={handleFormChange}
                placeholder="e.g. 50000"
              />
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Note (optional)
                </label>
                <textarea
                  name="note"
                  rows={2}
                  value={form.note}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="e.g. Save for iPhone, target before Diwali..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => !addLoading && setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                  disabled={addLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-wait text-white text-xs sm:text-sm font-medium"
                >
                  {addLoading ? "Saving..." : "Save goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribution modal */}
      {contribGoal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Add progress
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Goal:{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {contribGoal.name}
              </span>{" "}
              · Current: {formatCurrency(contribGoal.currentAmount)} /{" "}
              {formatCurrency(contribGoal.targetAmount)}
            </p>
            <form onSubmit={handleContribute} className="space-y-3 text-sm">
              <TextInput
                label="Amount to add (₹)"
                type="number"
                min="0"
                value={contribAmount}
                onChange={(e) => setContribAmount(e.target.value)}
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => !contribLoading && setContribGoal(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                  disabled={contribLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contribLoading}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-wait text-white text-xs sm:text-sm font-medium"
                >
                  {contribLoading ? "Updating..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
