const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    color: {
      type: String,
      default: "#4f46e5", // default indigo
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
