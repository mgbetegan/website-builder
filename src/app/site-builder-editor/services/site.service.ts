// 💾 SITE SERVICE - CRUD operations for sites

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  Site,
  CoupleData,
  Theme,
  CreateSiteRequest,
  PublishSiteResponse,
  RSVPSubmission,
  RSVPResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private readonly API_URL = '/api/sites';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // ========================
  // CREATE
  // ========================

  /**
   * Create a new site from a template
   */
  createSite(templateId: number, coupleName: string): Observable<Site> {
    const payload: CreateSiteRequest = {
      template_id: templateId,
      couple_name: coupleName
    };

    return this.http.post<Site>(this.API_URL, payload, this.httpOptions).pipe(
      tap(site => console.log(`✅ Site created: ${site.id} - ${site.couple_name}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // READ
  // ========================

  /**
   * Get a single site by ID
   */
  getSite(siteId: number): Observable<Site> {
    return this.http.get<Site>(`${this.API_URL}/${siteId}`).pipe(
      tap(site => console.log(`✅ Site loaded: ${site.couple_name}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Get all sites for the current user
   */
  getUserSites(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.API_URL}`).pipe(
      tap(sites => console.log(`✅ Loaded ${sites.length} user sites`)),
      catchError(this.handleError)
    );
  }

  /**
   * Get a published site by slug (public access)
   */
  getPublishedSiteBySlug(slug: string): Observable<Site> {
    return this.http.get<Site>(`${this.API_URL}/public/${slug}`).pipe(
      tap(site => console.log(`✅ Public site loaded: ${site.couple_name}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // UPDATE
  // ========================

  /**
   * Update couple data for a site
   */
  updateCoupleData(siteId: number, coupleData: CoupleData): Observable<Site> {
    return this.http.patch<Site>(
      `${this.API_URL}/${siteId}`,
      { couple_data: coupleData },
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Couple data updated for site ${siteId}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Update theme for a site
   */
  updateTheme(siteId: number, theme: Partial<Theme>): Observable<Site> {
    return this.http.patch<Site>(
      `${this.API_URL}/${siteId}`,
      { theme_overrides: theme },
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Theme updated for site ${siteId}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Save complete site (couple data + theme)
   */
  saveSite(siteId: number, coupleData: CoupleData, themeOverrides: Partial<Theme>): Observable<Site> {
    return this.http.patch<Site>(
      `${this.API_URL}/${siteId}`,
      {
        couple_data: coupleData,
        theme_overrides: themeOverrides
      },
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Site ${siteId} saved successfully`)),
      catchError(this.handleError)
    );
  }

  /**
   * Update site name
   */
  updateSiteName(siteId: number, coupleName: string): Observable<Site> {
    return this.http.patch<Site>(
      `${this.API_URL}/${siteId}`,
      { couple_name: coupleName },
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Site name updated: ${coupleName}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // PUBLISH / UNPUBLISH
  // ========================

  /**
   * Publish a site (make it publicly accessible)
   */
  publishSite(siteId: number): Observable<PublishSiteResponse> {
    return this.http.post<PublishSiteResponse>(
      `${this.API_URL}/${siteId}/publish`,
      {},
      this.httpOptions
    ).pipe(
      tap(response => console.log(`✅ Site published: ${response.published_url}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Unpublish a site (make it private again)
   */
  unpublishSite(siteId: number): Observable<Site> {
    return this.http.post<Site>(
      `${this.API_URL}/${siteId}/unpublish`,
      {},
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ Site unpublished: ${siteId}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // DELETE
  // ========================

  /**
   * Delete a site
   */
  deleteSite(siteId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${siteId}`).pipe(
      tap(() => console.log(`✅ Site deleted: ${siteId}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // RSVP
  // ========================

  /**
   * Submit an RSVP response (public endpoint)
   */
  submitRSVP(siteId: number, guestData: Record<string, any>): Observable<RSVPResponse> {
    const payload: RSVPSubmission = {
      site_id: siteId,
      guest_data: guestData
    };

    return this.http.post<RSVPResponse>(
      `${this.API_URL}/${siteId}/rsvp`,
      payload,
      this.httpOptions
    ).pipe(
      tap(() => console.log(`✅ RSVP submitted for site ${siteId}`)),
      catchError(this.handleError)
    );
  }

  /**
   * Get RSVP responses for a site (owner only)
   */
  getRSVPResponses(siteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${siteId}/rsvp`).pipe(
      tap(responses => console.log(`✅ Loaded ${responses.length} RSVP responses`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // DUPLICATE
  // ========================

  /**
   * Duplicate an existing site
   */
  duplicateSite(siteId: number, newName: string): Observable<Site> {
    return this.http.post<Site>(
      `${this.API_URL}/${siteId}/duplicate`,
      { couple_name: newName },
      this.httpOptions
    ).pipe(
      tap(site => console.log(`✅ Site duplicated: ${site.id}`)),
      catchError(this.handleError)
    );
  }

  // ========================
  // PREVIEW
  // ========================

  /**
   * Generate preview URL for a site
   */
  getPreviewUrl(siteId: number): string {
    return `${window.location.origin}/preview/${siteId}`;
  }

  /**
   * Generate public URL for a published site
   */
  getPublicUrl(slug: string): string {
    return `${window.location.origin}/sites/${slug}`;
  }

  // ========================
  // ERROR HANDLING
  // ========================

  private handleError(error: any): Observable<never> {
    console.error('❌ Site Service Error:', error);

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
          errorMessage = 'Site non trouvé';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }

      // If server provides a message, use it
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
