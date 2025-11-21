// 📋 ACCORDION ITEM BLOCK

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, Theme } from '../models';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-accordion-item-block',
  template: `
    <div class="accordion-item">
      <div class="accordion-header" (click)="toggle()" [style.background-color]="theme.colors.background">
        <h4 class="accordion-question" [style.color]="theme.colors.primary">
          {{ block.properties.question }}
        </h4>
        <span class="accordion-icon" [style.color]="theme.colors.primary">
          {{ isOpen ? '−' : '+' }}
        </span>
      </div>
      <div class="accordion-body" *ngIf="isOpen" [style.color]="theme.colors.text">
        <p>{{ block.properties.answer }}</p>
      </div>
    </div>
  `,
  styles: [`
    .accordion-item {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .accordion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .accordion-header:hover {
      background-color: #f5f5f5 !important;
    }

    .accordion-question {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      flex: 1;
    }

    .accordion-icon {
      font-size: 1.5rem;
      font-weight: 300;
      margin-left: 1rem;
    }

    .accordion-body {
      padding: 0 1.5rem 1.5rem 1.5rem;
      animation: slideDown 0.3s ease-out;
    }

    .accordion-body p {
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
  `]
})
export class AccordionItemBlockComponent implements OnInit {
  @Input() block!: Block;
  @Input() theme!: Theme;

  isOpen = false;

  ngOnInit(): void {
    this.isOpen = this.block.properties.open || false;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
