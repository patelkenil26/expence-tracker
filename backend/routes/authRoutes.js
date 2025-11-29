const express = require("express");
const { signup, login, getMe, updateProfile, changePassword } = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);

// ✅ Settings tab ke liye nayi routes
router.patch("/profile",protect, updateProfile);          // name/email update
router.patch("/change-password",protect, changePassword); // password update

module.exports = router;
