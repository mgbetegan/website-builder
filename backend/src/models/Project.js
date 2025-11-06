class Project {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || 'Untitled Project';
    this.description = data.description || '';
    this.elements = data.elements || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.userId = data.userId || 'anonymous';
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      elements: this.elements,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId
    };
  }

  static fromJSON(json) {
    return new Project(json);
  }
}

module.exports = Project;
