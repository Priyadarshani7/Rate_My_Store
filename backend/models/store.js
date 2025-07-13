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

  static async findAll(query, params) {
    if (query && params) {
      const result = await db.query(query, params);
      return result.rows;
    }
    const result = await db.query(`
      SELECT s.id, s.name, s.email, s.address, s.created_at,
        COALESCE(AVG(r.rating), 0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.name
    `);
    return result.rows;
  }
}

module.exports = Store;
