require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const txRoutes = require("./routes/transactions");
const catRoutes = require("./routes/categories");
const reportsRoutes = require("./routes/reports");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", txRoutes);
app.use("/api/categories", catRoutes);
app.use("/api/reports", reportsRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
