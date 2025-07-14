const db = require("../config/database");

class Store {
  static async create({ name, email, address, owner_id }) {
    const result = await db.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id, created_at`,
      [name, email, address, owner_id]
    );
    return result.rows[0];
  }

  static async findAll(query, params) {
    if (query && params) {
      const result = await db.query(query, params);
      return result.rows;
    }
    // Add filtering support
    return await Store.findWithFilters();
  }

  static async findWithFilters(filters = {}) {
    let sql = `
      SELECT s.id, s.name, s.email, s.address, s.created_at, s.owner_id,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS ratings_count
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    const where = [];
    const params = [];
    if (filters.name) {
      params.push(`%${filters.name}%`);
      where.push(`s.name ILIKE $${params.length}`);
    }
    if (filters.address) {
      params.push(`%${filters.address}%`);
      where.push(`s.address ILIKE $${params.length}`);
    }
    if (filters.owner_id) {
      params.push(filters.owner_id);
      where.push(`s.owner_id = $${params.length}`);
    }
    if (where.length) {
      sql += " WHERE " + where.join(" AND ");
    }
    sql += " GROUP BY s.id ORDER BY s.name";
    const result = await db.query(sql, params);
    return result.rows;
  }
}

module.exports = Store;
