// 🧭 NAVIGATION MODEL - In-memory navigation storage (v2+)

class NavigationMenu {
  constructor(data) {
    this.site_id = data.site_id;
    this.items = data.items || [];
    this.style = data.style || 'horizontal';
    this.updated_at = data.updated_at || new Date().toISOString();
  }
}

// In-memory storage
const navigationMenus = new Map();

// Navigation operations
class NavigationModel {
  static get(siteId) {
    return navigationMenus.get(parseInt(siteId));
  }

  static create(siteId, data) {
    const menu = new NavigationMenu({
      ...data,
      site_id: parseInt(siteId)
    });
    navigationMenus.set(parseInt(siteId), menu);
    return menu;
  }

  static update(siteId, data) {
    const existing = this.get(siteId);
    if (!existing) {
      return this.create(siteId, data);
    }

    const menu = new NavigationMenu({
      ...existing,
      ...data,
      site_id: parseInt(siteId),
      updated_at: new Date().toISOString()
    });

    navigationMenus.set(parseInt(siteId), menu);
    return menu;
  }

  static generateFromPages(siteId, pages) {
    const items = pages
      .filter(page => page.meta.showInMenu)
      .sort((a, b) => a.order - b.order)
      .map(page => ({
        id: `menu-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        label: page.title,
        pageId: page.id,
        order: page.order,
        isVisible: true,
        icon: page.meta.icon
      }));

    return this.create(siteId, { items, style: 'horizontal' });
  }
}

module.exports = NavigationModel;
