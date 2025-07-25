const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class User {
  static async create({
    email,
    password,
    role = "normal_user",
    firstName,
    lastName,
    address,
  }) {
    console.log("Creating user with role:", role); // Debug log
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, role, first_name, last_name, address, created_at`,
      [email, hashedPassword, role, firstName, lastName, address]
    );

    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async login(email, password) {
    const user = await this.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return null;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        address: user.address, // Add address field
      },
    };
  }
}

module.exports = User;
