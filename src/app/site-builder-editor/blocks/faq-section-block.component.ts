// ❓ FAQ SECTION BLOCK

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, Theme } from '../models';
import { BlockRendererComponent } from '../components/block-renderer.component';

@Component({
  selector: 'app-faq-section-block',
  standalone: true,
  imports: [CommonModule, BlockRendererComponent],
  template: `
    <section class="faq-section">
      <div class="faq-container">
        <h2 class="section-title" [style.color]="theme.colors.primary">
          {{ block.properties.title || 'Questions Fréquentes' }}
        </h2>
        <p class="section-subtitle" [style.color]="theme.colors.text">
          {{ block.properties.subtitle || 'Toutes les informations importantes' }}
        </p>

        <div class="faq-list">
          <app-block-renderer
            *ngFor="let child of block.children"
            [block]="child"
            [theme]="theme">
          </app-block-renderer>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .faq-section {
      padding: 4rem 2rem;
      background: #f9f9f9;
    }

    .faq-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      text-align: center;
      margin: 0 0 1rem 0;
    }

    .section-subtitle {
      font-size: 1.125rem;
      text-align: center;
      margin: 0 0 3rem 0;
      opacity: 0.8;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .section-title {
        font-size: 2rem;
      }
    }
  `]
})
export class FAQSectionBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;
}
