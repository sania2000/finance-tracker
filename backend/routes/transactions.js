const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create a transaction
router.post("/", auth, async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;

    if (type === "expense" && !category) {
      return res
        .status(400)
        .json({ message: "Category is required for expense" });
    }

    const newTx = new Transaction({
      user: req.user._id,
      amount: parseFloat(amount),
      type,
      category: type === "expense" ? category : undefined,
      date: date ? new Date(date) : Date.now(),
      description: description ? description.trim() : "",
    });

    const savedTx = await newTx.save();
    res.status(201).json(savedTx);
  } catch (err) {
    console.error("POST /api/transactions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all transactions for the user, with optional filters
router.get("/", auth, async (req, res) => {
  try {
    const { category, type, from, to } = req.query;
    const filter = { user: req.user._id };

    if (type) {
      filter.type = type;
    }
    if (category) {
      filter.category = category;
    }
    if (from || to) {
      filter.date = {};
      if (from) {
        filter.date.$gte = new Date(from);
      }
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        filter.date.$lte = toDate;
      }
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .populate("category", "name");
    res.json(transactions);
  } catch (err) {
    console.error("GET /api/transactions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove a transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (tx.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await tx.deleteOne();
    res.json({ message: "Transaction removed" });
  } catch (err) {
    console.error("DELETE /api/transactions/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
