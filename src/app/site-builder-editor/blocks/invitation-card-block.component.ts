// 💌 INVITATION CARD BLOCK

import { Component, Input } from '@angular/core';
import { Block, Theme } from '../models';

@Component({
  selector: 'app-invitation-card-block',
  template: `
    <div class="invitation-card"
         [style.background-color]="block.properties.backgroundColor || '#ffffff'"
         [style.opacity]="block.properties.opacity || 0.95">
      <h1 class="couple-name" [style.color]="theme.colors.primary">
        {{ block.properties.name || 'Marie & Jean' }}
      </h1>
      <p class="wedding-date" [style.color]="theme.colors.secondary">
        {{ block.properties.date | date:'longDate' }}
      </p>
      <p class="invitation-text" [style.color]="theme.colors.text">
        {{ block.properties.subtitle || 'Nous avons l\'honneur de vous inviter à notre mariage' }}
      </p>
    </div>
  `,
  styles: [`
    .invitation-card {
      padding: 3rem 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .couple-name {
      font-family: var(--font-heading);
      font-size: 3rem;
      margin: 0 0 1rem 0;
      font-weight: 400;
    }

    .wedding-date {
      font-size: 1.25rem;
      margin: 0 0 2rem 0;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .invitation-text {
      font-size: 1.125rem;
      line-height: 1.6;
      margin: 0;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .couple-name {
        font-size: 2rem;
      }

      .wedding-date {
        font-size: 1rem;
      }

      .invitation-text {
        font-size: 1rem;
      }
    }
  `]
})
export class InvitationCardBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;
}
