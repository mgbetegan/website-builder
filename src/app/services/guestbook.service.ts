import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface GuestBook {
  id?: string;
  projectId?: string;
  name: string;
  templatePath?: string;
  templateOriginalName?: string;
  entries: GuestBookEntry[];
  fields: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GuestBookEntry {
  id?: string;
  guestBookId?: string;
  data: { [key: string]: any };
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GuestBookService {
  private apiUrl = 'http://localhost:3000/api/guestbooks';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Get all guest books
  getAllGuestBooks(): Observable<GuestBook[]> {
    return this.http.get<ApiResponse<GuestBook[]>>(`${this.apiUrl}`).pipe(
      map(response => response.data || []),
      catchError(this.handleError)
    );
  }

  // Get single guest book
  getGuestBook(id: string): Observable<GuestBook> {
    return this.http.get<ApiResponse<GuestBook>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Guest book not found');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Create new guest book
  createGuestBook(guestBook: Partial<GuestBook>): Observable<GuestBook> {
    return this.http.post<ApiResponse<GuestBook>>(
      this.apiUrl,
      guestBook,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Failed to create guest book');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Upload template
  uploadTemplate(id: string, file: File): Observable<{ guestBook: GuestBook; fields: string[] }> {
    const formData = new FormData();
    formData.append('template', file);

    return this.http.post<ApiResponse<{ guestBook: GuestBook; fields: string[] }>>(
      `${this.apiUrl}/${id}/template`,
      formData
    ).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Failed to upload template');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Add entry
  addEntry(id: string, entryData: { [key: string]: any }): Observable<GuestBookEntry> {
    return this.http.post<ApiResponse<GuestBookEntry>>(
      `${this.apiUrl}/${id}/entries`,
      entryData,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Failed to add entry');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Generate document
  generateDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/generate`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete guest book
  deleteGuestBook(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.success),
      catchError(this.handleError)
    );
  }

  // Download generated document
  downloadDocument(id: string, filename: string): void {
    this.generateDocument(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'livre_dor.docx';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        alert('Erreur lors du téléchargement du document');
      }
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('GuestBook API Error:', error);
    const message = error.error?.message || error.message || 'An error occurred';
    return throwError(() => new Error(message));
  }
}
