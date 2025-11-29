const Goal = require("../models/Goal");

// ---------------------
// CREATE GOAL
// POST /api/goals
// ---------------------
exports.createGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, targetAmount, deadline, note } = req.body;

    if (!name || targetAmount === undefined) {
      return res.status(400).json({
        message: "Name and target amount are required.",
      });
    }

    if (Number(targetAmount) <= 0) {
      return res.status(400).json({
        message: "Target amount must be greater than 0.",
      });
    }

    const goal = await Goal.create({
      userId,
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      deadline: deadline ? new Date(deadline) : undefined,
      note: note?.trim() || "",
      status: "active",
    });

    res.status(201).json({
      message: "Goal created successfully.",
      goal,
    });
  } catch (error) {
    console.error("Create goal error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------
// GET GOALS (list)
// GET /api/goals?status=active|completed
// ---------------------
exports.getGoals = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    const query = { userId };

    if (status && ["active", "completed"].includes(status)) {
      query.status = status;
    }

    const goals = await Goal.find(query).sort({ createdAt: -1 });

    res.json({
      data: goals,
    });
  } catch (error) {
    console.error("Get goals error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------
// UPDATE GOAL (name, target, deadline, note, status)
// PUT /api/goals/:id
// ---------------------
exports.updateGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, targetAmount, currentAmount, deadline, note, status } =
      req.body;

    const goal = await Goal.findOne({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found.",
      });
    }

    if (name !== undefined) {
      goal.name = name.trim();
    }

    if (targetAmount !== undefined) {
      const t = Number(targetAmount);
      if (t <= 0) {
        return res.status(400).json({
          message: "Target amount must be greater than 0.",
        });
      }
      goal.targetAmount = t;
    }

    if (currentAmount !== undefined) {
      const c = Number(currentAmount);
      if (c < 0) {
        return res.status(400).json({
          message: "Current amount cannot be negative.",
        });
      }
      goal.currentAmount = c;
    }

    if (deadline !== undefined) {
      goal.deadline = deadline ? new Date(deadline) : undefined;
    }

    if (note !== undefined) {
      goal.note = note.trim();
    }

    if (status && ["active", "completed"].includes(status)) {
      goal.status = status;
    }

    // auto complete if current >= target
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "completed";
    }

    await goal.save();

    res.json({
      message: "Goal updated successfully.",
      goal,
    });
  } catch (error) {
    console.error("Update goal error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------
// ADD CONTRIBUTION
// PATCH /api/goals/:id/contribute
// ---------------------
exports.contributeToGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { amount } = req.body;

    if (amount === undefined) {
      return res
        .status(400)
        .json({ message: "Contribution amount is required." });
    }

    const contribution = Number(amount);
    if (contribution <= 0) {
      return res
        .status(400)
        .json({ message: "Contribution amount must be greater than 0." });
    }

    const goal = await Goal.findOne({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found." });
    }

    let newCurrent = goal.currentAmount + contribution;
    if (newCurrent < 0) newCurrent = 0;

    goal.currentAmount = newCurrent;

    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "completed";
    } else if (goal.status === "completed") {
      // agar user ne amount kam kar diya ho to phir active ho sakta hai
      goal.status = "active";
    }

    await goal.save();

    res.json({
      message: "Contribution added successfully.",
      goal,
    });
  } catch (error) {
    console.error("Contribute goal error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------
// DELETE GOAL
// DELETE /api/goals/:id
// ---------------------
exports.deleteGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found.",
      });
    }

    res.json({ message: "Goal deleted successfully." });
  } catch (error) {
    console.error("Delete goal error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
