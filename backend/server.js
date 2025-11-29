const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const statesRoutes = require("./routes/statsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const alertsRoutes = require("./routes/alertsRoutes");

dotenv.config();

app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://expence-tracker-beta-gray.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/stats", statesRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/alerts", alertsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// TODO: yaha authRoutes, transactionRoutes etc mount karenge
// app.use('/api/auth', authRoutes);
// app.use('/api/transactions', transactionRoutes);

// Mongo connect + server start
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err.message);
  });
