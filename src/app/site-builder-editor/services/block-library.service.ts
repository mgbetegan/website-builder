// 🧩 BLOCK LIBRARY SERVICE - Manage available block templates (v2+)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { BlockTemplate, BlockType, Block } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BlockLibraryService {
  private readonly API_URL = '/api/block-library';

  // Cache for block templates
  private blockLibraryCache$: Observable<BlockTemplate[]> | null = null;

  constructor(private http: HttpClient) {}

  // ========================
  // GET BLOCK TEMPLATES
  // ========================

  /**
   * Get all available block templates
   */
  getAvailableBlocks(): Observable<BlockTemplate[]> {
    if (!this.blockLibraryCache$) {
      this.blockLibraryCache$ = this.http.get<BlockTemplate[]>(this.API_URL).pipe(
        tap(blocks => console.log(`✅ Loaded ${blocks.length} block templates`)),
        shareReplay(1),
        catchError(error => {
          console.error('❌ Failed to load block library, using defaults', error);
          return of(this.getDefaultBlockLibrary());
        })
      );
    }

    return this.blockLibraryCache$;
  }

  /**
   * Get a specific block template
   */
  getBlockTemplate(blockType: BlockType): Observable<BlockTemplate | undefined> {
    return this.http.get<BlockTemplate>(`${this.API_URL}/${blockType}`).pipe(
      tap(block => console.log(`✅ Loaded block template: ${block.name}`)),
      catchError(error => {
        console.error(`❌ Failed to load block template ${blockType}`, error);
        return of(this.getDefaultBlockLibrary().find(b => b.type === blockType));
      })
    );
  }

  // ========================
  // BLOCK CREATION
  // ========================

  /**
   * Create a block from template
   */
  createBlockFromTemplate(blockType: BlockType): Block {
    const template = this.getDefaultBlockLibrary().find(b => b.type === blockType);

    if (!template) {
      throw new Error(`Block template not found: ${blockType}`);
    }

    return {
      id: this.generateBlockId(blockType),
      type: blockType,
      properties: { ...template.defaultProperties },
      order: 0
    };
  }

  /**
   * Generate unique block ID
   */
  private generateBlockId(blockType: BlockType): string {
    return `${blockType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ========================
  // VALIDATION
  // ========================

  /**
   * Validate a block
   */
  validateBlock(block: Block): string[] {
    const errors: string[] = [];
    const template = this.getDefaultBlockLibrary().find(b => b.type === block.type);

    if (!template) {
      errors.push(`Type de bloc inconnu: ${block.type}`);
      return errors;
    }

    // Validate required fields
    for (const field of template.editableFields) {
      if (field.required && !block.properties[field.name]) {
        errors.push(`Le champ "${field.label}" est requis pour le bloc ${template.name}`);
      }
    }

    return errors;
  }

  // ========================
  // DEFAULT BLOCK LIBRARY
  // ========================

  /**
   * Get default block library (fallback if API fails)
   */
  private getDefaultBlockLibrary(): BlockTemplate[] {
    return [
      // TEXT SECTION
      {
        id: 'text_section',
        type: 'text_section',
        name: 'Section Texte',
        description: 'Une section avec titre et contenu texte',
        category: 'content',
        icon: '📝',
        defaultProperties: {
          title: 'Titre de la section',
          content: 'Contenu de la section...',
          alignment: 'left',
          backgroundColor: '#ffffff'
        },
        editableFields: [
          { name: 'title', label: 'Titre', type: 'text', section: 'Content', required: false },
          { name: 'content', label: 'Contenu', type: 'textarea', section: 'Content', required: true },
          { name: 'alignment', label: 'Alignement', type: 'text', section: 'Style', required: false },
          { name: 'backgroundColor', label: 'Couleur de fond', type: 'text', section: 'Style', required: false }
        ],
        requiresConfig: false
      },

      // CUSTOM FORM
      {
        id: 'form_custom',
        type: 'form_custom',
        name: 'Formulaire Personnalisé',
        description: 'Un formulaire avec champs customisables',
        category: 'form',
        icon: '📋',
        defaultProperties: {
          title: 'Formulaire',
          successMessage: 'Merci ! Votre réponse a été enregistrée.',
          submitEndpoint: '/api/form-submission',
          fields: []
        },
        editableFields: [
          { name: 'title', label: 'Titre', type: 'text', section: 'Content', required: true },
          { name: 'successMessage', label: 'Message de succès', type: 'textarea', section: 'Content', required: false },
          { name: 'fields', label: 'Champs', type: 'faq_list', section: 'Form', required: true }
        ],
        requiresConfig: true
      },

      // CUSTOM FAQ
      {
        id: 'faq_custom',
        type: 'faq_custom',
        name: 'FAQ Personnalisée',
        description: 'FAQ avec questions/réponses customisables',
        category: 'content',
        icon: '❓',
        defaultProperties: {
          title: 'Questions Fréquentes',
          subtitle: 'Trouvez les réponses à vos questions',
          items: []
        },
        editableFields: [
          { name: 'title', label: 'Titre', type: 'text', section: 'Content', required: true },
          { name: 'subtitle', label: 'Sous-titre', type: 'text', section: 'Content', required: false },
          { name: 'items', label: 'Questions/Réponses', type: 'faq_list', section: 'Content', required: true }
        ],
        requiresConfig: true
      },

      // GALLERY
      {
        id: 'gallery',
        type: 'gallery',
        name: 'Galerie',
        description: 'Galerie d\'images',
        category: 'media',
        icon: '🖼️',
        defaultProperties: {
          title: 'Galerie',
          layout: 'grid',
          images: []
        },
        editableFields: [
          { name: 'title', label: 'Titre', type: 'text', section: 'Content', required: false },
          { name: 'layout', label: 'Layout', type: 'text', section: 'Style', required: false },
          { name: 'images', label: 'Images', type: 'faq_list', section: 'Content', required: true }
        ],
        requiresConfig: true
      },

      // BUTTON
      {
        id: 'button',
        type: 'button',
        name: 'Bouton',
        description: 'Bouton d\'action avec navigation',
        category: 'navigation',
        icon: '🔘',
        defaultProperties: {
          text: 'Cliquez ici',
          action: 'navigate',
          linkedPageId: null,
          backgroundColor: '#2196f3',
          textColor: '#ffffff'
        },
        editableFields: [
          { name: 'text', label: 'Texte', type: 'text', section: 'Content', required: true },
          { name: 'action', label: 'Action', type: 'text', section: 'Behavior', required: true },
          { name: 'linkedPageId', label: 'Page liée', type: 'text', section: 'Behavior', required: false },
          { name: 'backgroundColor', label: 'Couleur de fond', type: 'text', section: 'Style', required: false },
          { name: 'textColor', label: 'Couleur du texte', type: 'text', section: 'Style', required: false }
        ],
        requiresConfig: false
      },

      // DIVIDER
      {
        id: 'divider',
        type: 'divider',
        name: 'Séparateur',
        description: 'Ligne de séparation',
        category: 'layout',
        icon: '➖',
        defaultProperties: {
          height: '2px',
          color: '#e0e0e0',
          marginTop: '2rem',
          marginBottom: '2rem'
        },
        editableFields: [
          { name: 'height', label: 'Hauteur', type: 'text', section: 'Style', required: false },
          { name: 'color', label: 'Couleur', type: 'text', section: 'Style', required: false }
        ],
        requiresConfig: false
      },

      // SCHEDULE/TIMELINE
      {
        id: 'schedule',
        type: 'schedule',
        name: 'Programme / Timeline',
        description: 'Programme avec horaires',
        category: 'content',
        icon: '📅',
        defaultProperties: {
          title: 'Programme du Jour',
          events: []
        },
        editableFields: [
          { name: 'title', label: 'Titre', type: 'text', section: 'Content', required: true },
          { name: 'events', label: 'Événements', type: 'faq_list', section: 'Content', required: true }
        ],
        requiresConfig: true
      }
    ];
  }

  /**
   * Check if a block type can have children
   */
  canHaveChildren(blockType: BlockType): boolean {
    const containerBlocks: BlockType[] = [
      'couple_section',
      'faq_section'
    ];
    return containerBlocks.includes(blockType);
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.blockLibraryCache$ = null;
  }
}
