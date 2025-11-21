// 💍 SITE MODEL - In-memory site storage

class Site {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id || 1; // Default user
    this.template_id = data.template_id;
    this.couple_name = data.couple_name;
    this.slug = data.slug || this.generateSlug(data.couple_name);
    this.couple_data = data.couple_data || {};
    this.theme_overrides = data.theme_overrides || {};
    this.is_published = data.is_published || false;
    this.published_at = data.published_at || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

// In-memory storage
const sites = [];
let nextId = 1;

// Initialize with sample data
function initializeSampleData() {
  if (sites.length === 0) {
    // Create a sample site for testing
    const sampleSite = new Site({
      id: nextId++,
      user_id: 1,
      template_id: 1,
      couple_name: 'Marie & Jean',
      couple_data: {
        bride_name: 'Marie',
        groom_name: 'Jean',
        wedding_date: '2024-06-15',
        wedding_location: 'Château de Versailles'
      },
      theme_overrides: {},
      is_published: false
    });
    sites.push(sampleSite);
    console.log('✅ Sample site created with ID:', sampleSite.id);
  }
}

// Initialize on module load
initializeSampleData();

// Site operations
class SiteModel {
  static getAll(userId = 1) {
    return sites.filter(s => s.user_id === userId);
  }

  static getById(id) {
    return sites.find(s => s.id === parseInt(id));
  }

  static getBySlug(slug) {
    return sites.find(s => s.slug === slug && s.is_published);
  }

  static create(data) {
    const site = new Site({
      ...data,
      id: nextId++
    });
    sites.push(site);
    return site;
  }

  static update(id, data) {
    const index = sites.findIndex(s => s.id === parseInt(id));
    if (index === -1) return null;

    sites[index] = new Site({
      ...sites[index],
      ...data,
      id: parseInt(id),
      updated_at: new Date().toISOString()
    });

    return sites[index];
  }

  static delete(id) {
    const index = sites.findIndex(s => s.id === parseInt(id));
    if (index === -1) return false;

    sites.splice(index, 1);
    return true;
  }

  static publish(id) {
    const site = this.getById(id);
    if (!site) return null;

    return this.update(id, {
      is_published: true,
      published_at: new Date().toISOString()
    });
  }

  static unpublish(id) {
    const site = this.getById(id);
    if (!site) return null;

    return this.update(id, {
      is_published: false,
      published_at: null
    });
  }
}

module.exports = SiteModel;
