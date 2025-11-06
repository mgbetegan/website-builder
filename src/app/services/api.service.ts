import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BuilderElement } from '../models/builder-element.model';

export interface Project {
  id?: string;
  name: string;
  description: string;
  elements: BuilderElement[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
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
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // Get all projects
  getAllProjects(): Observable<Project[]> {
    return this.http.get<ApiResponse<Project[]>>(`${this.apiUrl}/projects`).pipe(
      map(response => response.data || []),
      catchError(this.handleError)
    );
  }

  // Get single project
  getProject(id: string): Observable<Project> {
    return this.http.get<ApiResponse<Project>>(`${this.apiUrl}/projects/${id}`).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Project not found');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Create new project
  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<ApiResponse<Project>>(
      `${this.apiUrl}/projects`,
      project,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Failed to create project');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Update project
  updateProject(id: string, updates: Partial<Project>): Observable<Project> {
    return this.http.put<ApiResponse<Project>>(
      `${this.apiUrl}/projects/${id}`,
      updates,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Failed to update project');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Auto-save elements
  autoSave(id: string, elements: BuilderElement[]): Observable<{ id: string; updatedAt: string }> {
    return this.http.post<ApiResponse<{ id: string; updatedAt: string }>>(
      `${this.apiUrl}/projects/${id}/autosave`,
      { elements },
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('Auto-save failed');
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // Delete project
  deleteProject(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/projects/${id}`).pipe(
      map(response => response.success),
      catchError(this.handleError)
    );
  }

  // Export as HTML
  exportHTML(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/projects/${id}/export/html`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Generate Angular project
  generateAngularProject(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/projects/${id}/generate/angular`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    const message = error.error?.message || error.message || 'An error occurred';
    return throwError(() => new Error(message));
  }
}
