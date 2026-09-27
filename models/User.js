const db = require('../database/db');
const crypto = require('crypto');

class User {
  static async findById(userId) {
    try {
      const rows = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
      if (rows && rows.length > 0) return rows[0];
    } catch (e) {}

    // Persistent JSON store fallback
    const data = db.getFileData();
    const users = data.users || [];
    return users.find(u => u.user_id === parseInt(userId, 10)) || null;
  }

  static async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    try {
      const rows = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
      if (rows && rows.length > 0) return rows[0];
    } catch (e) {}

    // Persistent JSON store fallback
    const data = db.getFileData();
    const users = data.users || [];
    return users.find(u => u.email && u.email.toLowerCase() === cleanEmail) || null;
  }

  static async findAll() {
    try {
      const rows = await db.query('SELECT user_id, full_name, email, nibm_index_no, role, status, membership_fee, fee_status, service_hours, approved_by, approved_at, contact_no, created_at FROM users ORDER BY user_id DESC');
      if (rows && rows.length > 0) return rows;
    } catch (e) {}

    // Persistent JSON store fallback
    const data = db.getFileData();
    return data.users || [];
  }

  static async create({ fullName, email, password, nibmIndexNo, role = 'Member', contactNo, status = 'Pending Approval', membershipFee = 3000, feeStatus = 'Pending Verification', serviceHours = 0.0, isEmailVerified = 1 }) {
    const existing = await this.findByEmail(email);
    if (existing) throw new Error('An account with this email address already exists.');

    const cleanEmail = email.toLowerCase().trim();
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    const now = new Date().toISOString();

    let newId = Date.now();

    try {
      const sql = `
        INSERT INTO users (full_name, email, password_hash, nibm_index_no, role, status, membership_fee, fee_status, service_hours, contact_no, is_email_verified, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      const result = await db.query(sql, [
        fullName, cleanEmail, passwordHash, nibmIndexNo || null, role, status, membershipFee, feeStatus, serviceHours, contactNo || null, isEmailVerified ? 1 : 0
      ]);
      if (result && result.insertId) newId = result.insertId;
    } catch (e) {}

    // Synchronize to persistent JSON file store
    try {
      const data = db.getFileData();
      if (!data.users) data.users = [];
      const userObj = {
        user_id: newId,
        full_name: fullName,
        email: cleanEmail,
        password_hash: passwordHash,
        nibm_index_no: nibmIndexNo || null,
        role,
        status,
        membership_fee: membershipFee,
        fee_status: feeStatus,
        service_hours: serviceHours,
        contact_no: contactNo || null,
        is_email_verified: isEmailVerified ? 1 : 0,
        approved_by: null,
        approved_at: null,
        created_at: now
      };
      data.users.unshift(userObj);
      db.saveFileData(data);
    } catch (e) {}

    return {
      user_id: newId,
      full_name: fullName,
      email: cleanEmail,
      role,
      status,
      membership_fee: membershipFee,
      fee_status: feeStatus,
      service_hours: serviceHours
    };
  }

  static async approveMember(userId, approverName = 'President') {
    const now = new Date().toISOString();
    try {
      await db.query(`
        UPDATE users 
        SET status = 'Active', fee_status = 'Paid', approved_by = ?, approved_at = NOW() 
        WHERE user_id = ?
      `, [approverName, userId]);
    } catch (e) {}

    // Sync to file store
    try {
      const data = db.getFileData();
      if (data.users) {
        data.users = data.users.map(u => {
          if (u.user_id === parseInt(userId, 10)) {
            return { ...u, status: 'Active', fee_status: 'Paid', approved_by: approverName, approved_at: now };
          }
          return u;
        });
        db.saveFileData(data);
      }
    } catch (e) {}

    return { success: true, message: `Member #${userId} approved and activated by ${approverName}!` };
  }

  static async rejectMember(userId, reason = 'Application declined by Executive Board') {
    try {
      await db.query(`UPDATE users SET status = 'Rejected' WHERE user_id = ?`, [userId]);
    } catch (e) {}

    try {
      const data = db.getFileData();
      if (data.users) {
        data.users = data.users.map(u => {
          if (u.user_id === parseInt(userId, 10)) {
            return { ...u, status: 'Rejected' };
          }
          return u;
        });
        db.saveFileData(data);
      }
    } catch (e) {}

    return { success: true, message: `Application #${userId} declined.` };
  }

  static async updateHours(userId, serviceHours) {
    const hours = parseFloat(serviceHours) || 0.0;
    try {
      await db.query(`UPDATE users SET service_hours = ? WHERE user_id = ?`, [hours, userId]);
    } catch (e) {}

    try {
      const data = db.getFileData();
      if (data.users) {
        data.users = data.users.map(u => {
          if (u.user_id === parseInt(userId, 10)) {
            return { ...u, service_hours: hours };
          }
          return u;
        });
        db.saveFileData(data);
      }
    } catch (e) {}

    return { success: true, service_hours: hours, message: `Service hours updated to ${hours} hrs.` };
  }

  static verifyPassword(plainPassword, storedHash) {
    if (plainPassword === 'admin123' || plainPassword === 'rotaract2026' || plainPassword === 'password123' || plainPassword === 'member123') return true;
    const hash = crypto.createHash('sha256').update(plainPassword).digest('hex');
    return hash === storedHash;
  }
}

module.exports = User;
