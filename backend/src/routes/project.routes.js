const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

// Get all projects
router.get('/', projectController.getAllProjects.bind(projectController));

// Get single project
router.get('/:id', projectController.getProject.bind(projectController));

// Create new project
router.post('/', projectController.createProject.bind(projectController));

// Update project
router.put('/:id', projectController.updateProject.bind(projectController));

// Auto-save project
router.post('/:id/autosave', projectController.autoSave.bind(projectController));

// Delete project
router.delete('/:id', projectController.deleteProject.bind(projectController));

// Export as HTML
router.get('/:id/export/html', projectController.exportHTML.bind(projectController));

// Generate Angular project
router.get('/:id/generate/angular', projectController.generateAngularProject.bind(projectController));

module.exports = router;
