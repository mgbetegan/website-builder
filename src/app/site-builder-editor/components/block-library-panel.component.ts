// 📚 BLOCK LIBRARY PANEL - Display available blocks for v2+

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockLibraryService } from '../services/block-library.service';
import { BlockTemplate, BlockType } from '../models';

@Component({
  selector: 'app-block-library-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="block-library-panel">
      <div class="panel-header">
        <h3>📚 Bibliothèque de Blocs</h3>
        <p class="panel-subtitle">Glissez-déposez les blocs dans votre page</p>
      </div>

      <div class="categories" *ngFor="let category of categories">
        <h4 class="category-title">{{ getCategoryName(category) }}</h4>

        <div class="blocks-grid">
          <div
            *ngFor="let block of getBlocksByCategory(category)"
            class="block-item"
            (click)="onBlockClick(block)">
            <div class="block-icon">{{ block.icon }}</div>
            <div class="block-info">
              <div class="block-name">{{ block.name }}</div>
              <div class="block-description">{{ block.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-footer">
        <p class="help-text">💡 Cliquez sur un bloc pour l'ajouter à votre page</p>
      </div>
    </div>
  `,
  styles: [`
    .block-library-panel {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #f9f9f9;
      overflow-y: auto;
    }

    .panel-header {
      padding: 1.5rem;
      background: white;
      border-bottom: 1px solid #e0e0e0;
    }

    .panel-header h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      color: #333;
    }

    .panel-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: #666;
    }

    .categories {
      padding: 1.5rem;
    }

    .category-title {
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 0.5px;
    }

    .blocks-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .block-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .block-item:hover {
      border-color: #3b82f6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      transform: translateY(-2px);
    }

    .block-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .block-info {
      flex: 1;
      min-width: 0;
    }

    .block-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .block-description {
      font-size: 0.75rem;
      color: #666;
      line-height: 1.4;
    }

    .panel-footer {
      margin-top: auto;
      padding: 1rem 1.5rem;
      background: white;
      border-top: 1px solid #e0e0e0;
    }

    .help-text {
      margin: 0;
      font-size: 0.75rem;
      color: #666;
      text-align: center;
    }

    @media (min-width: 768px) {
      .blocks-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class BlockLibraryPanelComponent implements OnInit {
  @Output() blockSelected = new EventEmitter<BlockTemplate>();

  blockTemplates: BlockTemplate[] = [];
  categories: string[] = [];

  constructor(private blockLibraryService: BlockLibraryService) {}

  ngOnInit(): void {
    this.blockLibraryService.getAvailableBlocks().subscribe(blocks => {
      this.blockTemplates = blocks;
      this.categories = [...new Set(blocks.map(b => b.category))];
    });
  }

  getBlocksByCategory(category: string): BlockTemplate[] {
    return this.blockTemplates.filter(b => b.category === category);
  }

  getCategoryName(category: string): string {
    const names: Record<string, string> = {
      'content': '📝 Contenu',
      'layout': '📐 Mise en page',
      'media': '🖼️ Média',
      'form': '📋 Formulaires',
      'navigation': '🧭 Navigation',
      'interactive': '⚡ Interactif'
    };
    return names[category] || category;
  }

  onBlockClick(block: BlockTemplate): void {
    this.blockSelected.emit(block);
  }
}
