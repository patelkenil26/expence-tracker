const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name) return res.status(400).json({ message: "Category name required" });

    const exists = await Category.findOne({ userId: req.userId, name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const cat = await Category.create({
      userId: req.userId,
      name,
      color: color || "#4f46e5"
    });

    res.json({ message: "Category created", category: cat });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const list = await Category.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ categories: list });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    const { id } = req.params;

    const cat = await Category.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { name, color },
      { new: true }
    );

    if (!cat) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category updated", category: cat });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const cat = await Category.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!cat) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
