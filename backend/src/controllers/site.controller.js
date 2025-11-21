// 💍 SITE CONTROLLER

const SiteModel = require('../models/Site');
const TemplateModel = require('../models/Template');

// In-memory RSVP storage
const rsvpResponses = [];

class SiteController {
  // GET /api/sites - Get all sites for user
  static async getAllSites(req, res) {
    try {
      const userId = req.user?.id || 1; // Default user for now
      const sites = SiteModel.getAll(userId);
      res.json(sites);
    } catch (error) {
      console.error('Error fetching sites:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sites',
        error: error.message
      });
    }
  }

  // GET /api/sites/:id - Get single site
  static async getSite(req, res) {
    try {
      const { id } = req.params;
      const site = SiteModel.getById(id);

      if (!site) {
        return res.status(404).json({
          success: false,
          message: 'Site not found'
        });
      }

      res.json(site);
    } catch (error) {
      console.error('Error fetching site:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch site',
        error: error.message
      });
    }
  }

  // GET /api/sites/public/:slug - Get published site by slug (public)
  static async getPublishedSite(req, res) {
    try {
      const { slug } = req.params;
      const site = SiteModel.getBySlug(slug);

      if (!site) {
        return res.status(404).json({
          success: false,
          message: 'Site not found or not published'
        });
      }

      res.json(site);
    } catch (error) {
      console.error('Error fetching published site:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch site',
        error: error.message
      });
    }
  }

  // POST /api/sites - Create new site
  static async createSite(req, res) {
    try {
      const { template_id, couple_name } = req.body;

      if (!template_id || !couple_name) {
        return res.status(400).json({
          success: false,
          message: 'template_id and couple_name are required'
        });
      }

      // Verify template exists
      const template = TemplateModel.getById(template_id);
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      const userId = req.user?.id || 1; // Default user

      const site = SiteModel.create({
        user_id: userId,
        template_id,
        couple_name,
        couple_data: {},
        theme_overrides: {}
      });

      res.status(201).json(site);
    } catch (error) {
      console.error('Error creating site:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create site',
        error: error.message
      });
    }
  }

  // PATCH /api/sites/:id - Update site
  static async updateSite(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const site = SiteModel.getById(id);
      if (!site) {
        return res.status(404).json({
          success: false,
          message: 'Site not found'
        });
      }

      const updatedSite = SiteModel.update(id, updates);

      res.json(updatedSite);
    } catch (error) {
      console.error('Error updating site:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update site',
        error: error.message
      });
    }
  }

  // POST /api/sites/:id/publish - Publish site
  static async publishSite(req, res) {
    try {
      const { id } = req.params;

      const site = SiteModel.getById(id);
      if (!site) {
        return res.status(404).json({
          success: false,
          message: 'Site not found'
        });
      }

      const publishedSite = SiteModel.publish(id);

      res.json({
        success: true,
        site: publishedSite,
        published_url: `${req.protocol}://${req.get('host')}/sites/${publishedSite.slug}`
      });
    } catch (error) {
      console.error('Error publishing site:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to publish site',
        error: error.message
      });
    }
  }

  // POST /api/sites/:id/unpublish - Unpublish site
  static async unpublishSite(req, res) {
    try {
      const { id } = req.params;

      const site = SiteModel.getById(id);
      if (!site) {
        return res.status(404).json({
          success: false,
          message: 'Site not found'
        });
      }

      const unpublishedSite = SiteModel.unpublish(id);

      res.json(unpublishedSite);
    } catch (error) {
      console.error('Error unpublishing site:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unpublish site',
        error: error.message
      });
    }
  }

  // DELETE /api/sites/:id - Delete site
  static async deleteSite(req, res) {
    try {
      const { id } = req.params;

      const site = SiteModel.getById(id);
      if (!site) {
        return res.status(404).json({
          success: false,
          message: 'Site not found'
        });
      }

      SiteModel.delete(id);

      res.json({
        success: true,
        message: 'Site deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting site:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete site',
        error: error.message
      });
    }
  }

  // POST /api/sites/:id/rsvp - Submit RSVP (public)
  static async submitRSVP(req, res) {
    try {
      const { id } = req.params;
      const guestData = req.body.guest_data || req.body;

      const site = SiteModel.getById(id);
      if (!site || !site.is_published) {
        return res.status(404).json({
          success: false,
          message: 'Site not found or not published'
        });
      }

      const rsvp = {
        id: rsvpResponses.length + 1,
        site_id: parseInt(id),
        guest_data: guestData,
        created_at: new Date().toISOString()
      };

      rsvpResponses.push(rsvp);

      res.json({
        success: true,
        message: 'RSVP submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit RSVP',
        error: error.message
      });
    }
  }

  // GET /api/sites/:id/rsvp - Get RSVP responses (owner only)
  static async getRSVPResponses(req, res) {
    try {
      const { id } = req.params;

      const site = SiteModel.getById(id);
      if (!site) {
        return res.status(404).json({
          success: false,
          message: 'Site not found'
        });
      }

      const responses = rsvpResponses.filter(r => r.site_id === parseInt(id));

      res.json(responses);
    } catch (error) {
      console.error('Error fetching RSVP responses:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch RSVP responses',
        error: error.message
      });
    }
  }
}

module.exports = SiteController;
