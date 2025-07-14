const express = require("express");
const router = express.Router();
const db = require("../../config/database");
const { auth, checkRole } = require("../../middlewares/auth");
const Store = require("../../models/store");

// Only admin can access these stats
router.get(
  "/stats",
  auth,
  checkRole(["system_administrator"]),
  async (req, res) => {
    try {
      const usersResult = await db.query("SELECT COUNT(*) FROM users");
      const storesResult = await db.query("SELECT COUNT(*) FROM stores");
      const ratingsResult = await db.query("SELECT COUNT(*) FROM ratings");
      res.json({
        totalUsers: usersResult.rows[0].count,
        totalStores: storesResult.rows[0].count,
        totalRatings: ratingsResult.rows[0].count,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  }
);

// List users with optional filters
router.get(
  "/users",
  auth,
  checkRole(["system_administrator"]),
  async (req, res) => {
    const { name, email, address, role } = req.query;
    let query =
      "SELECT id, first_name, last_name, email, address, role FROM users WHERE 1=1";
    const params = [];
    if (name) {
      query += ` AND (first_name ILIKE $${
        params.length + 1
      } OR last_name ILIKE $${params.length + 2})`;
      params.push(`%${name}%`);
      params.push(`%${name}%`);
    }
    if (email) {
      query += ` AND email ILIKE $${params.length + 1}`;
      params.push(`%${email}%`);
    }
    if (address) {
      query += ` AND address ILIKE $${params.length + 1}`;
      params.push(`%${address}%`);
    }
    if (role) {
      query += ` AND role = $${params.length + 1}`;
      params.push(role);
    }
    query += " ORDER BY first_name";
    const result = await db.query(query, params);
    res.json(result.rows);
  }
);

// Get user by ID with role-based data
router.get(
  "/users/:id",
  auth,
  checkRole(["system_administrator"]),
  async (req, res) => {
    const userId = req.params.id;
    try {
      const result = await db.query(
        "SELECT id, first_name, last_name, email, address, role FROM users WHERE id = $1",
        [userId]
      );
      const user = result.rows[0];

      // If user is a store owner, fetch their store's average rating
      if (user && user.role === "store_owner") {
        const ratingResult = await db.query(
          `SELECT COALESCE(AVG(r.rating), 0) AS average_rating
           FROM stores s
           LEFT JOIN ratings r ON s.id = r.store_id
           WHERE s.owner_id = $1`,
          [userId]
        );
        user.average_rating = ratingResult.rows[0].average_rating;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user details" });
    }
  }
);

// Create a new user (admin only)
router.post(
  "/users",
  auth,
  checkRole(["system_administrator"]),
  async (req, res) => {
    try {
      const { firstName, lastName, email, password, address, role } = req.body;
      // Validate required fields
      if (!firstName || !lastName || !email || !password || !address || !role) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      // Validate role
      const validRoles = ["normal_user", "system_administrator", "store_owner"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      // Check for duplicate email
      const existing = await db.query("SELECT id FROM users WHERE email = $1", [
        email,
      ]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }
      const user = await require("../../models/user").create({
        firstName,
        lastName,
        email,
        password,
        address,
        role,
      });
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error); // Add error log
      res.status(400).json({ error: "User creation failed" });
    }
  }
);

// GET /api/admin/stores - Get all stores for admin
router.get("/stores", async (req, res) => {
  try {
    const stores = await Store.findAll(); // Adjust based on your ORM/query
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

module.exports = router;
