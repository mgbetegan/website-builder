// 🚀 SITE BUILDER - Models & Interfaces
// All TypeScript interfaces for the site builder

// ========================
// BLOCK TYPES
// ========================

export type BlockType =
  // v1 blocks
  | 'navigation'
  | 'hero'
  | 'invitation_card'
  | 'countdown'
  | 'couple_section'
  | 'person_bio'
  | 'faq_section'
  | 'accordion_item'
  | 'rsvp_form'
  // v2+ customizable blocks
  | 'text_section'
  | 'form_custom'
  | 'faq_custom'
  | 'gallery'
  | 'testimonials'
  | 'schedule'
  | 'guest_list'
  | 'button'
  | 'divider'
  | 'contact_form';

// ========================
// BLOCK INTERFACE
// ========================

export interface Block {
  id: string;
  type: BlockType;
  pageId?: string;              // v2+: Which page does this block belong to?
  properties: Record<string, any>;
  children?: Block[];
  order?: number;               // v2+: Position in the page
}

// ========================
// THEME INTERFACE
// ========================

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

// ========================
// FAQ INTERFACE
// ========================

export interface FAQ {
  question: string;
  answer: string;
  open?: boolean;
}

// ========================
// RSVP FIELD INTERFACE
// ========================

export interface RSVPField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number' | 'date';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

// ========================
// COUPLE DATA INTERFACE
// ========================

export interface CoupleData {
  // Couple Info
  couple_name?: string;
  bride_name?: string;
  groom_name?: string;
  wedding_date?: string;

  // Bios
  bride_bio?: string;
  groom_bio?: string;

  // Images
  bride_image?: string;
  groom_image?: string;
  hero_image?: string;

  // Invitation
  invitation_text?: string;

  // Couple Section
  couple_section_title?: string;
  couple_section_subtitle?: string;

  // FAQ
  faq_title?: string;
  faq_subtitle?: string;
  faqs?: FAQ[];

  // RSVP
  rsvp_title?: string;
  rsvp_fields?: RSVPField[];

  // Ceremony Details
  ceremony_date?: string;
  ceremony_location?: string;
  ceremony_address?: string;
  ceremony_time?: string;

  // Reception Details
  reception_location?: string;
  reception_address?: string;
  reception_time?: string;

  // Additional fields (flexible)
  [key: string]: any;
}

// ========================
// FIELD DEFINITION INTERFACE
// ========================

export interface FieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'image' | 'faq_list' | 'rsvp_fields' | 'url' | 'email' | 'tel';
  section: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  default?: any;
}

// ========================
// TEMPLATE INTERFACE
// ========================

export interface Template {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  structure: Block[];
  default_theme: Theme;
  fieldDefinitions: FieldDefinition[];
  created_at?: string;
  updated_at?: string;
}

// ========================
// SITE INTERFACE
// ========================

export interface Site {
  id: number;
  user_id: number;
  template_id: number;
  couple_name: string;
  slug: string;
  couple_data: CoupleData;
  theme_overrides: Partial<Theme>;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// ========================
// EDITOR STATE INTERFACE
// ========================

export interface EditorState {
  currentSite: Site | null;
  currentTemplate: Template | null;
  coupleData: CoupleData;
  theme: Theme;
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;
}

// ========================
// MERGED SITE INTERFACE
// ========================

export interface MergedSite {
  structure: Block[];
  theme: Theme;
  metadata: {
    couple_name?: string;
    wedding_date?: string;
    slug?: string;
  };
}

// ========================
// API REQUEST/RESPONSE TYPES
// ========================

export interface CreateSiteRequest {
  template_id: number;
  couple_name: string;
}

export interface UpdateCoupleDataRequest {
  couple_data: CoupleData;
}

export interface UpdateThemeRequest {
  theme_overrides: Partial<Theme>;
}

export interface PublishSiteResponse {
  success: boolean;
  site: Site;
  published_url: string;
}

export interface RSVPSubmission {
  site_id: number;
  guest_data: Record<string, any>;
}

export interface RSVPResponse {
  success: boolean;
  message: string;
}

// ========================
// v2+ INTERFACES - PAGES MULTIPLES
// ========================

// ========================
// PAGE INTERFACE
// ========================

export interface PageMeta {
  showInMenu: boolean;
  isHomepage: boolean;
  icon?: string;
  seo?: {
    title: string;
    description: string;
  };
}

export interface Page {
  id: string;
  site_id: number;
  title: string;
  slug: string;
  description?: string;
  order: number;
  structure: Block[];
  meta: PageMeta;
  created_at: string;
  updated_at: string;
}

// ========================
// FORM FIELD (for customizable forms)
// ========================

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date';
  required: boolean;
  placeholder?: string;
  validation?: FormFieldValidation;
  options?: FormFieldOption[];
}

// ========================
// BLOCK TEMPLATE (Block Library)
// ========================

export type BlockCategory = 'content' | 'form' | 'social' | 'media' | 'navigation' | 'layout';

export interface BlockTemplate {
  id: string;
  type: BlockType;
  name: string;
  description: string;
  category: BlockCategory;
  icon: string;
  defaultProperties: Record<string, any>;
  editableFields: FieldDefinition[];
  requiresConfig: boolean;
  preview?: string;
}

// ========================
// NAVIGATION MENU
// ========================

export interface MenuItem {
  id: string;
  label: string;
  pageId: string;
  order: number;
  children?: MenuItem[];
  isVisible: boolean;
  icon?: string;
}

export interface NavigationMenu {
  site_id: number;
  items: MenuItem[];
  style: 'horizontal' | 'vertical' | 'dropdown';
}

// ========================
// PAGE ROUTE (for linking between pages)
// ========================

export interface PageRoute {
  id: string;
  fromBlockId: string;
  toPageId: string;
  action: 'navigate' | 'scroll' | 'modal';
}

// ========================
// SITE INTERFACE (Extended for v2+)
// ========================

export interface SiteExtended extends Site {
  mode: 'template' | 'pages';
  default_page_id?: number;
}

// ========================
// EDITOR STATE (Extended for v2+)
// ========================

export interface EditorStateV2 extends EditorState {
  // v2+ additions
  pages: Page[];
  currentPage: Page | null;
  currentBlock: Block | null;
  blockLibrary: BlockTemplate[];
  navigationMenu: NavigationMenu | null;
  mode: 'template' | 'pages';
}

// ========================
// MERGED PAGE (for rendering)
// ========================

export interface MergedPage {
  page: Page;
  structure: Block[];
  theme: Theme;
  navigation: NavigationMenu | null;
}

// ========================
// GALLERY ITEM
// ========================

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

// ========================
// TESTIMONIAL
// ========================

export interface Testimonial {
  id: string;
  name: string;
  photo?: string;
  text: string;
  rating?: number;
  order: number;
}

// ========================
// SCHEDULE EVENT
// ========================

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  location?: string;
  order: number;
}

// ========================
// FAQ ITEM (for custom FAQs)
// ========================

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  open?: boolean;
}

// ========================
// API TYPES FOR v2+
// ========================

export interface CreatePageRequest {
  site_id: number;
  title: string;
}

export interface UpdatePageRequest {
  title?: string;
  slug?: string;
  description?: string;
  order?: number;
  structure?: Block[];
  meta?: Partial<PageMeta>;
}

export interface AddBlockToPageRequest {
  blockType: BlockType;
  properties: Record<string, any>;
  order?: number;
}

export interface UpdateBlockRequest {
  properties: Record<string, any>;
}

export interface ReorderPagesRequest {
  pageIds: string[];
}

export interface ReorderBlocksRequest {
  blockIds: string[];
}

export interface UpdateNavigationRequest {
  items: MenuItem[];
  style?: 'horizontal' | 'vertical' | 'dropdown';
}

export interface FormSubmission {
  id: number;
  site_id: number;
  form_block_id: string;
  guest_data: Record<string, any>;
  created_at: string;
}

export interface FormSubmissionRequest {
  formBlockId: string;
  fields: Record<string, any>;
}
