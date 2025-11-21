// 📄 PAGES PANEL - Manage pages in v2+ mode

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageService } from '../services/page.service';
import { EditorStateService } from '../services/editor-state.service';
import { Page } from '../models';

@Component({
  selector: 'app-pages-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pages-panel">
      <div class="panel-header">
        <h3>📄 Pages</h3>
        <button class="btn-add-page" (click)="showAddPageForm()">
          + Nouvelle Page
        </button>
      </div>

      <!-- Add Page Form -->
      <div class="add-page-form" *ngIf="isAddingPage">
        <input
          type="text"
          [(ngModel)]="newPageTitle"
          placeholder="Titre de la page"
          (keyup.enter)="createPage()"
          class="page-title-input"
        />
        <div class="form-actions">
          <button class="btn-cancel" (click)="cancelAddPage()">Annuler</button>
          <button class="btn-create" (click)="createPage()">Créer</button>
        </div>
      </div>

      <!-- Pages List -->
      <div class="pages-list">
        <div
          *ngFor="let page of pages"
          class="page-item"
          [class.active]="page.id === currentPageId"
          (click)="selectPage(page.id)">
          <div class="page-info">
            <span class="page-icon">📄</span>
            <span class="page-title">{{ page.title }}</span>
            <span class="page-badge home" *ngIf="page.meta.isHomePage">🏠</span>
          </div>
          <div class="page-actions">
            <button
              class="btn-delete"
              (click)="deletePage(page.id, $event)"
              title="Supprimer">
              🗑️
            </button>
          </div>
        </div>

        <div class="empty-state" *ngIf="pages.length === 0">
          <p>Aucune page. Créez votre première page !</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pages-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: white;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 1.125rem;
      color: #333;
    }

    .btn-add-page {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-add-page:hover {
      background: #2563eb;
    }

    .add-page-form {
      padding: 1rem;
      background: #f9f9f9;
      border-bottom: 1px solid #e0e0e0;
    }

    .page-title-input {
      width: 100%;
      padding: 0.625rem;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .form-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .btn-cancel,
    .btn-create {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: #e0e0e0;
      color: #666;
    }

    .btn-cancel:hover {
      background: #d0d0d0;
    }

    .btn-create {
      background: #3b82f6;
      color: white;
    }

    .btn-create:hover {
      background: #2563eb;
    }

    .pages-list {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem;
    }

    .page-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: #f9f9f9;
      border: 2px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .page-item:hover {
      background: #f0f0f0;
    }

    .page-item.active {
      background: #e3f2fd;
      border-color: #3b82f6;
    }

    .page-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
    }

    .page-icon {
      font-size: 1.25rem;
    }

    .page-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
    }

    .page-badge.home {
      font-size: 0.875rem;
    }

    .page-actions {
      display: flex;
      gap: 0.25rem;
    }

    .btn-delete {
      padding: 0.25rem 0.5rem;
      background: transparent;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-delete:hover {
      background: #fee;
    }

    .empty-state {
      padding: 2rem 1rem;
      text-align: center;
      color: #666;
    }

    .empty-state p {
      margin: 0;
      font-size: 0.875rem;
    }
  `]
})
export class PagesPanelComponent implements OnInit {
  @Output() pageSelected = new EventEmitter<string>();

  pages: Page[] = [];
  currentPageId: string | null = null;
  isAddingPage = false;
  newPageTitle = '';
  siteId = 1; // TODO: Get from route or state

  constructor(
    private pageService: PageService,
    private editorStateService: EditorStateService
  ) {}

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(): void {
    this.pageService.getPages(this.siteId).subscribe({
      next: (pages) => {
        this.pages = pages.sort((a, b) => a.order - b.order);
      },
      error: (err) => {
        console.error('Error loading pages:', err);
      }
    });
  }

  showAddPageForm(): void {
    this.isAddingPage = true;
    this.newPageTitle = '';
  }

  cancelAddPage(): void {
    this.isAddingPage = false;
    this.newPageTitle = '';
  }

  createPage(): void {
    if (!this.newPageTitle.trim()) return;

    this.pageService.createPage(this.siteId, this.newPageTitle).subscribe({
      next: (page) => {
        this.pages.push(page);
        this.pages.sort((a, b) => a.order - b.order);
        this.isAddingPage = false;
        this.newPageTitle = '';
        this.selectPage(page.id);
      },
      error: (err) => {
        console.error('Error creating page:', err);
        alert('Erreur lors de la création de la page');
      }
    });
  }

  selectPage(pageId: string): void {
    this.currentPageId = pageId;
    this.editorStateService.setCurrentPage(pageId);
    this.pageSelected.emit(pageId);
  }

  deletePage(pageId: string, event: Event): void {
    event.stopPropagation();

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      return;
    }

    this.pageService.deletePage(this.siteId, pageId).subscribe({
      next: () => {
        this.pages = this.pages.filter(p => p.id !== pageId);
        if (this.currentPageId === pageId) {
          this.currentPageId = this.pages[0]?.id || null;
          if (this.currentPageId) {
            this.selectPage(this.currentPageId);
          }
        }
      },
      error: (err) => {
        console.error('Error deleting page:', err);
        alert('Erreur lors de la suppression de la page');
      }
    });
  }
}
