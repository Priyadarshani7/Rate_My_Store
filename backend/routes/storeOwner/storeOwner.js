const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const { auth, checkRole } = require("../../middlewares/auth");

// Get ratings for the store owned by the current user
router.get("/ratings", auth, async (req, res) => {
  try {
    const ownerId = req.query.ownerId || req.user.userId;
    const storeResult = await db.query(
      "SELECT id FROM stores WHERE owner_id = $1",
      [ownerId]
    );
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: "Store not found for owner" });
    }
    const storeIds = storeResult.rows.map((row) => row.id);
    if (!storeIds.length) {
      return res.json({ ratings: [], average_rating: 0 });
    }
    // Get ratings for these stores
    const ratingsResult = await db.query(
      `SELECT r.user_id, u.first_name || ' ' || u.last_name AS user_name, u.email AS user_email, r.rating
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ANY($1::int[])`,
      [storeIds]
    );
    // Calculate average rating
    const avgResult = await db.query(
      "SELECT AVG(rating) AS average_rating FROM ratings WHERE store_id = ANY($1::int[])",
      [storeIds]
    );
    res.json({
      ratings: ratingsResult.rows,
      average_rating: avgResult.rows[0].average_rating || 0,
    });
  } catch (err) {
    console.error("Error in /store-owner/ratings:", err); // Add error log
    res.status(500).json({ error: "Failed to fetch store owner ratings" });
  }
});

module.exports = router;
