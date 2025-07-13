const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { auth } = require("../middlewares/auth");

// Submit or update rating
router.post("/", auth, async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.userId;
  if (!storeId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid rating" });
  }
  // Upsert rating
  await db.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET rating = $3`,
    [userId, storeId, rating]
  );
  res.json({ success: true });
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

module.exports = router;
