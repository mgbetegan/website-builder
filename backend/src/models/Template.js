// 📄 TEMPLATE MODEL - In-memory template storage

class Template {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.thumbnail = data.thumbnail;
    this.description = data.description;
    this.structure = data.structure;
    this.default_theme = data.default_theme;
    this.fieldDefinitions = data.fieldDefinitions;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }
}

// In-memory storage
const templates = [];
let nextId = 1;

// Default template
const defaultTemplate = new Template({
  id: nextId++,
  name: 'Mariage Élégant',
  slug: 'mariage-elegant',
  thumbnail: '/assets/templates/elegant-wedding.jpg',
  description: 'Template élégant pour site de mariage avec hero, countdown, et FAQ',
  structure: [
    {
      id: 'nav-1',
      type: 'navigation',
      properties: {
        logo: 'M & J',
        items: [
          { label: 'Accueil', href: 'hero' },
          { label: 'Notre Histoire', href: 'couple' },
          { label: 'FAQ', href: 'faq' },
          { label: 'RSVP', href: 'rsvp' }
        ],
        buttonLabel: 'RÉSERVER'
      }
    },
    {
      id: 'hero-1',
      type: 'hero',
      properties: {
        backgroundImageSlot: 'hero_image',
        overlay: { color: 'rgba(0,0,0,0.3)', blur: false },
        minHeight: '700px'
      },
      children: [
        {
          id: 'invitation-1',
          type: 'invitation_card',
          properties: {
            nameSlot: 'couple_name',
            dateSlot: 'wedding_date',
            subtitleSlot: 'invitation_text',
            backgroundColor: '#ffffff',
            opacity: 0.95
          }
        }
      ]
    },
    {
      id: 'countdown-1',
      type: 'countdown',
      properties: {
        dateSlot: 'wedding_date',
        labels: {
          days: 'Jours',
          hours: 'Heures',
          minutes: 'Minutes',
          seconds: 'Secondes'
        }
      }
    },
    {
      id: 'couple-section-1',
      type: 'couple_section',
      properties: {
        titleSlot: 'couple_section_title',
        subtitleSlot: 'couple_section_subtitle',
        backgroundColor: '#f9f9f9'
      },
      children: []
    },
    {
      id: 'faq-section-1',
      type: 'faq_section',
      properties: {
        titleSlot: 'faq_title',
        subtitleSlot: 'faq_subtitle'
      },
      children: []
    },
    {
      id: 'rsvp-form-1',
      type: 'rsvp_form',
      properties: {
        titleSlot: 'rsvp_title',
        fields: [
          { name: 'name', label: 'Nom Complet', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'guests', label: 'Nombre d\'invités', type: 'number', required: true },
          { name: 'attendance', label: 'Présence', type: 'select', required: true, options: ['Oui', 'Non', 'Peut-être'] },
          { name: 'message', label: 'Message', type: 'textarea', required: false }
        ]
      }
    }
  ],
  default_theme: {
    colors: {
      primary: '#8B7355',
      secondary: '#D4AF37',
      text: '#2C2C2C',
      background: '#FFFFFF'
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Montserrat, sans-serif'
    }
  },
  fieldDefinitions: [
    { name: 'couple_name', label: 'Nom du Couple', type: 'text', section: 'Informations du Couple', required: true, placeholder: 'Ex: Marie & Jean' },
    { name: 'bride_name', label: 'Nom de la Mariée', type: 'text', section: 'Informations du Couple', required: true },
    { name: 'groom_name', label: 'Nom du Marié', type: 'text', section: 'Informations du Couple', required: true },
    { name: 'wedding_date', label: 'Date du Mariage', type: 'date', section: 'Informations du Couple', required: true },
    { name: 'hero_image', label: 'Image Hero', type: 'image', section: 'Images', required: false },
    { name: 'bride_image', label: 'Photo de la Mariée', type: 'image', section: 'Images', required: false },
    { name: 'groom_image', label: 'Photo du Marié', type: 'image', section: 'Images', required: false },
    { name: 'invitation_text', label: 'Texte d\'Invitation', type: 'textarea', section: 'Contenu', required: false },
    { name: 'bride_bio', label: 'Bio de la Mariée', type: 'textarea', section: 'Contenu', required: false },
    { name: 'groom_bio', label: 'Bio du Marié', type: 'textarea', section: 'Contenu', required: false },
    { name: 'couple_section_title', label: 'Titre Section Couple', type: 'text', section: 'Contenu', required: false, default: 'Notre Histoire' },
    { name: 'couple_section_subtitle', label: 'Sous-titre Section Couple', type: 'text', section: 'Contenu', required: false },
    { name: 'faq_title', label: 'Titre FAQ', type: 'text', section: 'FAQ', required: false, default: 'Questions Fréquentes' },
    { name: 'faq_subtitle', label: 'Sous-titre FAQ', type: 'text', section: 'FAQ', required: false },
    { name: 'faqs', label: 'Liste des FAQs', type: 'faq_list', section: 'FAQ', required: false },
    { name: 'rsvp_title', label: 'Titre RSVP', type: 'text', section: 'RSVP', required: false, default: 'Confirmez votre Présence' }
  ]
});

templates.push(defaultTemplate);

// Template operations
class TemplateModel {
  static getAll() {
    return templates;
  }

  static getById(id) {
    return templates.find(t => t.id === parseInt(id));
  }

  static getBySlug(slug) {
    return templates.find(t => t.slug === slug);
  }

  static create(data) {
    const template = new Template({
      ...data,
      id: nextId++
    });
    templates.push(template);
    return template;
  }
}

module.exports = TemplateModel;
