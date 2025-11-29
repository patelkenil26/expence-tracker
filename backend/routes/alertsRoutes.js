const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getAlerts } = require("../controllers/alertsController");

const router = express.Router();

router.use(protect);

router.get("/", getAlerts);

module.exports = router;
