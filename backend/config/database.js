const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to the database:', err.message);
    return;
  }
  release();
  console.log('✅ Successfully connected to the database');
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool // Export pool for direct access if needed
}; 