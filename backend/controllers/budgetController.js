const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// create or update budget
exports.upsertBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;
    const userId = req.userId;

    if (!category || !amount) {
      return res.status(400).json({ message: "Category and amount required." });
    }

    const updated = await Budget.findOneAndUpdate(
      { userId, category, month, year },
      { amount },
      { upsert: true, new: true }
    );

    res.json({ message: "Budget saved", budget: updated });
  } catch (err) {
    console.error("Budget upsert error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// get budgets for a month
exports.getBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    const budgets = await Budget.find({ userId, month, year });
    res.json({ budgets });
  } catch (err) {
    console.error("Budget fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// delete budget
exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const budgetId = req.params.id;

    await Budget.deleteOne({ _id: budgetId, userId });
    res.json({ message: "Budget deleted" });
  } catch (err) {
    console.error("Budget delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// budget progress calculation (used in dashboard)
exports.calculateBudgetProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required." });
    }

    // 1) Get all budgets for this user + month + year
    const budgets = await Budget.find({ userId, month, year });

    if (!budgets.length) {
      return res.json({ summary: [] });
    }

    const objUserId = new mongoose.Types.ObjectId(userId);

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    // 2) Aggregate total expense per category (for THIS month/year)
    const spentAgg = await Transaction.aggregate([
      {
        $match: {
          userId: objUserId,
          type: "expense", // ✅ sirf expenses count honge, income ignore
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // 3) Map category -> totalSpent
    const spentMap = new Map();
    spentAgg.forEach((row) => {
      spentMap.set(row._id, row.total);
    });

    // 4) Final summary build
    const summary = budgets.map((b) => {
      const spent = spentMap.get(b.category) || 0;
      const percentage =
        b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;

      return {
        category: b.category,
        budget: b.amount,
        spent,
        percentage,
      };
    });

    res.json({ summary });
  } catch (err) {
    console.error("Budget progress error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
