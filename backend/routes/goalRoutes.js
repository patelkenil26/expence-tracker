const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  contributeToGoal,
} = require("../controllers/goalController");

const router = express.Router();

router.use(protect);

// POST /api/goals
router.post("/", createGoal);

// GET /api/goals
router.get("/", getGoals);

// PUT /api/goals/:id
router.put("/:id", updateGoal);

// PATCH /api/goals/:id/contribute
router.patch("/:id/contribute", contributeToGoal);

// DELETE /api/goals/:id
router.delete("/:id", deleteGoal);

module.exports = router;
