const db = require('../database/db');

class CancelledPass {
  static async findAll() {
    try {
      const rows = await db.query('SELECT * FROM cancelled_passes ORDER BY cancelled_at DESC');
      if (rows && rows.length > 0) return rows;
    } catch (e) {}

    const data = db.getFileData();
    return data.cancelled_passes || [];
  }

  static async findByEventAndEmail(eventId, email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    try {
      const rows = await db.query(
        'SELECT * FROM cancelled_passes WHERE event_id = ? AND LOWER(attendee_email) = ? ORDER BY cancelled_at DESC LIMIT 1',
        [eventId, cleanEmail]
      );
      if (rows && rows.length > 0) return rows[0];
    } catch (e) {}

    const data = db.getFileData();
    const list = data.cancelled_passes || [];
    return list.find(cp => cp.event_id == eventId && cp.attendee_email && cp.attendee_email.toLowerCase() === cleanEmail) || null;
  }

  static async create({ passCode, eventId, eventTitle, attendeeName, attendeeEmail, contactNo, status = 'Cancelled', requestReason = null }) {
    const cleanEmail = attendeeEmail.toLowerCase().trim();
    const now = new Date().toISOString();
    let newId = Date.now();

    try {
      const sql = `
        INSERT INTO cancelled_passes 
        (pass_code, event_id, event_title, attendee_name, attendee_email, contact_no, cancelled_at, status, request_reason)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)
      `;
      const result = await db.query(sql, [
        passCode,
        eventId,
        eventTitle || 'Rotaract Club Initiative',
        attendeeName,
        cleanEmail,
        contactNo || '',
        status,
        requestReason
      ]);
      if (result && result.insertId) newId = result.insertId;
    } catch (e) {}

    // Persistent JSON store fallback
    const data = db.getFileData();
    if (!data.cancelled_passes) data.cancelled_passes = [];
    
    // Remove any existing entry for this event+email to prevent duplicates
    data.cancelled_passes = data.cancelled_passes.filter(
      cp => !(cp.event_id == eventId && cp.attendee_email && cp.attendee_email.toLowerCase() === cleanEmail)
    );

    const record = {
      id: newId,
      pass_code: passCode,
      event_id: parseInt(eventId, 10),
      event_title: eventTitle || 'Rotaract Club Initiative',
      attendee_name: attendeeName,
      attendee_email: cleanEmail,
      contact_no: contactNo || '',
      cancelled_at: now,
      status,
      request_reason: requestReason,
      board_decision_by: null,
      board_decision_at: null,
      board_comment: null
    };

    data.cancelled_passes.unshift(record);
    db.saveFileData(data);

    return record;
  }

  static async requestReRegistration({ eventId, attendeeEmail, attendeeName, contactNo, reason }) {
    const cleanEmail = attendeeEmail.toLowerCase().trim();
    const existing = await this.findByEventAndEmail(eventId, cleanEmail);

    try {
      await db.query(
        `UPDATE cancelled_passes 
         SET status = 'Re-Registration Requested', request_reason = ?, cancelled_at = NOW() 
         WHERE event_id = ? AND LOWER(attendee_email) = ?`,
        [reason || 'Applicant requested re-registration.', eventId, cleanEmail]
      );
    } catch (e) {}

    const data = db.getFileData();
    if (!data.cancelled_passes) data.cancelled_passes = [];

    let updated = null;
    const idx = data.cancelled_passes.findIndex(
      cp => cp.event_id == eventId && cp.attendee_email && cp.attendee_email.toLowerCase() === cleanEmail
    );

    if (idx !== -1) {
      data.cancelled_passes[idx].status = 'Re-Registration Requested';
      data.cancelled_passes[idx].request_reason = reason || 'Applicant requested re-registration.';
      data.cancelled_passes[idx].requested_at = new Date().toISOString();
      updated = data.cancelled_passes[idx];
    } else {
      updated = {
        id: Date.now(),
        pass_code: `REQ-${eventId}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        event_id: parseInt(eventId, 10),
        event_title: 'Rotaract Club Event',
        attendee_name: attendeeName || 'Attendee',
        attendee_email: cleanEmail,
        contact_no: contactNo || '',
        cancelled_at: new Date().toISOString(),
        status: 'Re-Registration Requested',
        request_reason: reason || 'Applicant requested re-registration.',
        board_decision_by: null,
        board_decision_at: null,
        board_comment: null
      };
      data.cancelled_passes.unshift(updated);
    }

    db.saveFileData(data);
    return updated;
  }

  static async reviewReRegistration(id, action, reviewerName, comment = '') {
    const numId = parseInt(id, 10);
    const now = new Date().toISOString();
    let newStatus = action === 'approve' ? 'Re-Registration Approved' : 'Re-Registration Declined';

    if (action === 'delete') {
      try {
        await db.query('DELETE FROM cancelled_passes WHERE id = ?', [numId]);
      } catch (e) {}

      const data = db.getFileData();
      if (data.cancelled_passes) {
        data.cancelled_passes = data.cancelled_passes.filter(cp => cp.id != numId);
        db.saveFileData(data);
      }
      return { success: true, message: 'Record deleted from cancelled archive.' };
    }

    try {
      await db.query(
        `UPDATE cancelled_passes 
         SET status = ?, board_decision_by = ?, board_decision_at = NOW(), board_comment = ? 
         WHERE id = ?`,
        [newStatus, reviewerName, comment, numId]
      );
    } catch (e) {}

    const data = db.getFileData();
    if (!data.cancelled_passes) data.cancelled_passes = [];

    const record = data.cancelled_passes.find(cp => cp.id == numId);
    if (record) {
      record.status = newStatus;
      record.board_decision_by = reviewerName;
      record.board_decision_at = now;
      record.board_comment = comment;
      db.saveFileData(data);
    }

    return { success: true, message: `Re-registration request has been ${action === 'approve' ? 'approved' : 'declined'}.`, record };
  }

  static async clearApprovalAfterRegistration(eventId, email) {
    const cleanEmail = email.toLowerCase().trim();
    try {
      await db.query(
        'DELETE FROM cancelled_passes WHERE event_id = ? AND LOWER(attendee_email) = ?',
        [eventId, cleanEmail]
      );
    } catch (e) {}

    const data = db.getFileData();
    if (data.cancelled_passes) {
      data.cancelled_passes = data.cancelled_passes.filter(
        cp => !(cp.event_id == eventId && cp.attendee_email && cp.attendee_email.toLowerCase() === cleanEmail)
      );
      db.saveFileData(data);
    }
  }
}

module.exports = CancelledPass;
