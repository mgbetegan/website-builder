// 📝 TEXT SECTION BLOCK (v2+ customizable)

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, Theme } from '../models';

@Component({
  selector: 'app-text-section-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="text-section"
             [style.background-color]="block.properties.backgroundColor || '#ffffff'"
             [style.text-align]="block.properties.alignment || 'left'">
      <div class="text-section-container">
        <h2 *ngIf="block.properties.title"
            class="section-title"
            [style.color]="theme.colors.primary">
          {{ block.properties.title }}
        </h2>
        <div class="section-content"
             [style.color]="theme.colors.text"
             [innerHTML]="block.properties.content">
        </div>
      </div>
    </section>
  `,
  styles: [`
    .text-section {
      padding: 3rem 2rem;
    }

    .text-section-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 2rem;
      margin: 0 0 1.5rem 0;
    }

    .section-content {
      font-size: 1rem;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    @media (max-width: 768px) {
      .section-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class TextSectionBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;
}
