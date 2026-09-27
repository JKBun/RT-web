const Gallery = require('../models/Gallery');

exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.findAll();
    return res.json({ success: true, count: items.length, gallery: items });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.addGalleryImage = async (req, res) => {
  try {
    const { title, category, img, uploadedBy } = req.body;
    if (!title || !img) {
      return res.status(400).json({ success: false, error: 'Title and image URL are required.' });
    }

    const newItem = await Gallery.create({
      title,
      category: category || 'Club Service',
      img,
      uploadedBy: uploadedBy || 'Board Member'
    });

    return res.status(201).json({
      success: true,
      message: 'Photo successfully published to the Club Gallery!',
      item: newItem
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'Image ID is required.' });

    const result = await Gallery.delete(id);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
