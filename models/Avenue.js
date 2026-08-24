const db = require('../database/db');

class Avenue {
  static async findAll() {
    return db.query('SELECT * FROM avenues ORDER BY avenue_id ASC');
  }

  static async findById(avenueId) {
    const rows = await db.query('SELECT * FROM avenues WHERE avenue_id = ?', [avenueId]);
    return rows[0] || null;
  }
}

module.exports = Avenue;
