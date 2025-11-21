// 📄 TEMPLATE SERVICE - Fetch and cache templates from backend

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { Template } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private readonly API_URL = '/api/templates';

  // Cache templates in memory
  private templatesCache$ = new BehaviorSubject<Template[] | null>(null);
  private templatesCacheLoaded = false;

  constructor(private http: HttpClient) {}

  // ========================
  // GET ALL TEMPLATES
  // ========================

  /**
   * Get all templates from the backend
   */
  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.API_URL).pipe(
      tap(templates => console.log(`✅ Loaded ${templates.length} templates`)),
      catchError(this.handleError)
    );
  }

  /**
   * Get templates from cache or fetch if not cached
   */
  getTemplatesFromCache(): Observable<Template[]> {
    if (this.templatesCacheLoaded && this.templatesCache$.value) {
      return this.templatesCache$.asObservable().pipe(
        map(cache => cache || [])
      );
    }

    return this.getTemplates().pipe(
      tap(templates => {
        this.templatesCache$.next(templates);
        this.templatesCacheLoaded = true;
      })
    );
  }

  // ========================
  // GET SINGLE TEMPLATE
  // ========================

  /**
   * Get a single template by ID
   */
  getTemplate(templateId: number): Observable<Template> {
    return this.http.get<Template>(`${this.API_URL}/${templateId}`).pipe(
      tap(template => console.log(`✅ Loaded template: ${template.name}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Get template with full field definitions
   */
  getTemplateWithFieldDefinitions(templateId: number): Observable<Template> {
    return this.http.get<Template>(`${this.API_URL}/${templateId}`).pipe(
      map(template => {
        // Ensure field definitions are present
        if (!template.fieldDefinitions || template.fieldDefinitions.length === 0) {
          console.warn('⚠️ Template has no field definitions, using defaults');
          template.fieldDefinitions = this.getDefaultFieldDefinitions();
        }
        return template;
      }),
      catchError(this.handleError)
    );
  }

  // ========================
  // CACHE MANAGEMENT
  // ========================

  /**
   * Preload templates into cache
   */
  loadTemplatesCache(): void {
    if (!this.templatesCacheLoaded) {
      this.getTemplates().subscribe(
        templates => {
          this.templatesCache$.next(templates);
          this.templatesCacheLoaded = true;
          console.log('✅ Templates cache loaded');
        },
        error => console.error('❌ Failed to load templates cache:', error)
      );
    }
  }

  /**
   * Clear the templates cache
   */
  clearCache(): void {
    this.templatesCache$.next(null);
    this.templatesCacheLoaded = false;
    console.log('🗑️ Templates cache cleared');
  }

  /**
   * Refresh the cache
   */
  refreshCache(): Observable<Template[]> {
    this.clearCache();
    return this.getTemplatesFromCache();
  }

  // ========================
  // UTILITY METHODS
  // ========================

  /**
   * Get template by slug
   */
  getTemplateBySlug(slug: string): Observable<Template | undefined> {
    return this.getTemplatesFromCache().pipe(
      map(templates => templates.find(t => t.slug === slug))
    );
  }

  /**
   * Search templates by name
   */
  searchTemplates(query: string): Observable<Template[]> {
    return this.getTemplatesFromCache().pipe(
      map(templates =>
        templates.filter(t =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  // ========================
  // DEFAULT FIELD DEFINITIONS
  // ========================

  /**
   * Get default field definitions if template doesn't have any
   */
  private getDefaultFieldDefinitions() {
    return [
      // Couple Info Section
      {
        name: 'couple_name',
        label: 'Nom du Couple',
        type: 'text' as const,
        section: 'Informations du Couple',
        required: true,
        placeholder: 'Ex: Marie & Jean'
      },
      {
        name: 'bride_name',
        label: 'Nom de la Mariée',
        type: 'text' as const,
        section: 'Informations du Couple',
        required: true,
        placeholder: 'Ex: Marie Dupont'
      },
      {
        name: 'groom_name',
        label: 'Nom du Marié',
        type: 'text' as const,
        section: 'Informations du Couple',
        required: true,
        placeholder: 'Ex: Jean Martin'
      },
      {
        name: 'wedding_date',
        label: 'Date du Mariage',
        type: 'date' as const,
        section: 'Informations du Couple',
        required: true
      },

      // Images Section
      {
        name: 'hero_image',
        label: 'Image Hero',
        type: 'image' as const,
        section: 'Images',
        required: false,
        helpText: 'Image de fond pour la section hero'
      },
      {
        name: 'bride_image',
        label: 'Photo de la Mariée',
        type: 'image' as const,
        section: 'Images',
        required: false
      },
      {
        name: 'groom_image',
        label: 'Photo du Marié',
        type: 'image' as const,
        section: 'Images',
        required: false
      },

      // Content Section
      {
        name: 'invitation_text',
        label: 'Texte d\'Invitation',
        type: 'textarea' as const,
        section: 'Contenu',
        required: false,
        placeholder: 'Nous avons l\'honneur de vous inviter...'
      },
      {
        name: 'bride_bio',
        label: 'Bio de la Mariée',
        type: 'textarea' as const,
        section: 'Contenu',
        required: false
      },
      {
        name: 'groom_bio',
        label: 'Bio du Marié',
        type: 'textarea' as const,
        section: 'Contenu',
        required: false
      },

      // FAQ Section
      {
        name: 'faq_title',
        label: 'Titre de la Section FAQ',
        type: 'text' as const,
        section: 'FAQ',
        required: false,
        default: 'Questions Fréquentes'
      },
      {
        name: 'faqs',
        label: 'Liste des FAQs',
        type: 'faq_list' as const,
        section: 'FAQ',
        required: false
      },

      // RSVP Section
      {
        name: 'rsvp_title',
        label: 'Titre du Formulaire RSVP',
        type: 'text' as const,
        section: 'RSVP',
        required: false,
        default: 'Confirmez votre Présence'
      }
    ];
  }

  // ========================
  // ERROR HANDLING
  // ========================

  private handleError(error: any): Observable<never> {
    console.error('❌ Template Service Error:', error);

    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
