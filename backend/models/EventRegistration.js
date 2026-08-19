const db = require('../config/db');
const crypto = require('crypto');

class EventRegistration {
  static async findAll() {
    const sql = `
      SELECT r.*, e.title AS event_title, e.event_date, e.venue 
      FROM event_registrations r
      LEFT JOIN events e ON r.event_id = e.event_id
      ORDER BY r.registered_at DESC
    `;
    return db.query(sql);
  }

  static async findByEventId(eventId) {
    const sql = `SELECT * FROM event_registrations WHERE event_id = ? ORDER BY registered_at DESC`;
    return db.query(sql, [eventId]);
  }

  static async findByUserId(userId) {
    const sql = `
      SELECT r.*, e.title AS event_title, e.event_date, e.venue 
      FROM event_registrations r
      LEFT JOIN events e ON r.event_id = e.event_id
      WHERE r.user_id = ?
      ORDER BY r.registered_at DESC
    `;
    return db.query(sql, [userId]);
  }

  static async findByPassCode(passCode) {
    const sql = `SELECT * FROM event_registrations WHERE pass_code = ?`;
    const rows = await db.query(sql, [passCode.trim().toUpperCase()]);
    return rows[0] || null;
  }

  static async createRegistration({ eventId, userId = null, attendeeName, attendeeEmail, contactNo = '' }) {
    const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
    const passCode = `RT-NIBM-${eventId}-${randomHex}`;

    const sql = `
      INSERT INTO event_registrations 
      (event_id, user_id, attendee_name, attendee_email, contact_no, pass_code, registered_at, checkin_status)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Confirmed')
    `;
    
    const result = await db.query(sql, [
      eventId || 1,
      userId,
      attendeeName,
      attendeeEmail.toLowerCase(),
      contactNo,
      passCode
    ]);

    // Update registered count in events table
    await db.query(`UPDATE events SET registered_count = registered_count + 1 WHERE event_id = ?`, [eventId || 1]);

    return {
      registration_id: result.insertId,
      event_id: eventId,
      user_id: userId,
      attendee_name: attendeeName,
      attendee_email: attendeeEmail,
      contact_no: contactNo,
      pass_code: passCode,
      checkin_status: 'Confirmed'
    };
  }

  static async markCheckIn(passCode) {
    const reg = await this.findByPassCode(passCode);
    if (!reg) return { success: false, message: 'Invalid Pass Code.' };
    if (reg.checkin_status === 'Checked-In') {
      return { success: false, message: `Pass already checked in at ${reg.checkin_time}`, reg };
    }

    const checkinTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await db.query(`UPDATE event_registrations SET checkin_status = 'Checked-In', checkin_time = NOW() WHERE registration_id = ?`, [reg.registration_id]);

    return {
      success: true,
      message: 'Pass successfully verified! Entry granted.',
      checkinTime,
      reg: { ...reg, checkin_status: 'Checked-In', checkin_time: checkinTime }
    };
  }
}

module.exports = EventRegistration;
