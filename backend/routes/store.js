const express = require("express");
const router = express.Router();
const Store = require("../models/store");
const { auth, checkRole } = require("../middlewares/auth");

router.post(
  "/",
  auth,
  checkRole(["system_administrator"]),
  async (req, res) => {
    try {
      const { name, email, address } = req.body;

      const store = await Store.create({ name, email, address });
      res.status(201).json(store);
    } catch (error) {
      res.status(400).json({ error: "Store creation failed" });
    }
  }
);

// Fetch all stores with optional filters
router.get("/", async (req, res) => {
  try {
    const { name, address } = req.query;
    let query = `
      SELECT s.id, s.name, s.email, s.address, s.created_at,
        COALESCE(AVG(r.rating), 0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const params = [];
    if (name) {
      query += ` AND s.name ILIKE $${params.length + 1}`;
      params.push(`%${name}%`);
    }
    if (address) {
      query += ` AND s.address ILIKE $${params.length + 1}`;
      params.push(`%${address}%`);
    }
    query += " GROUP BY s.id ORDER BY s.name";
    const stores = await require("../models/store").findAll(query, params);
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

module.exports = router;
