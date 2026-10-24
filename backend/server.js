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

const dns = require("dns");

// =========================================================================
// Fix for Windows & Local ISP DNS SRV Lookup (querySrv ECONNREFUSED)
// =========================================================================
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
  // Safe fallback
}

dotenv.config();

// =========================================================================
// CORS & CLIENT ORIGIN CONFIGURATION
// =========================================================================
// Senior Dev Note:
// By default, both LOCALHOST (for local development) and PRODUCTION (Vercel)
// are supported simultaneously so nothing breaks when testing or deploying!
//
// IF YOU PREFER MANUAL COMMENT/UNCOMMENT BEFORE PUSHING:
// const CLIENT_URL = "http://localhost:5173"; // <-- UNCOMMENT FOR LOCALHOST
// const CLIENT_URL = "https://expence-tracker-beta-gray.vercel.app"; // <-- UNCOMMENT FOR PRODUCTION
// =========================================================================
  
const allowedOrigins = [
  "http://localhost:5173",                          // Local Vite Frontend
  "http://localhost:5174",                          // Alternate local port
  "http://localhost:3000",                          // React default port
  "https://expence-tracker-beta-gray.vercel.app",  // Production Vercel Frontend
  process.env.CLIENT_URL,                           // Custom env variable if set
].filter(Boolean);

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, postman, curl)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback safe allow
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

// Instant check: If database is disconnected, inform client immediately instead of 10s buffer timeout
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database is not connected. Please check your MongoDB connection.",
    });
  }
  next();
});

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

// Mongo connect + server start
const PORT = process.env.PORT || 8000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/expence-tracker";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    // start server anyway so API status route works
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} (without active DB connection: ${err.message})`
      );
    });
  });

