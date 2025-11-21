// 📄 TEMPLATE CONTROLLER

const TemplateModel = require('../models/Template');

class TemplateController {
  // GET /api/templates - Get all templates
  static async getAllTemplates(req, res) {
    try {
      const templates = TemplateModel.getAll();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch templates',
        error: error.message
      });
    }
  }

  // GET /api/templates/:id - Get single template
  static async getTemplate(req, res) {
    try {
      const { id } = req.params;
      const template = TemplateModel.getById(id);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json(template);
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch template',
        error: error.message
      });
    }
  }

  // GET /api/templates/slug/:slug - Get template by slug
  static async getTemplateBySlug(req, res) {
    try {
      const { slug } = req.params;
      const template = TemplateModel.getBySlug(slug);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json(template);
    } catch (error) {
      console.error('Error fetching template by slug:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch template',
        error: error.message
      });
    }
  }
}

module.exports = TemplateController;
