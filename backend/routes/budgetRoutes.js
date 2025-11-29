const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  upsertBudget,
  getBudgets,
  deleteBudget,
  calculateBudgetProgress,
} = require("../controllers/budgetController");

router.use(protect);

router.post("/", upsertBudget);
router.get("/", getBudgets);
router.delete("/:id", deleteBudget);
router.get("/progress", calculateBudgetProgress);

module.exports = router;
