// 📄 TEMPLATE ROUTES

const express = require('express');
const router = express.Router();
const TemplateController = require('../controllers/template.controller');

// GET /api/templates - Get all templates
router.get('/', TemplateController.getAllTemplates);

// GET /api/templates/slug/:slug - Get template by slug
router.get('/slug/:slug', TemplateController.getTemplateBySlug);

// GET /api/templates/:id - Get single template
router.get('/:id', TemplateController.getTemplate);

module.exports = router;
