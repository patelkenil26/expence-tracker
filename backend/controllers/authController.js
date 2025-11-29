const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User created Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("SignUp Error", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password not Matched",
      });
    }

    const token = generateToken(user._id);

    console.log("LOGIN userId:", user._id.toString(), "email:", user.email);

    res.status(200).json({
      message: "Logged in Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    console.log("GET /me req.userId:", req.userId);

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("GetMe Error ", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId,"User ID")
    const { email, name } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Nothing to update. Please provide name and email",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });

      if (existing && existing._id.toString() !== userId.toString()) {
        return res.status(400).json({
          message: "This email is already in use.",
        });
      }
      user.email = email;
    }

    if (name) {
      user.name = name.trim();
    }

    await user.save();

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({
      message: "Profile updated successfully.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    // Optional: old & new same na ho
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        message: "New password cannot be same as current password.",
      });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};