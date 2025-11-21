// ➖ DIVIDER BLOCK (v2+ simple separator)

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, Theme } from '../models';

@Component({
  selector: 'app-divider-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="divider-block"
         [style.margin-top]="block.properties.marginTop || '2rem'"
         [style.margin-bottom]="block.properties.marginBottom || '2rem'">
      <hr class="divider"
          [style.height]="block.properties.height || '2px'"
          [style.background-color]="block.properties.color || theme.colors.secondary"
      />
    </div>
  `,
  styles: [`
    .divider-block {
      width: 100%;
      padding: 0 2rem;
    }

    .divider {
      border: none;
      margin: 0 auto;
      max-width: 800px;
    }
  `]
})
export class DividerBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;
}
