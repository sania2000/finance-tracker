const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Returns an array of for expenses in that month. (Json)
router.get("/category-pie", auth, async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res
        .status(400)
        .json({ message: "month query param is required (e.g. 2025-06)" });
    }
    const [year, mon] = month.split("-").map((v) => parseInt(v, 10));
    if (!year || !mon || mon < 1 || mon > 12) {
      return res
        .status(400)
        .json({ message: "month must be in YYYY-MM format" });
    }
    const start = new Date(year, mon - 1, 1);
    const end = new Date(year, mon, 1);
    const userId = req.user._id;

    const data = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          _id: 0,
          category: "$categoryInfo.name",
          total: 1,
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    console.error("GET /api/reports/category-pie error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
