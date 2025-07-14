const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database to initialize connection
require("./config/database");

const authRoutes = require("./routes/auth"); // should be ./routes/auth.js or ./routes/auth/index.js
const adminRoutes = require("./routes/admin/admin");
const userRoutes = require("./routes/user/user");
const storeOwnerRoutes = require("./routes/storeOwner/storeOwner");
const storeRoutes = require("./routes/store/store");
const ratingsRoutes = require("./routes/ratings/ratings");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/store-owner", storeOwnerRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingsRoutes); // <-- This line registers the ratings route

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
