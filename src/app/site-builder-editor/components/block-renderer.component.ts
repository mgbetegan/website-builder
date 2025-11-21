// 🔀 BLOCK RENDERER - Dynamic block rendering with recursion

import { Component, Input } from '@angular/core';
import { Block, Theme } from '../models';

@Component({
  selector: 'app-block-renderer',
  templateUrl: './block-renderer.component.html',
  styleUrls: ['./block-renderer.component.scss']
})
export class BlockRendererComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;

  /**
   * Check if block has children
   */
  hasChildren(): boolean {
    return !!this.block.children && this.block.children.length > 0;
  }

  /**
   * Get block type for debugging
   */
  getBlockType(): string {
    return this.block.type;
  }
}
