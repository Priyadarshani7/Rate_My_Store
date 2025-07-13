const db = require("../config/database");

class Store {
  static async create({ name, email, address }) {
    const result = await db.query(
      `INSERT INTO stores (name, email, address)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, address, created_at`,
      [name, email, address]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query(
      `SELECT id, name, email, address, created_at FROM stores`
    );
    return result.rows;
  }
}

module.exports = Store;
