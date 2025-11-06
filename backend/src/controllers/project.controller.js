const storageService = require('../services/storage.service');
const projectGenerator = require('../services/project-generator.service');
const path = require('path');

class ProjectController {
  // Get all projects
  async getAllProjects(req, res) {
    try {
      const projects = await storageService.getAllProjects();
      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching projects',
        error: error.message
      });
    }
  }

  // Get single project
  async getProject(req, res) {
    try {
      const { id } = req.params;
      const project = await storageService.getProject(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching project',
        error: error.message
      });
    }
  }

  // Create new project
  async createProject(req, res) {
    try {
      const projectData = req.body;
      const project = await storageService.createProject(projectData);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating project',
        error: error.message
      });
    }
  }

  // Update project
  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const project = await storageService.updateProject(id, updates);

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating project',
        error: error.message
      });
    }
  }

  // Auto-save project elements
  async autoSave(req, res) {
    try {
      const { id } = req.params;
      const { elements } = req.body;

      const project = await storageService.autoSave(id, elements);

      res.json({
        success: true,
        message: 'Auto-saved successfully',
        data: {
          id: project.id,
          updatedAt: project.updatedAt
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error auto-saving project',
        error: error.message
      });
    }
  }

  // Delete project
  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      await storageService.deleteProject(id);

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting project',
        error: error.message
      });
    }
  }

  // Export project as HTML
  async exportHTML(req, res) {
    try {
      const { id } = req.params;
      const project = await storageService.getProject(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const html = projectGenerator.generateHTML(project);

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${project.name}.html"`);
      res.send(html);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error exporting HTML',
        error: error.message
      });
    }
  }

  // Generate Angular project
  async generateAngularProject(req, res) {
    try {
      const { id } = req.params;
      const project = await storageService.getProject(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const projectPath = await projectGenerator.generateAngularProject(project);
      const zipPath = await projectGenerator.createProjectArchive(projectPath);

      res.download(zipPath, `${project.name}.zip`, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
        // Clean up files after download
        // Note: In production, you might want to do this differently
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error generating Angular project',
        error: error.message
      });
    }
  }
}

module.exports = new ProjectController();
