// 🧭 NAVIGATION CONTROLLER (v2+)

const NavigationModel = require('../models/Navigation');

class NavigationController {
  // GET /api/sites/:siteId/navigation - Get navigation menu
  static async getNavigation(req, res) {
    try {
      const { siteId } = req.params;
      let menu = NavigationModel.get(siteId);

      if (!menu) {
        // Create default menu
        menu = NavigationModel.create(siteId, {
          items: [],
          style: 'horizontal'
        });
      }

      res.json(menu);
    } catch (error) {
      console.error('Error fetching navigation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch navigation',
        error: error.message
      });
    }
  }

  // PATCH /api/sites/:siteId/navigation - Update navigation menu
  static async updateNavigation(req, res) {
    try {
      const { siteId } = req.params;
      const updates = req.body;

      const menu = NavigationModel.update(siteId, updates);

      res.json(menu);
    } catch (error) {
      console.error('Error updating navigation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update navigation',
        error: error.message
      });
    }
  }
}

module.exports = NavigationController;
