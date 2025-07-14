const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const { auth } = require("../../middlewares/auth");

// Submit or update rating
router.post("/", auth, async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.userId;
  // Validate input
  if (!storeId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid rating or storeId" });
  }
  try {
    // Check if store exists
    const storeCheck = await db.query("SELECT id FROM stores WHERE id = $1", [
      storeId,
    ]);
    if (storeCheck.rows.length === 0) {
      return res.status(400).json({ error: "Store does not exist" });
    }
    // Upsert rating (insert or update)
    await db.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = $3, created_at = CURRENT_TIMESTAMP`,
      [userId, storeId, rating]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error submitting rating:", err); // Add error log
    res.status(500).json({ error: "Failed to submit rating" });
  }
});

// Get all ratings by user
router.get("/user/:userId", auth, async (req, res) => {
  const userId = req.params.userId;
  const result = await db.query(
    "SELECT store_id, rating FROM ratings WHERE user_id = $1",
    [userId]
  );
  res.json(result.rows);
});

// Get all ratings for a store
router.get("/store/:storeId", auth, async (req, res) => {
  const storeId = req.params.storeId;
  const result = await db.query(
    "SELECT user_id, rating FROM ratings WHERE store_id = $1",
    [storeId]
  );
  res.json(result.rows);
});

module.exports = router;
