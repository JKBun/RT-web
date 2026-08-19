const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rotaract_nibm_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log(' [MySQL] Connected successfully to rotaract_nibm_db on localhost:3306');
    conn.release();
  })
  .catch(err => {
    console.error(' [MySQL Connection Error]', err.message);
  });

module.exports = {
  async query(sql, params = []) {
    const [results] = await pool.query(sql, params);
    return results;
  },
  pool
};
