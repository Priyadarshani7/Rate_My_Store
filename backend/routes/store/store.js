const express = require("express");
const router = express.Router();
const Store = require("../../models/store");
const { auth } = require("../../middlewares/auth");

router.get("/", auth, async (req, res) => {
  const { name, address } = req.query;
  try {
    const stores = await Store.findWithFilters({ name, address });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

// Add this POST route to allow store creation
router.post("/", auth, async (req, res) => {
  try {
    const { name, email, address } = req.body;
    if (!name || !email || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const store = await Store.create({ name, email, address });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: "Failed to create store" });
  }
});

module.exports = router;
