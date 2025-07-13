const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database to initialize connection
require("./config/database");

const authRoutes = require("./routes/auth");
const storeRoutes = require("./routes/store");
const adminRoutes = require("./routes/admin");
const ratingsRoutes = require("./routes/ratings");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ratings", ratingsRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Welcome to RateStore API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Log environment
console.log(" Environment:", process.env.NODE_ENV);
console.log("Port:", process.env.PORT || 3000);

module.exports = app;
