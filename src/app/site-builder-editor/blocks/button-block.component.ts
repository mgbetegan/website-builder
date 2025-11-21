// 🔘 BUTTON BLOCK (v2+ customizable with page navigation)

import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Block, Theme } from '../models';

@Component({
  selector: 'app-button-block',
  template: `
    <div class="button-block">
      <button
        class="custom-button"
        [style.background-color]="block.properties.backgroundColor || theme.colors.primary"
        [style.color]="block.properties.textColor || '#ffffff'"
        (click)="handleClick()">
        {{ block.properties.text || 'Cliquez ici' }}
      </button>
    </div>
  `,
  styles: [`
    .button-block {
      padding: 2rem;
      text-align: center;
    }

    .custom-button {
      padding: 1rem 2.5rem;
      border: none;
      border-radius: 6px;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .custom-button:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .custom-button {
        padding: 0.875rem 2rem;
        font-size: 1rem;
      }
    }
  `]
})
export class ButtonBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;

  constructor(private router: Router) {}

  handleClick(): void {
    const action = this.block.properties.action || 'navigate';
    const linkedPageId = this.block.properties.linkedPageId;

    switch (action) {
      case 'navigate':
        if (linkedPageId) {
          // Navigate to the linked page
          this.router.navigate(['/page', linkedPageId]);
        }
        break;
      case 'submit':
        // Trigger form submission (handled by parent)
        console.log('Submit action');
        break;
      case 'call':
        const phone = this.block.properties.phoneNumber;
        if (phone) {
          window.location.href = `tel:${phone}`;
        }
        break;
      case 'email':
        const email = this.block.properties.email;
        if (email) {
          window.location.href = `mailto:${email}`;
        }
        break;
    }
  }
}
