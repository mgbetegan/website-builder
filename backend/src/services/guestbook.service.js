const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const { GuestBook, GuestBookEntry } = require('../models/GuestBook');

class GuestBookService {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.guestBooksFile = path.join(this.dataDir, 'guestbooks.json');
    this.outputDir = path.join(__dirname, '../../generated-documents');
    this.ensureDirectories();
  }

  async ensureDirectories() {
    try {
      await fs.ensureDir(this.dataDir);
      await fs.ensureDir(this.outputDir);

      // Create guestbooks file if it doesn't exist
      if (!await fs.pathExists(this.guestBooksFile)) {
        await fs.writeJson(this.guestBooksFile, []);
      }
    } catch (error) {
      console.error('Error ensuring directories:', error);
    }
  }

  async getAllGuestBooks() {
    try {
      const guestBooks = await fs.readJson(this.guestBooksFile);
      return guestBooks.map(gb => GuestBook.fromJSON(gb));
    } catch (error) {
      console.error('Error reading guest books:', error);
      return [];
    }
  }

  async getGuestBook(id) {
    try {
      const guestBooks = await this.getAllGuestBooks();
      return guestBooks.find(gb => gb.id === id) || null;
    } catch (error) {
      console.error('Error getting guest book:', error);
      return null;
    }
  }

  async createGuestBook(data) {
    try {
      const guestBooks = await this.getAllGuestBooks();

      const newGuestBook = new GuestBook({
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      guestBooks.push(newGuestBook);
      await fs.writeJson(this.guestBooksFile, guestBooks.map(gb => gb.toJSON()), { spaces: 2 });

      return newGuestBook;
    } catch (error) {
      console.error('Error creating guest book:', error);
      throw error;
    }
  }

  async updateGuestBook(id, updates) {
    try {
      const guestBooks = await this.getAllGuestBooks();
      const index = guestBooks.findIndex(gb => gb.id === id);

      if (index === -1) {
        throw new Error('Guest book not found');
      }

      guestBooks[index] = new GuestBook({
        ...guestBooks[index].toJSON(),
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      });

      await fs.writeJson(this.guestBooksFile, guestBooks.map(gb => gb.toJSON()), { spaces: 2 });

      return guestBooks[index];
    } catch (error) {
      console.error('Error updating guest book:', error);
      throw error;
    }
  }

  async deleteGuestBook(id) {
    try {
      const guestBooks = await this.getAllGuestBooks();
      const guestBook = guestBooks.find(gb => gb.id === id);

      if (!guestBook) {
        throw new Error('Guest book not found');
      }

      // Delete template file if exists
      if (guestBook.templatePath && await fs.pathExists(guestBook.templatePath)) {
        await fs.remove(guestBook.templatePath);
      }

      const filtered = guestBooks.filter(gb => gb.id !== id);
      await fs.writeJson(this.guestBooksFile, filtered.map(gb => gb.toJSON()), { spaces: 2 });

      return true;
    } catch (error) {
      console.error('Error deleting guest book:', error);
      throw error;
    }
  }

  async addEntry(guestBookId, entryData) {
    try {
      const guestBook = await this.getGuestBook(guestBookId);
      if (!guestBook) {
        throw new Error('Guest book not found');
      }

      const newEntry = new GuestBookEntry({
        id: uuidv4(),
        guestBookId: guestBookId,
        data: entryData,
        createdAt: new Date().toISOString()
      });

      guestBook.entries.push(newEntry.toJSON());
      await this.updateGuestBook(guestBookId, { entries: guestBook.entries });

      return newEntry;
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  }

  async generateDocument(guestBookId) {
    try {
      const guestBook = await this.getGuestBook(guestBookId);
      if (!guestBook) {
        throw new Error('Guest book not found');
      }

      if (!guestBook.templatePath) {
        throw new Error('No template uploaded for this guest book');
      }

      // Read template file
      const templateContent = await fs.readFile(guestBook.templatePath, 'binary');
      const zip = new PizZip(templateContent);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Prepare data for template
      const templateData = {
        guestbook_name: guestBook.name,
        date: new Date().toLocaleDateString('fr-FR'),
        entries: guestBook.entries.map(entry => entry.data),
        total_entries: guestBook.entries.length
      };

      // Render the document
      doc.render(templateData);

      const buffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE'
      });

      // Save generated document
      const outputFileName = `guestbook-${guestBookId}-${Date.now()}.docx`;
      const outputPath = path.join(this.outputDir, outputFileName);
      await fs.writeFile(outputPath, buffer);

      return outputPath;
    } catch (error) {
      console.error('Error generating document:', error);

      // Better error messages for template errors
      if (error.properties && error.properties.errors) {
        const errorMessages = error.properties.errors.map(err => {
          return `Template error at ${err.part}: ${err.message}`;
        }).join(', ');
        throw new Error(`Template rendering error: ${errorMessages}`);
      }

      throw error;
    }
  }

  async extractTemplateFields(templatePath) {
    try {
      const templateContent = await fs.readFile(templatePath, 'binary');
      const zip = new PizZip(templateContent);
      const doc = new Docxtemplater(zip);

      // Get all tags/placeholders from the template
      const tags = doc.getFullText().match(/\{([^}]+)\}/g) || [];
      const uniqueTags = [...new Set(tags.map(tag => tag.replace(/[{}]/g, '')))];

      return uniqueTags;
    } catch (error) {
      console.error('Error extracting template fields:', error);
      return [];
    }
  }
}

module.exports = new GuestBookService();
