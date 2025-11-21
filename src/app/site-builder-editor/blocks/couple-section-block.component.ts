// 👫 COUPLE SECTION BLOCK

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, Theme } from '../models';
import { PersonBioBlockComponent } from './person-bio-block.component';

@Component({
  selector: 'app-couple-section-block',
  standalone: true,
  imports: [CommonModule, PersonBioBlockComponent],
  template: `
    <section class="couple-section"
             [style.background-color]="block.properties.backgroundColor || theme.colors.background">
      <div class="couple-container">
        <h2 class="section-title" [style.color]="theme.colors.primary">
          {{ block.properties.title || 'Notre Histoire' }}
        </h2>
        <p class="section-subtitle" [style.color]="theme.colors.text">
          {{ block.properties.subtitle || 'Découvrez notre parcours' }}
        </p>

        <div class="couple-content">
          <p *ngIf="block.properties.content" [style.color]="theme.colors.text">
            {{ block.properties.content }}
          </p>

          <!-- Render child blocks (typically person_bio blocks) -->
          <div class="couple-children" *ngIf="block.children && block.children.length > 0">
            <app-person-bio-block
              *ngFor="let child of block.children"
              [block]="child"
              [theme]="theme">
            </app-person-bio-block>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .couple-section {
      padding: 4rem 2rem;
    }

    .couple-container {
      max-width: 1200px;
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

    .couple-content {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .couple-children {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 3rem;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .section-title {
        font-size: 2rem;
      }

      .section-subtitle {
        font-size: 1rem;
      }

      .couple-children {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `]
})
export class CoupleSectionBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;
}
