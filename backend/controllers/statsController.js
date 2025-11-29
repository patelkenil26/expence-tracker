const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

// helper: get month start & end dates
const getMonthRange = (month, year) => {
  // month: 1-12
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999); // last day of month
  return { start, end };
};

// GET /api/stats/summary?month=11&year=2025
exports.getSummary = async (req, res) => {
  try {
    let { month, year } = req.query;

    const now = new Date();
    month = Number(month) || now.getMonth() + 1; // default current month
    year = Number(year) || now.getFullYear(); // default current year

    const { start, end } = getMonthRange(month, year);

    const transactions = await Transaction.find({
      userId: req.userId,
      date: { $gte: start, $lte: end },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += t.amount;
      if (t.type === "expense") totalExpense += t.amount;
    });

    const balance = totalIncome - totalExpense;

    res.json({
      month,
      year,
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (error) {
    console.error("Summary stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/stats/by-category?month=11&year=2025&type=expense
// GET /api/stats/by-category?month=11&year=2025&type=expense
exports.getByCategory = async (req, res) => {
  try {
    let { month, year, type = "expense" } = req.query;

    const now = new Date();
    month = Number(month) || now.getMonth() + 1;
    year = Number(year) || now.getFullYear();

    const { start, end } = getMonthRange(month, year);

    const userObjectId = new mongoose.Types.ObjectId(req.userId); // ✅ cast

    const result = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          type,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
        },
      },
    ]);

    res.json({
      month,
      year,
      type,
      data: result,
    });
  } catch (error) {
    console.error("By-category stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/stats/monthly?year=2025&type=expense
// GET /api/stats/monthly?year=2025
exports.getMonthly = async (req, res) => {
  try {
    let { year } = req.query;
    const now = new Date();
    year = Number(year) || now.getFullYear();

    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    // ✅ userId ko ObjectId me convert karo (bilkul getByCategory ki tarah)
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const agg = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: start, $lte: end },
        },
      },
      // month + type wise group
      {
        $group: {
          _id: { month: { $month: "$date" }, type: "$type" },
          totalAmount: { $sum: "$amount" },
        },
      },
      // ek hi month me income/expense ko alag fields me daal do
      {
        $group: {
          _id: "$_id.month",
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id", // 1–12
          totalIncome: 1,
          totalExpense: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // total year-wise sum
    let totalIncomeYear = 0;
    let totalExpenseYear = 0;
    agg.forEach((m) => {
      totalIncomeYear += m.totalIncome || 0;
      totalExpenseYear += m.totalExpense || 0;
    });

    res.json({
      year,
      data: agg, // [{month: 1, totalIncome, totalExpense}, ...]
      totalIncome: totalIncomeYear,
      totalExpense: totalExpenseYear,
    });
  } catch (error) {
    console.error("Monthly stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/stats/category-usage?scope=month&month=11&year=2025
// scope: 'month' | 'year' | 'all'  (default: 'month')
exports.getCategoryUsage = async (req, res) => {
  try {
    let { scope = "month", month, year } = req.query;

    const now = new Date();
    year = Number(year) || now.getFullYear();

    let dateFilter = null;

    if (scope === "month") {
      // current month / ya query se
      const m = Number(month) || now.getMonth() + 1;
      const { start, end } = getMonthRange(m, year);
      dateFilter = { $gte: start, $lte: end };
      month = m;
    } else if (scope === "year") {
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31, 23, 59, 59, 999);
      dateFilter = { $gte: start, $lte: end };
    } else {
      // scope === 'all' => koi date filter nahi
      dateFilter = null;
    }

    const match = {
      userId: new mongoose.Types.ObjectId(req.userId),
    };

    if (dateFilter) {
      match.date = dateFilter;
    }

    const result = await Transaction.aggregate([
      {
        $match: match,
      },
      {
        // category + type wise sum
        $group: {
          _id: { category: "$category", type: "$type" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        // ek hi category me income / expense alag fields
        $group: {
          _id: "$_id.category",
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalIncome: 1,
          totalExpense: 1,
        },
      },
      { $sort: { category: 1 } },
    ]);

    res.json({
      scope,
      month: scope === "month" ? month : undefined,
      year,
      data: result,
    });
  } catch (error) {
    console.error("Category usage stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
