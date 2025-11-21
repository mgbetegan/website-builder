// 🚀 SITE BUILDER - Models & Interfaces
// All TypeScript interfaces for the site builder

// ========================
// BLOCK TYPES
// ========================

export type BlockType =
  | 'navigation'
  | 'hero'
  | 'invitation_card'
  | 'countdown'
  | 'couple_section'
  | 'person_bio'
  | 'faq_section'
  | 'accordion_item'
  | 'rsvp_form';

// ========================
// BLOCK INTERFACE
// ========================

export interface Block {
  id: string;
  type: BlockType;
  properties: Record<string, any>;
  children?: Block[];
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
