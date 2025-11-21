// 🔀 BLOCK RENDERER - Dynamic block rendering with recursion

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Block, Theme } from '../models';

// Import all block components
import { NavigationBlockComponent } from '../blocks/navigation-block.component';
import { HeroBlockComponent } from '../blocks/hero-block.component';
import { InvitationCardBlockComponent } from '../blocks/invitation-card-block.component';
import { CountdownBlockComponent } from '../blocks/countdown-block.component';
import { CoupleSectionBlockComponent } from '../blocks/couple-section-block.component';
import { PersonBioBlockComponent } from '../blocks/person-bio-block.component';
import { FAQSectionBlockComponent } from '../blocks/faq-section-block.component';
import { AccordionItemBlockComponent } from '../blocks/accordion-item-block.component';
import { RSVPFormBlockComponent } from '../blocks/rsvp-form-block.component';
import { TextSectionBlockComponent } from '../blocks/text-section-block.component';
import { ButtonBlockComponent } from '../blocks/button-block.component';
import { FormCustomBlockComponent } from '../blocks/form-custom-block.component';
import { FAQCustomBlockComponent } from '../blocks/faq-custom-block.component';
import { DividerBlockComponent } from '../blocks/divider-block.component';

@Component({
  selector: 'app-block-renderer',
  standalone: true,
  imports: [
    CommonModule,
    NavigationBlockComponent,
    HeroBlockComponent,
    InvitationCardBlockComponent,
    CountdownBlockComponent,
    CoupleSectionBlockComponent,
    PersonBioBlockComponent,
    FAQSectionBlockComponent,
    AccordionItemBlockComponent,
    RSVPFormBlockComponent,
    TextSectionBlockComponent,
    ButtonBlockComponent,
    FormCustomBlockComponent,
    FAQCustomBlockComponent,
    DividerBlockComponent
  ],
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
