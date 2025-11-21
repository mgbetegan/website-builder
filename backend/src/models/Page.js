// 📄 PAGE MODEL - In-memory page storage (v2+)

class Page {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.site_id = data.site_id;
    this.title = data.title;
    this.slug = data.slug || this.generateSlug(data.title);
    this.description = data.description || '';
    this.order = data.order || 1;
    this.structure = data.structure || [];
    this.meta = data.meta || {
      showInMenu: true,
      isHomepage: false,
      icon: null,
      seo: null
    };
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  generateId() {
    return `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

// In-memory storage
const pages = [];

// Page operations
class PageModel {
  static getAll(siteId) {
    return pages.filter(p => p.site_id === parseInt(siteId)).sort((a, b) => a.order - b.order);
  }

  static getById(pageId) {
    return pages.find(p => p.id === pageId);
  }

  static getBySiteAndSlug(siteId, slug) {
    return pages.find(p => p.site_id === parseInt(siteId) && p.slug === slug);
  }

  static create(data) {
    const page = new Page(data);
    pages.push(page);
    return page;
  }

  static update(pageId, data) {
    const index = pages.findIndex(p => p.id === pageId);
    if (index === -1) return null;

    pages[index] = new Page({
      ...pages[index],
      ...data,
      id: pageId,
      updated_at: new Date().toISOString()
    });

    return pages[index];
  }

  static delete(pageId) {
    const index = pages.findIndex(p => p.id === pageId);
    if (index === -1) return false;

    pages.splice(index, 1);
    return true;
  }

  static reorderPages(siteId, pageIds) {
    const sitePagesMap = new Map(
      this.getAll(siteId).map(p => [p.id, p])
    );

    pageIds.forEach((pageId, index) => {
      const page = sitePagesMap.get(pageId);
      if (page) {
        page.order = index + 1;
        page.updated_at = new Date().toISOString();
      }
    });

    return this.getAll(siteId);
  }

  static addBlock(pageId, block) {
    const page = this.getById(pageId);
    if (!page) return null;

    page.structure.push(block);
    page.updated_at = new Date().toISOString();

    return page;
  }

  static updateBlock(pageId, blockId, properties) {
    const page = this.getById(pageId);
    if (!page) return null;

    const updateBlockInStructure = (blocks) => {
      return blocks.map(block => {
        if (block.id === blockId) {
          return { ...block, properties: { ...block.properties, ...properties } };
        }
        if (block.children) {
          return { ...block, children: updateBlockInStructure(block.children) };
        }
        return block;
      });
    };

    page.structure = updateBlockInStructure(page.structure);
    page.updated_at = new Date().toISOString();

    return page;
  }

  static removeBlock(pageId, blockId) {
    const page = this.getById(pageId);
    if (!page) return null;

    page.structure = page.structure.filter(b => b.id !== blockId);
    page.updated_at = new Date().toISOString();

    return page;
  }

  static reorderBlocks(pageId, blockIds) {
    const page = this.getById(pageId);
    if (!page) return null;

    const blocksMap = new Map(page.structure.map(b => [b.id, b]));
    page.structure = blockIds
      .map((id, index) => {
        const block = blocksMap.get(id);
        return block ? { ...block, order: index + 1 } : null;
      })
      .filter(b => b !== null);

    page.updated_at = new Date().toISOString();

    return page;
  }
}

module.exports = PageModel;
