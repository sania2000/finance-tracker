// backend/routes/categories.js
const express = require("express");
const Category = require("../models/Category");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Returns all categories belonging to the logged in user
router.get("/", auth, async (req, res) => {
  try {
    const cats = await Category.find({ user: req.user._id }).sort("name");
    res.json(cats);
  } catch (err) {
    console.error("GET /api/categories error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new category
router.post("/", auth, async (req, res) => {
  try {
    const { name, monthlyBudget = 0 } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Prevent duplicates
    const exists = await Category.findOne({
      user: req.user._id,
      name: name.trim(),
    });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCat = new Category({
      user: req.user._id,
      name: name.trim(),
      monthlyBudget: parseFloat(monthlyBudget) || 0,
    });
    const saved = await newCat.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /api/categories error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a category
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, monthlyBudget } = req.body;
    const cat = await Category.findById(req.params.id);
    if (!cat) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (cat.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (name && name.trim()) cat.name = name.trim();
    if (monthlyBudget != null)
      cat.monthlyBudget = parseFloat(monthlyBudget) || 0;
    const updated = await cat.save();
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/categories/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a category
router.delete("/:id", auth, async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    if (cat.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await cat.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("DELETE /api/categories/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
