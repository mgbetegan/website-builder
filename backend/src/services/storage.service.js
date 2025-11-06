const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Project = require('../models/Project');

class StorageService {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.projectsFile = path.join(this.dataDir, 'projects.json');
    this.ensureDataDirectory();
  }

  async ensureDataDirectory() {
    try {
      await fs.ensureDir(this.dataDir);

      // Create projects file if it doesn't exist
      if (!await fs.pathExists(this.projectsFile)) {
        await fs.writeJson(this.projectsFile, []);
      }
    } catch (error) {
      console.error('Error ensuring data directory:', error);
    }
  }

  async getAllProjects() {
    try {
      const projects = await fs.readJson(this.projectsFile);
      return projects.map(p => Project.fromJSON(p));
    } catch (error) {
      console.error('Error reading projects:', error);
      return [];
    }
  }

  async getProject(id) {
    try {
      const projects = await this.getAllProjects();
      return projects.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }

  async createProject(projectData) {
    try {
      const projects = await this.getAllProjects();

      const newProject = new Project({
        ...projectData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      projects.push(newProject);
      await fs.writeJson(this.projectsFile, projects.map(p => p.toJSON()), { spaces: 2 });

      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id, updates) {
    try {
      const projects = await this.getAllProjects();
      const index = projects.findIndex(p => p.id === id);

      if (index === -1) {
        throw new Error('Project not found');
      }

      projects[index] = new Project({
        ...projects[index].toJSON(),
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      });

      await fs.writeJson(this.projectsFile, projects.map(p => p.toJSON()), { spaces: 2 });

      return projects[index];
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id) {
    try {
      const projects = await this.getAllProjects();
      const filtered = projects.filter(p => p.id !== id);

      if (filtered.length === projects.length) {
        throw new Error('Project not found');
      }

      await fs.writeJson(this.projectsFile, filtered.map(p => p.toJSON()), { spaces: 2 });

      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async autoSave(id, elements) {
    try {
      return await this.updateProject(id, { elements });
    } catch (error) {
      console.error('Error auto-saving project:', error);
      throw error;
    }
  }
}

module.exports = new StorageService();
