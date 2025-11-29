const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const {
      amount,
      type,
      category,
      date,
      note,
      isRecurring,
      recurringFrequency,
    } = req.body;

    if (!amount || !type || !category || !date) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      amount,
      type,
      category,
      date,
      note: note || "",
      isRecurring: !!isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency || "monthly" : null,
    });

    res.status(200).json({
      message: "Transaction created",
      transaction,
    });
  } catch (error) {
    console.error("Create Transaction Error", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// controllers/transactionController.js

exports.getTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sort = "desc",
    } = req.query;

    const query = { userId: req.userId };

    if (type && ["income", "expense"].includes(type)) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOption = sort === "asc" ? { date: 1 } : { date: -1 };

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(query),
    ]);

    res.json({
      message: "Transactions fetched successfully.",
      data: transactions, // 👈 IMPORTANT: ab "data" key pe array
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Get transactions error: ", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: id,
        userId: req.userId,
      },
      req.body,
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json({
      message: "Transaction updated",
      transaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
