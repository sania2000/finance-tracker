const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true, min: [0, "Amount must be positive"] },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: function () {
      return this.type === "expense";
    },
  },
  date: { type: Date, default: Date.now },
  description: { type: String, trim: true },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
