const db = require('../config/db');

class Project {
  static async findAll() {
    const sql = `
      SELECT p.*, a.avenue_name 
      FROM projects p
      LEFT JOIN avenues a ON p.avenue_id = a.avenue_id
      ORDER BY p.created_at DESC
    `;
    return db.query(sql);
  }

  static async create({ avenueId, title, impactSummary, fundsRaised = 0, featuredImage = '/rotaract.png' }) {
    const sql = `
      INSERT INTO projects (avenue_id, title, impact_summary, funds_raised, featured_image, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'Completed', NOW())
    `;
    const result = await db.query(sql, [avenueId || 1, title, impactSummary, fundsRaised, featuredImage]);
    return { project_id: result.insertId, title, impact_summary: impactSummary };
  }
}

module.exports = Project;
