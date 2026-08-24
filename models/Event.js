const db = require('../database/db');

class Event {
  static async findAll() {
    const sql = `
      SELECT e.*, a.avenue_name 
      FROM events e
      LEFT JOIN avenues a ON e.avenue_id = a.avenue_id
      ORDER BY e.event_date ASC
    `;
    return db.query(sql);
  }

  static async findById(eventId) {
    const sql = `SELECT * FROM events WHERE event_id = ?`;
    const rows = await db.query(sql, [eventId]);
    return rows[0] || null;
  }

  static async create({ avenueId, title, description, eventDate, venue, maxCapacity = 100 }) {
    const sql = `
      INSERT INTO events (avenue_id, title, description, event_date, venue, max_capacity, registered_count, status)
      VALUES (?, ?, ?, ?, ?, ?, 0, 'Upcoming')
    `;
    const result = await db.query(sql, [
      avenueId || 1,
      title,
      description,
      new Date(eventDate).toISOString().slice(0, 19).replace('T', ' '),
      venue,
      maxCapacity
    ]);
    return { event_id: result.insertId, avenue_id: avenueId, title, description, event_date: eventDate, venue, max_capacity: maxCapacity };
  }
}

module.exports = Event;
