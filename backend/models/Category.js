const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true, trim: true },
  monthlyBudget: {
    type: Number,
    default: 0,
    min: [0, "Monthly budget cannot be negative"],
  },
});

module.exports = mongoose.model("Category", CategorySchema);
