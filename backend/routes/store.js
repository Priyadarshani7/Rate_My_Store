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

// Fetch all stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

module.exports = router;
