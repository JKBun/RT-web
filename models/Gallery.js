const db = require('../database/db');

const DEFAULT_GALLERY = [
  { id: 1, title: 'Miles of Memories Summit Trek', category: 'Club Service', img: '/photos/miles-of-memories.jpeg', uploaded_by: 'Board', created_at: '2026-08-15T10:00:00Z' },
  { id: 2, title: 'Feed the Paw Welfare Drive', category: 'Community Service', img: '/photos/feed-the-paw.png', uploaded_by: 'Board', created_at: '2026-08-20T11:30:00Z' },
  { id: 3, title: 'Coffee and Chill Networking Meetup', category: 'Professional Development', img: '/photos/coffee-and-chill.jpeg', uploaded_by: 'Board', created_at: '2026-09-02T14:15:00Z' },
  { id: 4, title: 'Rotaract Installation Ceremony', category: 'Leadership', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800', uploaded_by: 'President', created_at: '2026-09-10T16:00:00Z' }
];

class Gallery {
  static async findAll() {
    try {
      const rows = await db.query('SELECT * FROM gallery ORDER BY id DESC');
      if (rows && rows.length > 0) return rows;
    } catch (e) {}

    const data = db.getFileData();
    if (!data.gallery || data.gallery.length === 0) {
      data.gallery = [...DEFAULT_GALLERY];
      db.saveFileData(data);
    }
    return data.gallery;
  }

  static async create({ title, category = 'Club Service', img, uploadedBy = 'Executive Board' }) {
    if (!title || !img) {
      throw new Error('Title and image URL are required.');
    }

    const now = new Date().toISOString();
    let newId = Date.now();

    try {
      const sql = 'INSERT INTO gallery (title, category, img, uploaded_by, created_at) VALUES (?, ?, ?, ?, NOW())';
      const result = await db.query(sql, [title, category, img, uploadedBy]);
      if (result && result.insertId) newId = result.insertId;
    } catch (e) {}

    const data = db.getFileData();
    if (!data.gallery) data.gallery = [...DEFAULT_GALLERY];

    const newItem = {
      id: newId,
      title,
      category,
      img,
      uploaded_by: uploadedBy,
      created_at: now
    };

    data.gallery.unshift(newItem);
    db.saveFileData(data);

    return newItem;
  }

  static async delete(id) {
    const numId = parseInt(id, 10);
    try {
      await db.query('DELETE FROM gallery WHERE id = ?', [numId]);
    } catch (e) {}

    const data = db.getFileData();
    if (data.gallery) {
      data.gallery = data.gallery.filter(g => g.id != numId);
      db.saveFileData(data);
    }

    return { success: true, message: 'Image deleted from gallery.' };
  }
}

module.exports = Gallery;
