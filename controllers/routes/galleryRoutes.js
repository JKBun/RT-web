const express = require('express');
const router = express.Router();
const galleryController = require('../galleryController');

router.get('/', galleryController.getGallery);
router.post('/', galleryController.addGalleryImage);
router.delete('/:id', galleryController.deleteGalleryImage);

module.exports = router;
