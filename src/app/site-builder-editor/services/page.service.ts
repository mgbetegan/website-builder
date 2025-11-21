// 📄 PAGE SERVICE - CRUD operations for pages (v2+)

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  Page,
  CreatePageRequest,
  UpdatePageRequest,
  AddBlockToPageRequest,
  UpdateBlockRequest,
  ReorderPagesRequest,
  ReorderBlocksRequest,
  Block,
  BlockType
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private readonly API_URL = '/api/sites';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // ========================
  // READ
  // ========================

  /**
   * Get all pages for a site
   */
  getPages(siteId: number): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.API_URL}/${siteId}/pages`).pipe(
      tap(pages => console.log(`✅ Loaded ${pages.length} pages for site ${siteId}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Get a single page
   */
  getPage(siteId: number, pageId: string): Observable<Page> {
    return this.http.get<Page>(`${this.API_URL}/${siteId}/pages/${pageId}`).pipe(
      tap(page => console.log(`✅ Loaded page: ${page.title}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // CREATE
  // ========================

  /**
   * Create a new page
   */
  createPage(siteId: number, title: string): Observable<Page> {
    const payload: CreatePageRequest = {
      site_id: siteId,
      title
    };

    return this.http.post<Page>(`${this.API_URL}/${siteId}/pages`, payload, this.httpOptions).pipe(
      tap(page => console.log(`✅ Page created: ${page.title}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // UPDATE
  // ========================

  /**
   * Update a page
   */
  updatePage(siteId: number, pageId: string, updates: UpdatePageRequest): Observable<Page> {
    return this.http.patch<Page>(
      `${this.API_URL}/${siteId}/pages/${pageId}`,
      updates,
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Page ${pageId} updated`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // DELETE
  // ========================

  /**
   * Delete a page
   */
  deletePage(siteId: number, pageId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${siteId}/pages/${pageId}`).pipe(
      tap(() => console.log(`✅ Page ${pageId} deleted`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // BLOCKS
  // ========================

  /**
   * Add a block to a page
   */
  addBlockToPage(
    siteId: number,
    pageId: string,
    blockType: BlockType,
    properties: Record<string, any>,
    order?: number
  ): Observable<Page> {
    const payload: AddBlockToPageRequest = {
      blockType,
      properties,
      order
    };

    return this.http.post<Page>(
      `${this.API_URL}/${siteId}/pages/${pageId}/blocks`,
      payload,
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Block ${blockType} added to page ${pageId}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Update a block in a page
   */
  updateBlockInPage(
    siteId: number,
    pageId: string,
    blockId: string,
    properties: Record<string, any>
  ): Observable<Page> {
    const payload: UpdateBlockRequest = {
      properties
    };

    return this.http.patch<Page>(
      `${this.API_URL}/${siteId}/pages/${pageId}/blocks/${blockId}`,
      payload,
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Block ${blockId} updated in page ${pageId}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Remove a block from a page
   */
  removeBlockFromPage(siteId: number, pageId: string, blockId: string): Observable<Page> {
    return this.http.delete<Page>(
      `${this.API_URL}/${siteId}/pages/${pageId}/blocks/${blockId}`
    ).pipe(
      tap(() => console.log(`✅ Block ${blockId} removed from page ${pageId}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // REORDERING
  // ========================

  /**
   * Reorder pages
   */
  reorderPages(siteId: number, pageIds: string[]): Observable<Page[]> {
    const payload: ReorderPagesRequest = {
      pageIds
    };

    return this.http.post<Page[]>(
      `${this.API_URL}/${siteId}/pages/reorder`,
      payload,
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Pages reordered for site ${siteId}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Reorder blocks in a page
   */
  reorderBlocks(siteId: number, pageId: string, blockIds: string[]): Observable<Page> {
    const payload: ReorderBlocksRequest = {
      blockIds
    };

    return this.http.post<Page>(
      `${this.API_URL}/${siteId}/pages/${pageId}/blocks/reorder`,
      payload,
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Blocks reordered in page ${pageId}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // UTILITY
  // ========================

  /**
   * Generate slug from title
   */
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Generate unique block ID
   */
  generateBlockId(blockType: BlockType): string {
    return `${blockType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create an empty block
   */
  createEmptyBlock(blockType: BlockType, properties: Record<string, any> = {}): Block {
    return {
      id: this.generateBlockId(blockType),
      type: blockType,
      properties,
      order: 0
    };
  }

  // ========================
  // ERROR HANDLING
  // ========================

  private handleError(error: any): Observable<never> {
    console.error('❌ Page Service Error:', error);

    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide';
          break;
        case 401:
          errorMessage = 'Non autorisé';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Page non trouvée';
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
