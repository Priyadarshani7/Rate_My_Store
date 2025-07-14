const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const bcrypt = require("bcryptjs");
const { auth } = require("../../middlewares/auth");

// Update password for user
router.post("/update-password", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Missing password fields" });
    }
    // Fetch user
    const userResult = await db.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const match = await bcrypt.compare(
      oldPassword,
      userResult.rows[0].password_hash
    );
    if (!match) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      newHash,
      userId,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// Get user's first name by user id
router.get("/first_name/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await db.query(
      "SELECT first_name FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ first_name: result.rows[0].first_name });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch first name" });
  }
});

module.exports = router;
