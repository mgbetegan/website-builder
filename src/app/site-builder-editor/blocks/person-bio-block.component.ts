// 👤 PERSON BIO BLOCK

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, Theme } from '../models';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-person-bio-block',
  template: `
    <div class="person-bio" [class.image-right]="block.properties.imagePosition === 'right'">
      <div class="bio-image-container">
        <img
          [src]="block.properties.image || '/assets/default-avatar.jpg'"
          [alt]="block.properties.name"
          class="bio-image"
          [style.border-color]="block.properties.borderColor || theme.colors.primary"
        />
      </div>
      <div class="bio-content">
        <h3 class="bio-name" [style.color]="theme.colors.primary">
          {{ block.properties.name }}
        </h3>
        <p class="bio-role" [style.color]="theme.colors.secondary">
          {{ block.properties.role }}
        </p>
        <p class="bio-text" [style.color]="theme.colors.text">
          {{ block.properties.bio }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    .person-bio {
      display: flex;
      align-items: center;
      gap: 3rem;
      padding: 2rem 0;
    }

    .person-bio.image-right {
      flex-direction: row-reverse;
    }

    .bio-image-container {
      flex-shrink: 0;
    }

    .bio-image {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid;
    }

    .bio-content {
      flex: 1;
    }

    .bio-name {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      margin: 0 0 0.5rem 0;
    }

    .bio-role {
      font-size: 1rem;
      margin: 0 0 1rem 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .bio-text {
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
    }

    @media (max-width: 768px) {
      .person-bio {
        flex-direction: column !important;
        text-align: center;
      }

      .bio-image {
        width: 150px;
        height: 150px;
      }
    }
  `]
})
export class PersonBioBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;
}
