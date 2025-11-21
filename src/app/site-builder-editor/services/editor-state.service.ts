// 🎯 EDITOR STATE SERVICE - Central state management with RxJS
// This is the CORE of the application - all state flows through here

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import {
  EditorState,
  EditorStateV2,
  Site,
  Template,
  CoupleData,
  Theme,
  Page,
  Block,
  BlockTemplate,
  NavigationMenu
} from '../models';

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

  // ========================
  // v2+ EXTENSIONS - PAGES MODE
  // ========================

  // v2+ State
  private readonly initialStateV2: EditorStateV2 = {
    ...this.initialState,
    pages: [],
    currentPage: null,
    currentBlock: null,
    blockLibrary: [],
    navigationMenu: null,
    mode: 'template'
  };

  private stateV2Subject = new BehaviorSubject<EditorStateV2>(this.initialStateV2);

  /**
   * Initialize editor in pages mode (v2+)
   */
  initializeEditorV2(site: Site, pages: Page[], blockLibrary: BlockTemplate[], navigationMenu: NavigationMenu | null): void {
    const theme = site.theme_overrides ? {
      ...this.initialState.theme,
      colors: { ...this.initialState.theme.colors, ...site.theme_overrides.colors },
      fonts: { ...this.initialState.theme.fonts, ...site.theme_overrides.fonts }
    } : this.initialState.theme;

    this.stateV2Subject.next({
      currentSite: site,
      currentTemplate: null,
      coupleData: site.couple_data || {},
      theme,
      isDirty: false,
      isSaving: false,
      error: null,
      pages,
      currentPage: pages.length > 0 ? pages[0] : null,
      currentBlock: null,
      blockLibrary,
      navigationMenu,
      mode: 'pages'
    });
  }

  /**
   * Switch between template and pages mode
   */
  setMode(mode: 'template' | 'pages'): void {
    const currentState = this.stateV2Subject.value;
    this.stateV2Subject.next({
      ...currentState,
      mode
    });
  }

  // ========================
  // PAGE MANAGEMENT
  // ========================

  /**
   * Set all pages
   */
  setPages(pages: Page[]): void {
    const currentState = this.stateV2Subject.value;
    this.stateV2Subject.next({
      ...currentState,
      pages,
      isDirty: true
    });
  }

  /**
   * Add a page
   */
  addPage(page: Page): void {
    const currentState = this.stateV2Subject.value;
    this.stateV2Subject.next({
      ...currentState,
      pages: [...currentState.pages, page],
      isDirty: true
    });
  }

  /**
   * Update a page
   */
  updatePage(pageId: string, updates: Partial<Page>): void {
    const currentState = this.stateV2Subject.value;
    const pages = currentState.pages.map(p =>
      p.id === pageId ? { ...p, ...updates } : p
    );

    this.stateV2Subject.next({
      ...currentState,
      pages,
      currentPage: currentState.currentPage?.id === pageId
        ? { ...currentState.currentPage, ...updates }
        : currentState.currentPage,
      isDirty: true
    });
  }

  /**
   * Remove a page
   */
  removePage(pageId: string): void {
    const currentState = this.stateV2Subject.value;
    const pages = currentState.pages.filter(p => p.id !== pageId);

    this.stateV2Subject.next({
      ...currentState,
      pages,
      currentPage: currentState.currentPage?.id === pageId ? null : currentState.currentPage,
      isDirty: true
    });
  }

  /**
   * Set the current page being edited
   */
  setCurrentPage(pageId: string | null): void {
    if (!pageId) {
      const currentState = this.stateV2Subject.value;
      this.stateV2Subject.next({
        ...currentState,
        currentPage: null,
        currentBlock: null
      });
      return;
    }

    const currentState = this.stateV2Subject.value;
    const page = currentState.pages.find(p => p.id === pageId);

    if (page) {
      this.stateV2Subject.next({
        ...currentState,
        currentPage: page,
        currentBlock: null
      });
    }
  }

  /**
   * Reorder pages
   */
  reorderPages(pageIds: string[]): void {
    const currentState = this.stateV2Subject.value;
    const pagesMap = new Map(currentState.pages.map(p => [p.id, p]));
    const reorderedPages = pageIds
      .map((id, index) => {
        const page = pagesMap.get(id);
        return page ? { ...page, order: index + 1 } : null;
      })
      .filter((p): p is Page => p !== null);

    this.stateV2Subject.next({
      ...currentState,
      pages: reorderedPages,
      isDirty: true
    });
  }

  // ========================
  // BLOCK MANAGEMENT (for current page)
  // ========================

  /**
   * Add a block to the current page
   */
  addBlockToCurrentPage(block: Block): void {
    const currentState = this.stateV2Subject.value;
    if (!currentState.currentPage) return;

    const updatedPage: Page = {
      ...currentState.currentPage,
      structure: [...currentState.currentPage.structure, block]
    };

    this.updatePage(updatedPage.id, { structure: updatedPage.structure });
  }

  /**
   * Remove a block from the current page
   */
  removeBlockFromCurrentPage(blockId: string): void {
    const currentState = this.stateV2Subject.value;
    if (!currentState.currentPage) return;

    const updatedStructure = currentState.currentPage.structure.filter(b => b.id !== blockId);
    this.updatePage(currentState.currentPage.id, { structure: updatedStructure });
  }

  /**
   * Update a block's properties
   */
  updateBlockProperties(pageId: string, blockId: string, properties: Record<string, any>): void {
    const currentState = this.stateV2Subject.value;
    const page = currentState.pages.find(p => p.id === pageId);

    if (!page) return;

    const updateBlockInStructure = (blocks: Block[]): Block[] => {
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

    const updatedStructure = updateBlockInStructure(page.structure);
    this.updatePage(pageId, { structure: updatedStructure });
  }

  /**
   * Reorder blocks in current page
   */
  reorderBlocksInCurrentPage(blockIds: string[]): void {
    const currentState = this.stateV2Subject.value;
    if (!currentState.currentPage) return;

    const blocksMap = new Map(currentState.currentPage.structure.map(b => [b.id, b]));
    const reorderedBlocks = blockIds
      .map((id, index) => {
        const block = blocksMap.get(id);
        return block ? { ...block, order: index + 1 } : null;
      })
      .filter(b => b !== null) as Block[];

    this.updatePage(currentState.currentPage.id, { structure: reorderedBlocks });
  }

  /**
   * Set the currently selected block
   */
  setCurrentBlock(blockId: string | null): void {
    const currentState = this.stateV2Subject.value;
    if (!currentState.currentPage || !blockId) {
      this.stateV2Subject.next({
        ...currentState,
        currentBlock: null
      });
      return;
    }

    const findBlock = (blocks: Block[]): Block | null => {
      for (const block of blocks) {
        if (block.id === blockId) return block;
        if (block.children) {
          const found = findBlock(block.children);
          if (found) return found;
        }
      }
      return null;
    };

    const block = findBlock(currentState.currentPage.structure);
    if (block) {
      this.stateV2Subject.next({
        ...currentState,
        currentBlock: block
      });
    }
  }

  // ========================
  // BLOCK LIBRARY
  // ========================

  /**
   * Set the block library
   */
  setBlockLibrary(blockLibrary: BlockTemplate[]): void {
    const currentState = this.stateV2Subject.value;
    this.stateV2Subject.next({
      ...currentState,
      blockLibrary
    });
  }

  // ========================
  // NAVIGATION MENU
  // ========================

  /**
   * Set the navigation menu
   */
  setNavigationMenu(navigationMenu: NavigationMenu): void {
    const currentState = this.stateV2Subject.value;
    this.stateV2Subject.next({
      ...currentState,
      navigationMenu,
      isDirty: true
    });
  }

  /**
   * Update navigation menu
   */
  updateNavigationMenu(updates: Partial<NavigationMenu>): void {
    const currentState = this.stateV2Subject.value;
    if (!currentState.navigationMenu) return;

    this.stateV2Subject.next({
      ...currentState,
      navigationMenu: {
        ...currentState.navigationMenu,
        ...updates
      },
      isDirty: true
    });
  }

  // ========================
  // v2+ OBSERVABLES
  // ========================

  /**
   * Get the complete v2 state
   */
  getStateV2$(): Observable<EditorStateV2> {
    return this.stateV2Subject.asObservable();
  }

  /**
   * Get current v2 state value
   */
  getStateV2Value(): EditorStateV2 {
    return this.stateV2Subject.value;
  }

  /**
   * Get all pages
   */
  getPages$(): Observable<Page[]> {
    return this.stateV2Subject.pipe(
      map(state => state.pages),
      distinctUntilChanged()
    );
  }

  /**
   * Get current page
   */
  getCurrentPage$(): Observable<Page | null> {
    return this.stateV2Subject.pipe(
      map(state => state.currentPage),
      distinctUntilChanged()
    );
  }

  /**
   * Get current block
   */
  getCurrentBlock$(): Observable<Block | null> {
    return this.stateV2Subject.pipe(
      map(state => state.currentBlock),
      distinctUntilChanged()
    );
  }

  /**
   * Get block library
   */
  getBlockLibrary$(): Observable<BlockTemplate[]> {
    return this.stateV2Subject.pipe(
      map(state => state.blockLibrary),
      distinctUntilChanged()
    );
  }

  /**
   * Get navigation menu
   */
  getNavigationMenu$(): Observable<NavigationMenu | null> {
    return this.stateV2Subject.pipe(
      map(state => state.navigationMenu),
      distinctUntilChanged()
    );
  }

  /**
   * Get mode
   */
  getMode$(): Observable<'template' | 'pages'> {
    return this.stateV2Subject.pipe(
      map(state => state.mode),
      distinctUntilChanged()
    );
  }

  /**
   * Reset v2 state
   */
  resetV2(): void {
    this.stateV2Subject.next(this.initialStateV2);
  }
}
