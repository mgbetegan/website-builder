// 🎯 SITE EDITOR COMPONENT - Main orchestrator for the site builder
// Manages the 3 panels and handles auto-save

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { EditorStateService } from '../services/editor-state.service';
import { SiteService } from '../services/site.service';
import { TemplateService } from '../services/template.service';
import { Site, Template, EditorState } from '../models';

@Component({
  selector: 'app-site-editor',
  templateUrl: './site-editor.component.html',
  styleUrls: ['./site-editor.component.scss']
})
export class SiteEditorComponent implements OnInit, OnDestroy {
  // ========================
  // STATE
  // ========================
  editorState!: EditorState;
  isLoading = true;
  loadingError: string | null = null;

  // Preview mode
  previewMode: 'desktop' | 'mobile' = 'desktop';

  // Active tab in left panel
  leftPanelTab: 'content' | 'design' = 'content';

  // Active tab in right panel
  rightPanelTab: 'blocks' | 'design' = 'blocks';

  // Destroy subject for cleanup
  private destroy$ = new Subject<void>();

  // Auto-save subject
  private autoSave$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private editorStateService: EditorStateService,
    private siteService: SiteService,
    private templateService: TemplateService
  ) {}

  // ========================
  // LIFECYCLE HOOKS
  // ========================

  ngOnInit(): void {
    // Load site and template from route params
    this.loadSiteAndTemplate();

    // Subscribe to editor state changes
    this.subscribeToEditorState();

    // Setup auto-save with debounce
    this.setupAutoSave();
  }

  ngOnDestroy(): void {
    // Save before leaving if there are unsaved changes
    if (this.editorStateService.hasUnsavedChanges()) {
      this.saveSite();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================
  // INITIALIZATION
  // ========================

  private loadSiteAndTemplate(): void {
    this.isLoading = true;
    this.loadingError = null;

    // Get siteId from route params
    const siteId = this.route.snapshot.paramMap.get('siteId');

    if (!siteId) {
      this.loadingError = 'ID de site manquant';
      this.isLoading = false;
      return;
    }

    // Load site
    this.siteService.getSite(+siteId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (site: Site) => {
        // Load template for this site
        this.templateService.getTemplate(site.template_id).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (template: Template) => {
            // Initialize editor state
            this.editorStateService.initializeEditor(site, template);
            this.isLoading = false;
            console.log('✅ Editor initialized');
          },
          error: (error) => {
            this.loadingError = `Erreur lors du chargement du template: ${error.message}`;
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.loadingError = `Erreur lors du chargement du site: ${error.message}`;
        this.isLoading = false;
      }
    });
  }

  private subscribeToEditorState(): void {
    this.editorStateService.getState$().pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      this.editorState = state;
    });
  }

  // ========================
  // AUTO-SAVE
  // ========================

  private setupAutoSave(): void {
    // Listen for isDirty changes
    this.editorStateService.isDirty$().pipe(
      takeUntil(this.destroy$),
      filter(isDirty => isDirty), // Only when dirty
      debounceTime(2000) // Wait 2 seconds after last change
    ).subscribe(() => {
      this.autoSaveSite();
    });

    // Also listen to manual auto-save triggers
    this.autoSave$.pipe(
      takeUntil(this.destroy$),
      debounceTime(2000)
    ).subscribe(() => {
      this.autoSaveSite();
    });
  }

  private autoSaveSite(): void {
    const state = this.editorStateService.getStateValue();

    if (!state.currentSite || state.isSaving || !state.isDirty) {
      return;
    }

    console.log('💾 Auto-saving...');
    this.saveSite();
  }

  // ========================
  // SAVE & PUBLISH
  // ========================

  saveSite(): void {
    const state = this.editorStateService.getStateValue();

    if (!state.currentSite) {
      console.error('❌ No site to save');
      return;
    }

    this.editorStateService.startSaving();

    const themeOverrides = this.calculateThemeOverrides(state);

    this.siteService.saveSite(
      state.currentSite.id,
      state.coupleData,
      themeOverrides
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedSite: Site) => {
        this.editorStateService.finishSaving(updatedSite);
        console.log('✅ Site saved successfully');
      },
      error: (error) => {
        this.editorStateService.setError(`Erreur de sauvegarde: ${error.message}`);
        console.error('❌ Save failed:', error);
      }
    });
  }

  publishSite(): void {
    const state = this.editorStateService.getStateValue();

    if (!state.currentSite) {
      return;
    }

    // Save first if dirty
    if (state.isDirty) {
      this.saveSite();
    }

    this.siteService.publishSite(state.currentSite.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.editorStateService.updateCurrentSite(response.site);
        alert(`✅ Site publié avec succès!\n\nURL: ${response.published_url}`);
        console.log('✅ Site published:', response.published_url);
      },
      error: (error) => {
        alert(`❌ Erreur de publication: ${error.message}`);
        console.error('❌ Publish failed:', error);
      }
    });
  }

  unpublishSite(): void {
    const state = this.editorStateService.getStateValue();

    if (!state.currentSite) {
      return;
    }

    this.siteService.unpublishSite(state.currentSite.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (updatedSite) => {
        this.editorStateService.updateCurrentSite(updatedSite);
        alert('✅ Site dépublié avec succès!');
      },
      error: (error) => {
        alert(`❌ Erreur: ${error.message}`);
      }
    });
  }

  // ========================
  // THEME CALCULATION
  // ========================

  private calculateThemeOverrides(state: EditorState): any {
    if (!state.currentTemplate) {
      return {};
    }

    const defaultTheme = state.currentTemplate.default_theme;
    const currentTheme = state.theme;

    const overrides: any = {};

    // Compare colors
    if (JSON.stringify(defaultTheme.colors) !== JSON.stringify(currentTheme.colors)) {
      overrides.colors = currentTheme.colors;
    }

    // Compare fonts
    if (JSON.stringify(defaultTheme.fonts) !== JSON.stringify(currentTheme.fonts)) {
      overrides.fonts = currentTheme.fonts;
    }

    return overrides;
  }

  // ========================
  // EVENT HANDLERS
  // ========================

  onDataChanged(): void {
    // Trigger auto-save
    this.autoSave$.next();
  }

  onPreviewModeChanged(mode: 'desktop' | 'mobile'): void {
    this.previewMode = mode;
  }

  onLeftPanelTabChanged(tab: 'content' | 'design'): void {
    this.leftPanelTab = tab;
  }

  onRightPanelTabChanged(tab: 'blocks' | 'design'): void {
    this.rightPanelTab = tab;
  }

  // ========================
  // NAVIGATION
  // ========================

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  // ========================
  // GETTERS
  // ========================

  get siteName(): string {
    return this.editorState?.currentSite?.couple_name || 'Nouveau Site';
  }

  get isPublished(): boolean {
    return this.editorState?.currentSite?.is_published || false;
  }

  get isSaving(): boolean {
    return this.editorState?.isSaving || false;
  }

  get isDirty(): boolean {
    return this.editorState?.isDirty || false;
  }

  get hasError(): boolean {
    return !!this.editorState?.error;
  }

  get errorMessage(): string | null {
    return this.editorState?.error || null;
  }
}
