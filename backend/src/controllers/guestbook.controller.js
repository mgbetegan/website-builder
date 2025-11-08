const guestBookService = require('../services/guestbook.service');
const path = require('path');
const fs = require('fs-extra');

class GuestBookController {
  // Get all guest books
  async getAllGuestBooks(req, res) {
    try {
      const guestBooks = await guestBookService.getAllGuestBooks();
      res.json({
        success: true,
        data: guestBooks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching guest books',
        error: error.message
      });
    }
  }

  // Get single guest book
  async getGuestBook(req, res) {
    try {
      const { id } = req.params;
      const guestBook = await guestBookService.getGuestBook(id);

      if (!guestBook) {
        return res.status(404).json({
          success: false,
          message: 'Guest book not found'
        });
      }

      res.json({
        success: true,
        data: guestBook
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching guest book',
        error: error.message
      });
    }
  }

  // Create new guest book
  async createGuestBook(req, res) {
    try {
      const { projectId, name } = req.body;
      const guestBook = await guestBookService.createGuestBook({
        projectId,
        name
      });

      res.status(201).json({
        success: true,
        message: 'Guest book created successfully',
        data: guestBook
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating guest book',
        error: error.message
      });
    }
  }

  // Upload template
  async uploadTemplate(req, res) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Extract template fields
      const fields = await guestBookService.extractTemplateFields(req.file.path);

      // Update guest book with template info
      const guestBook = await guestBookService.updateGuestBook(id, {
        templatePath: req.file.path,
        templateOriginalName: req.file.originalname,
        fields: fields
      });

      res.json({
        success: true,
        message: 'Template uploaded successfully',
        data: {
          guestBook,
          fields
        }
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file && req.file.path) {
        await fs.remove(req.file.path).catch(console.error);
      }

      res.status(500).json({
        success: false,
        message: 'Error uploading template',
        error: error.message
      });
    }
  }

  // Add entry
  async addEntry(req, res) {
    try {
      const { id } = req.params;
      const entryData = req.body;

      const entry = await guestBookService.addEntry(id, entryData);

      res.status(201).json({
        success: true,
        message: 'Entry added successfully',
        data: entry
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding entry',
        error: error.message
      });
    }
  }

  // Generate document
  async generateDocument(req, res) {
    try {
      const { id } = req.params;
      const outputPath = await guestBookService.generateDocument(id);

      const guestBook = await guestBookService.getGuestBook(id);
      const filename = `${guestBook.name.replace(/[^a-z0-9]/gi, '_')}.docx`;

      res.download(outputPath, filename, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
        // Clean up generated file after download
        fs.remove(outputPath).catch(console.error);
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error generating document',
        error: error.message
      });
    }
  }

  // Delete guest book
  async deleteGuestBook(req, res) {
    try {
      const { id } = req.params;
      await guestBookService.deleteGuestBook(id);

      res.json({
        success: true,
        message: 'Guest book deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting guest book',
        error: error.message
      });
    }
  }
}

module.exports = new GuestBookController();
