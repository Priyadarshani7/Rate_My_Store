const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { auth, checkRole } = require("../middlewares/auth");

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, address, role } = req.body;
    // Accept only valid roles, otherwise error
    const validRoles = ["normal_user", "store_owner"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role selected" });
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      address,
      role,
    });
    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        address: user.address,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        // ...other fields
      },
    });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await User.login(email, password);

    if (!result) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
});

// Protected route example
router.get("/admin", auth, checkRole(["system_administrator"]), (req, res) => {
  res.json({ message: "Welcome admin!" });
});

router.get("/store_owner", auth, checkRole(["store_owner"]), (req, res) => {
  res.json({ message: "Welcome store owner!" });
});

module.exports = router;
