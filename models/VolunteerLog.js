const db = require('../database/db');

class VolunteerLog {
  static async findAll() {
    const sql = `
      SELECT v.*, u.full_name AS member_name 
      FROM volunteer_logs v
      LEFT JOIN users u ON v.user_id = u.user_id
      ORDER BY v.submitted_at DESC
    `;
    return db.query(sql);
  }

  static async findByUserId(userId) {
    return db.query('SELECT * FROM volunteer_logs WHERE user_id = ? ORDER BY submitted_at DESC', [userId]);
  }

  static async create({ userId, eventId, activityName, hoursLogged, description }) {
    const sql = `
      INSERT INTO volunteer_logs (user_id, event_id, activity_name, hours_logged, description, verification_status, submitted_at)
      VALUES (?, ?, ?, ?, ?, 'Pending', NOW())
    `;
    const result = await db.query(sql, [userId || 4, eventId || null, activityName, hoursLogged || 4.0, description]);
    return { log_id: result.insertId, user_id: userId, activity_name: activityName, hours_logged: hoursLogged, verification_status: 'Pending' };
  }

  static async updateStatus(logId, status, verifiedByUserId) {
    const sql = `UPDATE volunteer_logs SET verification_status = ?, verified_by = ? WHERE log_id = ?`;
    return db.query(sql, [status, verifiedByUserId || 1, logId]);
  }

  static async getTotalHoursForUser(userId) {
    const sql = `SELECT SUM(hours_logged) AS total FROM volunteer_logs WHERE user_id = ? AND verification_status = 'Approved'`;
    const rows = await db.query(sql, [userId]);
    return rows[0]?.total || 0;
  }
}

module.exports = VolunteerLog;
