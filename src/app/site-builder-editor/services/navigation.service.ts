// 🧭 NAVIGATION SERVICE - Manage navigation menu (v2+)

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NavigationMenu, MenuItem, UpdateNavigationRequest, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly API_URL = '/api/sites';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // ========================
  // GET
  // ========================

  /**
   * Get navigation menu for a site
   */
  getNavigationMenu(siteId: number): Observable<NavigationMenu> {
    return this.http.get<NavigationMenu>(`${this.API_URL}/${siteId}/navigation`).pipe(
      tap(menu => console.log(`✅ Loaded navigation menu for site ${siteId}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // UPDATE
  // ========================

  /**
   * Update navigation menu
   */
  updateNavigationMenu(siteId: number, updates: UpdateNavigationRequest): Observable<NavigationMenu> {
    return this.http.patch<NavigationMenu>(
      `${this.API_URL}/${siteId}/navigation`,
      updates,
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Navigation menu updated for site ${siteId}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // MENU ITEM MANAGEMENT
  // ========================

  /**
   * Add a page to the menu
   */
  addPageToMenu(siteId: number, page: Page): Observable<NavigationMenu> {
    return this.getNavigationMenu(siteId).pipe(
      tap(menu => {
        const newItem: MenuItem = {
          id: this.generateMenuItemId(),
          label: page.title,
          pageId: page.id,
          order: menu.items.length + 1,
          isVisible: page.meta.showInMenu,
          icon: page.meta.icon
        };

        const updatedItems = [...menu.items, newItem];
        return this.updateNavigationMenu(siteId, { items: updatedItems });
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Remove a page from the menu
   */
  removePageFromMenu(siteId: number, pageId: string): Observable<NavigationMenu> {
    return this.getNavigationMenu(siteId).pipe(
      tap(menu => {
        const updatedItems = menu.items.filter(item => item.pageId !== pageId);
        return this.updateNavigationMenu(siteId, { items: updatedItems });
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Reorder menu items
   */
  reorderMenuItems(siteId: number, itemIds: string[]): Observable<NavigationMenu> {
    return this.getNavigationMenu(siteId).pipe(
      tap(menu => {
        const itemsMap = new Map(menu.items.map(item => [item.id, item]));
        const reorderedItems = itemIds
          .map((id, index) => {
            const item = itemsMap.get(id);
            return item ? { ...item, order: index + 1 } : null;
          })
          .filter((item): item is MenuItem => item !== null);

        return this.updateNavigationMenu(siteId, { items: reorderedItems });
      }),
      catchError(this.handleError)
    );
  }

  // ========================
  // GENERATION
  // ========================

  /**
   * Generate navigation menu from pages
   */
  generateNavigationFromPages(siteId: number, pages: Page[]): NavigationMenu {
    const items: MenuItem[] = pages
      .filter(page => page.meta.showInMenu)
      .sort((a, b) => a.order - b.order)
      .map(page => ({
        id: this.generateMenuItemId(),
        label: page.title,
        pageId: page.id,
        order: page.order,
        isVisible: true,
        icon: page.meta.icon
      }));

    return {
      site_id: siteId,
      items,
      style: 'horizontal'
    };
  }

  /**
   * Sync menu with pages (update menu items when pages change)
   */
  syncMenuWithPages(currentMenu: NavigationMenu, pages: Page[]): NavigationMenu {
    const updatedItems = currentMenu.items.map(item => {
      const page = pages.find(p => p.id === item.pageId);
      if (page) {
        return {
          ...item,
          label: page.title,
          isVisible: page.meta.showInMenu,
          icon: page.meta.icon
        };
      }
      return item;
    });

    // Add new pages that are not in the menu
    const existingPageIds = new Set(updatedItems.map(item => item.pageId));
    const newPages = pages.filter(
      page => !existingPageIds.has(page.id) && page.meta.showInMenu
    );

    const newItems = newPages.map(page => ({
      id: this.generateMenuItemId(),
      label: page.title,
      pageId: page.id,
      order: updatedItems.length + newPages.indexOf(page) + 1,
      isVisible: true,
      icon: page.meta.icon
    }));

    return {
      ...currentMenu,
      items: [...updatedItems, ...newItems]
    };
  }

  // ========================
  // UTILITY
  // ========================

  /**
   * Generate unique menu item ID
   */
  private generateMenuItemId(): string {
    return `menu-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ========================
  // ERROR HANDLING
  // ========================

  private handleError(error: any): Observable<never> {
    console.error('❌ Navigation Service Error:', error);

    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide';
          break;
        case 404:
          errorMessage = 'Menu de navigation non trouvé';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }

      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
