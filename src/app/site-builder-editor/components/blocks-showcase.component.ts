// 🎨 BLOCKS SHOWCASE - Display all available blocks for testing

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockLibraryService } from '../services/block-library.service';
import { BlockRendererComponent } from './block-renderer.component';
import { BlockTemplate, Block, Theme } from '../models';

@Component({
  selector: 'app-blocks-showcase',
  standalone: true,
  imports: [CommonModule, BlockRendererComponent],
  template: `
    <div class="showcase-container">
      <header class="showcase-header">
        <h1>🎨 Vitrine des Blocs Disponibles</h1>
        <p>Tous les types de blocs disponibles dans le constructeur de site v2+</p>
      </header>

      <div class="blocks-list">
        <div *ngFor="let template of blockTemplates" class="block-section">
          <div class="block-header">
            <h2>{{ template.icon }} {{ template.name }}</h2>
            <span class="block-category">{{ template.category }}</span>
          </div>
          <p class="block-description">{{ template.description }}</p>

          <div class="block-preview">
            <app-block-renderer
              [block]="createSampleBlock(template)"
              [theme]="sampleTheme">
            </app-block-renderer>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .showcase-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .showcase-header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .showcase-header h1 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 2.5rem;
    }

    .showcase-header p {
      margin: 0;
      color: #666;
      font-size: 1.125rem;
    }

    .blocks-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .block-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .block-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .block-category {
      padding: 0.25rem 0.75rem;
      background: #3b82f6;
      color: white;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .block-description {
      margin: 0 0 1.5rem 0;
      color: #666;
      font-size: 0.875rem;
    }

    .block-preview {
      border: 2px dashed #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      background: #fafafa;
    }
  `]
})
export class BlocksShowcaseComponent implements OnInit {
  blockTemplates: BlockTemplate[] = [];

  sampleTheme: Theme = {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'Arial, sans-serif'
    }
  };

  constructor(private blockLibraryService: BlockLibraryService) {}

  ngOnInit(): void {
    this.blockLibraryService.getAvailableBlocks().subscribe(blocks => {
      this.blockTemplates = blocks;
    });
  }

  createSampleBlock(template: BlockTemplate): Block {
    return {
      id: `sample-${template.type}`,
      type: template.type,
      properties: template.defaultProperties,
      order: 1
    };
  }
}
