class GuestBook {
  constructor(data = {}) {
    this.id = data.id || null;
    this.projectId = data.projectId || null;
    this.name = data.name || 'Livre d\'or';
    this.templatePath = data.templatePath || null;
    this.templateOriginalName = data.templateOriginalName || null;
    this.entries = data.entries || [];
    this.fields = data.fields || []; // Array of field definitions
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      name: this.name,
      templatePath: this.templatePath,
      templateOriginalName: this.templateOriginalName,
      entries: this.entries,
      fields: this.fields,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(json) {
    return new GuestBook(json);
  }
}

class GuestBookEntry {
  constructor(data = {}) {
    this.id = data.id || null;
    this.guestBookId = data.guestBookId || null;
    this.data = data.data || {}; // Key-value pairs matching template fields
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      guestBookId: this.guestBookId,
      data: this.data,
      createdAt: this.createdAt
    };
  }

  static fromJSON(json) {
    return new GuestBookEntry(json);
  }
}

module.exports = { GuestBook, GuestBookEntry };
