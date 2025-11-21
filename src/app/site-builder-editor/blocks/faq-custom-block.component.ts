// ❓ FAQ CUSTOM BLOCK (v2+ customizable FAQs)

import { Component, Input } from '@angular/core';
import { Block, Theme, FAQItem } from '../models';

@Component({
  selector: 'app-faq-custom-block',
  template: `
    <section class="faq-custom-section">
      <div class="faq-container">
        <h2 class="section-title" [style.color]="theme.colors.primary">
          {{ block.properties.title || 'Questions Fréquentes' }}
        </h2>
        <p class="section-subtitle" *ngIf="block.properties.subtitle" [style.color]="theme.colors.text">
          {{ block.properties.subtitle }}
        </p>

        <div class="faq-list">
          <div class="faq-item" *ngFor="let item of block.properties.items || []; let i = index">
            <div class="faq-header" (click)="toggleFAQ(i)" [style.background-color]="theme.colors.background">
              <h4 class="faq-question" [style.color]="theme.colors.primary">
                {{ item.question }}
              </h4>
              <span class="faq-icon" [style.color]="theme.colors.primary">
                {{ openItems.has(i) ? '−' : '+' }}
              </span>
            </div>
            <div class="faq-body" *ngIf="openItems.has(i)" [style.color]="theme.colors.text">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .faq-custom-section {
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

    .faq-item {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .faq-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .faq-header:hover {
      background-color: #f5f5f5 !important;
    }

    .faq-question {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      flex: 1;
    }

    .faq-icon {
      font-size: 1.5rem;
      font-weight: 300;
      margin-left: 1rem;
    }

    .faq-body {
      padding: 0 1.5rem 1.5rem 1.5rem;
      animation: slideDown 0.3s ease-out;
    }

    .faq-body p {
      margin: 0;
      line-height: 1.6;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .section-title {
        font-size: 2rem;
      }
    }
  `]
})
export class FAQCustomBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;

  openItems = new Set<number>();

  ngOnInit(): void {
    // Open items marked as open by default
    const items = this.block.properties.items || [];
    items.forEach((item: FAQItem, index: number) => {
      if (item.open) {
        this.openItems.add(index);
      }
    });
  }

  toggleFAQ(index: number): void {
    if (this.openItems.has(index)) {
      this.openItems.delete(index);
    } else {
      this.openItems.add(index);
    }
  }
}
