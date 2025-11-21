// 🎯 EDITOR STATE SERVICE - Central state management with RxJS
// This is the CORE of the application - all state flows through here

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { EditorState, Site, Template, CoupleData, Theme } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EditorStateService {
  // ========================
  // INITIAL STATE
  // ========================
  private readonly initialState: EditorState = {
    currentSite: null,
    currentTemplate: null,
    coupleData: {},
    theme: {
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
    isDirty: false,
    isSaving: false,
    error: null
  };

  // ========================
  // BEHAVIOR SUBJECT - The single source of truth
  // ========================
  private stateSubject = new BehaviorSubject<EditorState>(this.initialState);

  // ========================
  // INITIALIZATION
  // ========================

  /**
   * Initialize the editor with a site and template
   */
  initializeEditor(site: Site, template: Template): void {
    const mergedTheme: Theme = {
      ...template.default_theme,
      ...this.deepMergeTheme(template.default_theme, site.theme_overrides)
    };

    this.stateSubject.next({
      currentSite: site,
      currentTemplate: template,
      coupleData: site.couple_data || {},
      theme: mergedTheme,
      isDirty: false,
      isSaving: false,
      error: null
    });
  }

  /**
   * Deep merge theme overrides
   */
  private deepMergeTheme(defaultTheme: Theme, overrides: Partial<Theme>): Theme {
    return {
      colors: {
        ...defaultTheme.colors,
        ...(overrides.colors || {})
      },
      fonts: {
        ...defaultTheme.fonts,
        ...(overrides.fonts || {})
      }
    };
  }

  // ========================
  // COUPLE DATA UPDATES
  // ========================

  /**
   * Update the entire couple data object
   */
  updateCoupleData(coupleData: CoupleData): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      coupleData: { ...coupleData },
      isDirty: true
    });
  }

  /**
   * Update a single field in couple data
   */
  updateCoupleDataField(fieldName: string, value: any): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      coupleData: {
        ...currentState.coupleData,
        [fieldName]: value
      },
      isDirty: true
    });
  }

  /**
   * Update multiple fields at once
   */
  updateCoupleDataFields(fields: Partial<CoupleData>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      coupleData: {
        ...currentState.coupleData,
        ...fields
      },
      isDirty: true
    });
  }

  // ========================
  // THEME UPDATES
  // ========================

  /**
   * Update the entire theme
   */
  updateTheme(theme: Theme): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      theme: { ...theme },
      isDirty: true
    });
  }

  /**
   * Update a specific color
   */
  updateColor(colorKey: keyof Theme['colors'], value: string): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      theme: {
        ...currentState.theme,
        colors: {
          ...currentState.theme.colors,
          [colorKey]: value
        }
      },
      isDirty: true
    });
  }

  /**
   * Update a specific font
   */
  updateFont(fontKey: keyof Theme['fonts'], value: string): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      theme: {
        ...currentState.theme,
        fonts: {
          ...currentState.theme.fonts,
          [fontKey]: value
        }
      },
      isDirty: true
    });
  }

  // ========================
  // SAVING STATE MANAGEMENT
  // ========================

  /**
   * Mark that saving has started
   */
  startSaving(): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      isSaving: true,
      error: null
    });
  }

  /**
   * Mark that saving has finished successfully
   */
  finishSaving(updatedSite?: Site): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      currentSite: updatedSite || currentState.currentSite,
      isSaving: false,
      isDirty: false
    });
  }

  /**
   * Set an error message
   */
  setError(error: string): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      isSaving: false,
      error
    });
  }

  /**
   * Clear the error message
   */
  clearError(): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      error: null
    });
  }

  // ========================
  // OBSERVABLES - Public API for components to subscribe
  // ========================

  /**
   * Get the complete state as observable
   */
  getState$(): Observable<EditorState> {
    return this.stateSubject.asObservable();
  }

  /**
   * Get the current state value (synchronous)
   */
  getStateValue(): EditorState {
    return this.stateSubject.value;
  }

  /**
   * Get only couple data as observable
   */
  getCoupleData$(): Observable<CoupleData> {
    return this.stateSubject.pipe(
      map(state => state.coupleData),
      distinctUntilChanged()
    );
  }

  /**
   * Get only theme as observable
   */
  getTheme$(): Observable<Theme> {
    return this.stateSubject.pipe(
      map(state => state.theme),
      distinctUntilChanged()
    );
  }

  /**
   * Get only template as observable
   */
  getTemplate$(): Observable<Template | null> {
    return this.stateSubject.pipe(
      map(state => state.currentTemplate),
      distinctUntilChanged()
    );
  }

  /**
   * Get only site as observable
   */
  getSite$(): Observable<Site | null> {
    return this.stateSubject.pipe(
      map(state => state.currentSite),
      distinctUntilChanged()
    );
  }

  /**
   * Get isDirty flag as observable
   */
  isDirty$(): Observable<boolean> {
    return this.stateSubject.pipe(
      map(state => state.isDirty),
      distinctUntilChanged()
    );
  }

  /**
   * Get isSaving flag as observable
   */
  isSaving$(): Observable<boolean> {
    return this.stateSubject.pipe(
      map(state => state.isSaving),
      distinctUntilChanged()
    );
  }

  /**
   * Get error as observable
   */
  getError$(): Observable<string | null> {
    return this.stateSubject.pipe(
      map(state => state.error),
      distinctUntilChanged()
    );
  }

  // ========================
  // UTILITY METHODS
  // ========================

  /**
   * Reset the state to initial values
   */
  reset(): void {
    this.stateSubject.next(this.initialState);
  }

  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges(): boolean {
    return this.stateSubject.value.isDirty;
  }

  /**
   * Update the current site (e.g., after save)
   */
  updateCurrentSite(site: Site): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      currentSite: site
    });
  }
}
