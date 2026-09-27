const db = require('../database/db');

class UnapprovedEmail {
  static async findAll() {
    try {
      const rows = await db.query('SELECT * FROM unapproved_emails ORDER BY created_at DESC');
      if (rows && rows.length > 0) return rows;
    } catch (e) {}

    const data = db.getFileData();
    return data.unapproved_emails || [];
  }

  static async logAttempt({ email, fullName = '', phone = '', attemptType = 'Membership Application', status = 'Pending Board Approval', feeAmount = 3000, otpCode = null, codeExpiresAt = null, details = '' }) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    const now = new Date().toISOString();
    let newId = Date.now();

    try {
      const sql = `
        INSERT INTO unapproved_emails 
        (email, full_name, phone, attempt_type, status, fee_amount, otp_code, code_expires_at, details, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
        full_name = VALUES(full_name),
        phone = VALUES(phone),
        attempt_type = VALUES(attempt_type),
        status = VALUES(status),
        fee_amount = VALUES(fee_amount),
        otp_code = VALUES(otp_code),
        code_expires_at = VALUES(code_expires_at),
        details = VALUES(details),
        updated_at = NOW()
      `;
      const result = await db.query(sql, [
        cleanEmail, fullName, phone, attemptType, status, feeAmount, otpCode, codeExpiresAt, details
      ]);
      if (result && result.insertId) newId = result.insertId;
    } catch (e) {}

    // JSON fallback
    const data = db.getFileData();
    if (!data.unapproved_emails) data.unapproved_emails = [];

    const existingIdx = data.unapproved_emails.findIndex(
      ue => ue.email && ue.email.toLowerCase() === cleanEmail
    );

    const record = {
      id: existingIdx !== -1 ? data.unapproved_emails[existingIdx].id : newId,
      email: cleanEmail,
      full_name: fullName,
      phone,
      attempt_type: attemptType,
      status,
      fee_amount: feeAmount,
      otp_code: otpCode,
      code_expires_at: codeExpiresAt,
      details,
      created_at: existingIdx !== -1 ? data.unapproved_emails[existingIdx].created_at : now,
      updated_at: now
    };

    if (existingIdx !== -1) {
      data.unapproved_emails[existingIdx] = record;
    } else {
      data.unapproved_emails.unshift(record);
    }

    db.saveFileData(data);
    return record;
  }

  static async updateStatus(email, status, details = '') {
    if (!email) return;
    const cleanEmail = email.toLowerCase().trim();

    try {
      await db.query(
        'UPDATE unapproved_emails SET status = ?, details = ?, updated_at = NOW() WHERE LOWER(email) = ?',
        [status, details, cleanEmail]
      );
    } catch (e) {}

    const data = db.getFileData();
    if (data.unapproved_emails) {
      const item = data.unapproved_emails.find(ue => ue.email && ue.email.toLowerCase() === cleanEmail);
      if (item) {
        item.status = status;
        if (details) item.details = details;
        item.updated_at = new Date().toISOString();
        db.saveFileData(data);
      }
    }
  }

  static async remove(email) {
    if (!email) return;
    const cleanEmail = email.toLowerCase().trim();

    try {
      await db.query('DELETE FROM unapproved_emails WHERE LOWER(email) = ?', [cleanEmail]);
    } catch (e) {}

    const data = db.getFileData();
    if (data.unapproved_emails) {
      data.unapproved_emails = data.unapproved_emails.filter(ue => !(ue.email && ue.email.toLowerCase() === cleanEmail));
      db.saveFileData(data);
    }
  }
}

module.exports = UnapprovedEmail;
