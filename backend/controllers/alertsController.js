const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");

// GET /api/alerts?month=11&year=2025
exports.getAlerts = async (req, res) => {
  try {
    const now = new Date();
    let { month, year } = req.query;

    month = Number(month) || now.getMonth() + 1; // 1–12
    year = Number(year) || now.getFullYear();

    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    // -----------------------------------
    // 1) BUDGET ALERTS (current month/year)
    // -----------------------------------
    const budgets = await Budget.find({
      userId: userObjectId,
      month,
      year,
      type: "expense",
    });

    // is month ke expenses ka aggregation
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

    const spentAgg = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          type: "expense",
          date: { $gte: monthStart, $lte: monthEnd },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const spentMap = new Map();
    spentAgg.forEach((r) => {
      spentMap.set(r._id, r.total);
    });

    const budgetAlerts = [];

    budgets.forEach((b) => {
      const spent = spentMap.get(b.category) || 0;
      if (!b.amount || b.amount <= 0) return;

      const ratio = spent / b.amount; // 0–infinity

      let level = null;
      let message = "";

      if (ratio >= 1) {
        level = "danger";
        message = `Your "${b.category}" budget (₹${b.amount}) has been exceeded. Spent ₹${spent}.`;
      } else if (ratio >= 0.8) {
        level = "warning";
        const pct = Math.round(ratio * 100);
        message = `You have used ${pct}% of your "${b.category}" budget this month.`;
      }

      if (level) {
        budgetAlerts.push({
          id: b._id,
          source: "budget",
          level,
          category: b.category,
          month,
          year,
          limit: b.amount,
          spent,
          remaining: Math.max(b.amount - spent, 0),
          message,
        });
      }
    });

    // -----------------------------------
    // 2) GOAL ALERTS
    // -----------------------------------
    const goals = await Goal.find({
      userId: userObjectId,
      status: { $in: ["active", "completed"] },
    });

    const goalAlerts = [];
    const today = new Date();

    goals.forEach((g) => {
      const target = g.targetAmount || 0;
      const current = g.currentAmount || 0;
      if (target <= 0) return;

      const progress = current / target; // 0–∞
      let daysLeft = null;

      if (g.deadline) {
        const diffMs = g.deadline.getTime() - today.getTime();
        daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      }

      // completed goal
      if (progress >= 1 && g.status !== "completed") {
        goalAlerts.push({
          id: g._id,
          source: "goal",
          level: "success",
          title: g.title,
          message: `Congrats! You have reached your goal "${g.title}".`,
          targetAmount: target,
          currentAmount: current,
          progress,
          daysLeft,
        });
        return;
      }

      // deadline close & not completed
      if (g.deadline && daysLeft !== null && daysLeft <= 7 && progress < 1) {
        goalAlerts.push({
          id: g._id,
          source: "goal",
          level: "warning",
          title: g.title,
          message: `Only ${daysLeft} day(s) left for goal "${g.title}". You are at ${Math.round(
            progress * 100
          )}% of target.`,
          targetAmount: target,
          currentAmount: current,
          progress,
          daysLeft,
        });
        return;
      }

      // generic info if progress high (>= 80%)
      if (progress >= 0.8 && progress < 1) {
        goalAlerts.push({
          id: g._id,
          source: "goal",
          level: "info",
          title: g.title,
          message: `You have completed ${Math.round(
            progress * 100
          )}% of goal "${g.title}". Keep going!`,
          targetAmount: target,
          currentAmount: current,
          progress,
          daysLeft,
        });
      }
    });

    res.json({
      month,
      year,
      budgets: budgetAlerts,
      goals: goalAlerts,
    });
  } catch (error) {
    console.error("Alerts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
