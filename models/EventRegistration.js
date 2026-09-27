const db = require('../database/db');
const crypto = require('crypto');
const CancelledPass = require('./CancelledPass');

class EventRegistration {
  static async findAll() {
    try {
      const sql = `
        SELECT r.*, e.title AS event_title, e.event_date, e.venue 
        FROM event_registrations r
        LEFT JOIN events e ON r.event_id = e.event_id
        ORDER BY r.registered_at DESC
      `;
      const rows = await db.query(sql);
      if (rows && rows.length > 0) return rows;
    } catch (e) {}

    const data = db.getFileData();
    const regs = data.event_registrations || [];
    const events = data.events || [];
    return regs.map(r => {
      const ev = events.find(e => e.id == r.event_id || e.event_id == r.event_id);
      return {
        ...r,
        event_title: ev ? ev.title : 'Rotaract Club Initiative',
        event_date: ev ? ev.event_date : null,
        venue: ev ? ev.venue || ev.location : null
      };
    });
  }

  static async findByEventId(eventId) {
    try {
      const sql = `SELECT * FROM event_registrations WHERE event_id = ? ORDER BY registered_at DESC`;
      const rows = await db.query(sql, [eventId]);
      if (rows && rows.length > 0) return rows;
    } catch (e) {}

    const data = db.getFileData();
    const regs = data.event_registrations || [];
    return regs.filter(r => r.event_id == eventId);
  }

  static async findByUserId(userId) {
    try {
      const sql = `
        SELECT r.*, e.title AS event_title, e.event_date, e.venue 
        FROM event_registrations r
        LEFT JOIN events e ON r.event_id = e.event_id
        WHERE r.user_id = ?
        ORDER BY r.registered_at DESC
      `;
      const rows = await db.query(sql, [userId]);
      if (rows && rows.length > 0) return rows;
    } catch (e) {}

    const data = db.getFileData();
    const regs = data.event_registrations || [];
    const events = data.events || [];
    return regs
      .filter(r => r.user_id == userId)
      .map(r => {
        const ev = events.find(e => e.id == r.event_id || e.event_id == r.event_id);
        return {
          ...r,
          event_title: ev ? ev.title : 'Rotaract Club Initiative',
          event_date: ev ? ev.event_date : null,
          venue: ev ? ev.venue || ev.location : null
        };
      });
  }

  static async findByPassCode(passCode) {
    const code = passCode.trim().toUpperCase();
    try {
      const sql = `
        SELECT r.*, e.title AS event_title, e.event_date, e.venue 
        FROM event_registrations r
        LEFT JOIN events e ON r.event_id = e.event_id
        WHERE UPPER(r.pass_code) = ?
      `;
      const rows = await db.query(sql, [code]);
      if (rows && rows.length > 0) return rows[0];
    } catch (e) {}

    const data = db.getFileData();
    const regs = data.event_registrations || [];
    const events = data.events || [];
    const found = regs.find(r => r.pass_code && r.pass_code.toUpperCase() === code);
    if (found) {
      const ev = events.find(e => e.id == found.event_id || e.event_id == found.event_id);
      return {
        ...found,
        event_title: ev ? ev.title : 'Rotaract Club Initiative',
        event_date: ev ? ev.event_date : null,
        venue: ev ? ev.venue || ev.location : null
      };
    }
    return null;
  }

  static async createRegistration({ eventId, userId = null, attendeeName, attendeeEmail, contactNo = '' }) {
    const cleanEmail = attendeeEmail.toLowerCase().trim();

    // 1. RE-REGISTRATION POLICY CHECK:
    // Check if user previously cancelled this event
    const cancelledRecord = await CancelledPass.findByEventAndEmail(eventId, cleanEmail);
    if (cancelledRecord) {
      if (cancelledRecord.status === 'Cancelled' || cancelledRecord.status === 'Re-Registration Declined') {
        const error = new Error('You previously cancelled your registration for this event. Re-registering after cancellation is restricted to prevent seat abuse. You must submit a re-registration request to the Executive Board for authorization.');
        error.code = 'REQUIRES_BOARD_APPROVAL';
        error.cancelledPassId = cancelledRecord.id;
        throw error;
      }
      if (cancelledRecord.status === 'Re-Registration Requested') {
        const error = new Error('Your re-registration request for this event is currently under review by the Executive Board.');
        error.code = 'PENDING_BOARD_APPROVAL';
        error.cancelledPassId = cancelledRecord.id;
        throw error;
      }
      // If 'Re-Registration Approved', user is authorized to register!
    }

    const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
    const passCode = `RT-NIBM-${eventId}-${randomHex}`;
    const now = new Date().toISOString();
    let newRegId = Date.now();

    try {
      const sql = `
        INSERT INTO event_registrations 
        (event_id, user_id, attendee_name, attendee_email, contact_no, pass_code, registered_at, checkin_status)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Confirmed')
      `;
      const result = await db.query(sql, [
        eventId || 1,
        userId,
        attendeeName,
        cleanEmail,
        contactNo,
        passCode
      ]);
      if (result && result.insertId) newRegId = result.insertId;

      await db.query(`UPDATE events SET registered_count = registered_count + 1 WHERE event_id = ?`, [eventId || 1]);
    } catch (e) {}

    // Persistent JSON Store
    const data = db.getFileData();
    if (!data.event_registrations) data.event_registrations = [];

    const newRecord = {
      registration_id: newRegId,
      event_id: parseInt(eventId, 10),
      user_id: userId,
      attendee_name: attendeeName,
      attendee_email: cleanEmail,
      contact_no: contactNo,
      pass_code: passCode,
      registered_at: now,
      checkin_status: 'Confirmed',
      checkin_time: null
    };

    data.event_registrations.unshift(newRecord);

    if (data.events) {
      const ev = data.events.find(e => e.id == eventId || e.event_id == eventId);
      if (ev) ev.registered_count = (ev.registered_count || 0) + 1;
    }

    db.saveFileData(data);

    // If this was an approved re-registration, clear the approval from cancelled passes
    if (cancelledRecord && cancelledRecord.status === 'Re-Registration Approved') {
      await CancelledPass.clearApprovalAfterRegistration(eventId, cleanEmail);
    }

    return newRecord;
  }

  static async markCheckIn(passCode) {
    const reg = await this.findByPassCode(passCode);
    if (!reg) return { success: false, message: 'Invalid Pass Code.' };
    if (reg.checkin_status === 'Checked-In') {
      return { success: false, message: `Pass already checked in at ${reg.checkin_time}`, reg };
    }

    const checkinTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
      await db.query(
        `UPDATE event_registrations SET checkin_status = 'Checked-In', checkin_time = NOW() WHERE registration_id = ?`,
        [reg.registration_id]
      );
    } catch (e) {}

    const data = db.getFileData();
    if (data.event_registrations) {
      const item = data.event_registrations.find(r => r.pass_code && r.pass_code.toUpperCase() === passCode.toUpperCase());
      if (item) {
        item.checkin_status = 'Checked-In';
        item.checkin_time = checkinTime;
        db.saveFileData(data);
      }
    }

    return {
      success: true,
      message: 'Pass successfully verified! Entry granted.',
      checkinTime,
      reg: { ...reg, checkin_status: 'Checked-In', checkin_time: checkinTime }
    };
  }

  static async cancelRegistration(passCode) {
    const reg = await this.findByPassCode(passCode);
    if (!reg) return { success: false, error: 'Pass code not found in records.' };
    if (reg.checkin_status === 'Cancelled') return { success: false, error: 'Registration is already cancelled.' };

    // 2. 48-HOUR (2-DAY) CANCELLATION RESTRICTION:
    // Event registrations can ONLY be cancelled before 2 days (48 hours) remain.
    let eventDate = reg.event_date;
    let eventTitle = reg.event_title || 'Rotaract Event';

    // If eventDate is not in reg, fetch event
    if (!eventDate) {
      const data = db.getFileData();
      const events = data.events || [];
      const ev = events.find(e => e.id == reg.event_id || e.event_id == reg.event_id);
      if (ev) {
        eventDate = ev.event_date;
        eventTitle = ev.title;
      }
    }

    if (eventDate) {
      const eventTime = new Date(eventDate).getTime();
      const now = Date.now();
      const diffHours = (eventTime - now) / (1000 * 60 * 60);

      if (!isNaN(diffHours) && diffHours <= 48) {
        const hoursLeft = Math.max(0, Math.round(diffHours));
        return {
          success: false,
          error: `Cancellation Policy: Registrations can only be cancelled at least 48 hours (2 days) before the event. Only ${hoursLeft} hour(s) remain for "${eventTitle}". Cancellation is locked. Please contact a Board member directly.`
        };
      }
    }

    // Pass cancellation is allowed (> 48 hours away):
    // A) Remove completely from event_registrations table in phpMyAdmin MySQL
    try {
      await db.query('DELETE FROM event_registrations WHERE pass_code = ?', [passCode]);
      await db.query('UPDATE events SET registered_count = GREATEST(0, registered_count - 1) WHERE event_id = ?', [reg.event_id]);
    } catch (e) {}

    // B) Remove from JSON file store event_registrations
    const data = db.getFileData();
    if (data.event_registrations) {
      data.event_registrations = data.event_registrations.filter(r => r.pass_code !== passCode);
    }
    if (data.events) {
      const ev = data.events.find(e => e.id == reg.event_id || e.event_id == reg.event_id);
      if (ev) ev.registered_count = Math.max(0, (ev.registered_count || 1) - 1);
    }
    db.saveFileData(data);

    // C) Move into dedicated `cancelled_passes` database/table
    await CancelledPass.create({
      passCode: reg.pass_code,
      eventId: reg.event_id,
      eventTitle: eventTitle,
      attendeeName: reg.attendee_name,
      attendeeEmail: reg.attendee_email,
      contactNo: reg.contact_no,
      status: 'Cancelled'
    });

    return {
      success: true,
      message: `Your pass for "${eventTitle}" has been cancelled and seat capacity restored. Note: To prevent seat abuse, re-registering will require Board authorization.`
    };
  }
}

module.exports = EventRegistration;
