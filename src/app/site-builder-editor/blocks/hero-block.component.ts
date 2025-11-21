// 🎯 HERO BLOCK

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, Theme } from '../models';

@Component({
  selector: 'app-hero-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero"
             [style.background-image]="'url(' + block.properties.backgroundImage + ')'"
             [style.min-height]="block.properties.minHeight || '600px'">
      <div class="hero-overlay"
           [style.background-color]="block.properties.overlay?.color || 'rgba(0,0,0,0.3)'"
           [style.backdrop-filter]="block.properties.overlay?.blur ? 'blur(4px)' : 'none'">
        <div class="hero-content">
          <h1 *ngIf="block.properties.title" [style.color]="'white'">
            {{ block.properties.title }}
          </h1>
          <p *ngIf="block.properties.subtitle" [style.color]="'white'">
            {{ block.properties.subtitle }}
          </p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .hero-overlay {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-content {
      text-align: center;
      color: white;
      z-index: 1;
      max-width: 800px;
      padding: 2rem;
    }
  `]
})
export class HeroBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;
}
