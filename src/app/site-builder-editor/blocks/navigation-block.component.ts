// 🧭 NAVIGATION BLOCK

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, Theme } from '../models';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-navigation-block',
  template: `
    <nav class="navigation" [style.background-color]="theme.colors.background">
      <div class="nav-container">
        <div class="nav-logo" [style.color]="theme.colors.primary">
          {{ block.properties.logo || 'Logo' }}
        </div>
        <ul class="nav-menu">
          <li *ngFor="let item of block.properties.items || []">
            <a [href]="'#' + item.href" [style.color]="theme.colors.text">
              {{ item.label }}
            </a>
          </li>
        </ul>
        <button class="nav-button" [style.background-color]="theme.colors.primary" [style.color]="theme.colors.background">
          {{ block.properties.buttonLabel || 'RÉSERVER' }}
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navigation {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
    }

    .nav-logo {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: var(--font-heading);
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-menu a {
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: opacity 0.2s;
    }

    .nav-menu a:hover {
      opacity: 0.7;
    }

    .nav-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .nav-button:hover {
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }
    }
  `]
})
export class NavigationBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;
}
