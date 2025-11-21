// 📄 PAGE CONTROLLER (v2+)

const PageModel = require('../models/Page');
const NavigationModel = require('../models/Navigation');

class PageController {
  // GET /api/sites/:siteId/pages - Get all pages
  static async getAllPages(req, res) {
    try {
      const { siteId } = req.params;
      const pages = PageModel.getAll(siteId);
      res.json(pages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch pages',
        error: error.message
      });
    }
  }

  // GET /api/sites/:siteId/pages/:pageId - Get single page
  static async getPage(req, res) {
    try {
      const { pageId } = req.params;
      const page = PageModel.getById(pageId);

      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }

      res.json(page);
    } catch (error) {
      console.error('Error fetching page:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch page',
        error: error.message
      });
    }
  }

  // POST /api/sites/:siteId/pages - Create new page
  static async createPage(req, res) {
    try {
      const { siteId } = req.params;
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'title is required'
        });
      }

      // Get existing pages to determine order
      const existingPages = PageModel.getAll(siteId);
      const maxOrder = existingPages.length > 0
        ? Math.max(...existingPages.map(p => p.order))
        : 0;

      const page = PageModel.create({
        site_id: parseInt(siteId),
        title,
        order: maxOrder + 1,
        structure: [],
        meta: {
          showInMenu: true,
          isHomepage: existingPages.length === 0,
          icon: null
        }
      });

      // Update navigation menu
      const pages = PageModel.getAll(siteId);
      NavigationModel.generateFromPages(siteId, pages);

      res.status(201).json(page);
    } catch (error) {
      console.error('Error creating page:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create page',
        error: error.message
      });
    }
  }

  // PATCH /api/sites/:siteId/pages/:pageId - Update page
  static async updatePage(req, res) {
    try {
      const { pageId } = req.params;
      const updates = req.body;

      const page = PageModel.update(pageId, updates);

      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }

      res.json(page);
    } catch (error) {
      console.error('Error updating page:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update page',
        error: error.message
      });
    }
  }

  // DELETE /api/sites/:siteId/pages/:pageId - Delete page
  static async deletePage(req, res) {
    try {
      const { siteId, pageId } = req.params;

      const success = PageModel.delete(pageId);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }

      // Update navigation menu
      const pages = PageModel.getAll(siteId);
      NavigationModel.generateFromPages(siteId, pages);

      res.json({
        success: true,
        message: 'Page deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting page:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete page',
        error: error.message
      });
    }
  }

  // POST /api/sites/:siteId/pages/reorder - Reorder pages
  static async reorderPages(req, res) {
    try {
      const { siteId } = req.params;
      const { pageIds } = req.body;

      if (!Array.isArray(pageIds)) {
        return res.status(400).json({
          success: false,
          message: 'pageIds must be an array'
        });
      }

      const pages = PageModel.reorderPages(siteId, pageIds);
      res.json(pages);
    } catch (error) {
      console.error('Error reordering pages:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reorder pages',
        error: error.message
      });
    }
  }

  // POST /api/sites/:siteId/pages/:pageId/blocks - Add block to page
  static async addBlock(req, res) {
    try {
      const { pageId } = req.params;
      const { blockType, properties, order } = req.body;

      const block = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: blockType,
        properties: properties || {},
        order: order || 0
      };

      const page = PageModel.addBlock(pageId, block);

      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }

      res.json(page);
    } catch (error) {
      console.error('Error adding block:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add block',
        error: error.message
      });
    }
  }

  // PATCH /api/sites/:siteId/pages/:pageId/blocks/:blockId - Update block
  static async updateBlock(req, res) {
    try {
      const { pageId, blockId } = req.params;
      const { properties } = req.body;

      const page = PageModel.updateBlock(pageId, blockId, properties);

      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }

      res.json(page);
    } catch (error) {
      console.error('Error updating block:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update block',
        error: error.message
      });
    }
  }

  // DELETE /api/sites/:siteId/pages/:pageId/blocks/:blockId - Remove block
  static async removeBlock(req, res) {
    try {
      const { pageId, blockId } = req.params;

      const page = PageModel.removeBlock(pageId, blockId);

      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }

      res.json(page);
    } catch (error) {
      console.error('Error removing block:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove block',
        error: error.message
      });
    }
  }

  // POST /api/sites/:siteId/pages/:pageId/blocks/reorder - Reorder blocks
  static async reorderBlocks(req, res) {
    try {
      const { pageId } = req.params;
      const { blockIds } = req.body;

      if (!Array.isArray(blockIds)) {
        return res.status(400).json({
          success: false,
          message: 'blockIds must be an array'
        });
      }

      const page = PageModel.reorderBlocks(pageId, blockIds);

      if (!page) {
        return res.status(404).json({
          success: false,
          message: 'Page not found'
        });
      }

      res.json(page);
    } catch (error) {
      console.error('Error reordering blocks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reorder blocks',
        error: error.message
      });
    }
  }
}

module.exports = PageController;
