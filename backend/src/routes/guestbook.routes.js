const express = require('express');
const router = express.Router();
const guestBookController = require('../controllers/guestbook.controller');
const upload = require('../middleware/upload');

// Get all guest books
router.get('/', guestBookController.getAllGuestBooks.bind(guestBookController));

// Get single guest book
router.get('/:id', guestBookController.getGuestBook.bind(guestBookController));

// Create new guest book
router.post('/', guestBookController.createGuestBook.bind(guestBookController));

// Upload template for guest book
router.post('/:id/template', upload.single('template'), guestBookController.uploadTemplate.bind(guestBookController));

// Add entry to guest book
router.post('/:id/entries', guestBookController.addEntry.bind(guestBookController));

// Generate DOCX document
router.get('/:id/generate', guestBookController.generateDocument.bind(guestBookController));

// Delete guest book
router.delete('/:id', guestBookController.deleteGuestBook.bind(guestBookController));

module.exports = router;
