const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
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
    console.warn(` [MySQL Notice] ${err.message}. Using persistent JSON store.`);
  });

const DB_FILE = path.join(__dirname, 'rotaract_database.json');

module.exports = {
  async query(sql, params = []) {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.warn(' [MySQL Query Fallback]', err.message);
      return [];
    }
  },
  pool,
  getFileData() {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
      return {};
    }
  },
  saveFileData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }
};
