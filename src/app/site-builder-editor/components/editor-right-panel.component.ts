// 🎨 RIGHT PANEL - Theme customization and block structure

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditorStateService } from '../services/editor-state.service';
import { BlockLibraryService } from '../services/block-library.service';
import { Template, Theme, Block, BlockTemplate } from '../models';
import { BlockLibraryPanelComponent } from './block-library-panel.component';

@Component({
  selector: 'app-editor-right-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, BlockLibraryPanelComponent],
  templateUrl: './editor-right-panel.component.html',
  styleUrls: ['./editor-right-panel.component.scss']
})
export class EditorRightPanelComponent implements OnInit, OnDestroy {
  @Input() template: Template | null = null;
  @Input() activeTab: 'blocks' | 'design' = 'design';

  @Output() tabChanged = new EventEmitter<'blocks' | 'design'>();
  @Output() dataChanged = new EventEmitter<void>();

  theme!: Theme;
  expandedBlocks: Set<string> = new Set();

  // Font options
  fontOptions = {
    heading: [
      'Playfair Display, serif',
      'Merriweather, serif',
      'Lora, serif',
      'Crimson Text, serif',
      'EB Garamond, serif',
      'Cormorant Garamond, serif'
    ],
    body: [
      'Montserrat, sans-serif',
      'Open Sans, sans-serif',
      'Roboto, sans-serif',
      'Lato, sans-serif',
      'Raleway, sans-serif',
      'Poppins, sans-serif'
    ]
  };

  private destroy$ = new Subject<void>();

  constructor(
    private editorStateService: EditorStateService,
    private blockLibraryService: BlockLibraryService
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.editorStateService.getTheme$().pipe(
      takeUntil(this.destroy$)
    ).subscribe(theme => {
      this.theme = theme;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================
  // TAB SWITCHING
  // ========================

  switchTab(tab: 'blocks' | 'design'): void {
    this.tabChanged.emit(tab);
  }

  // ========================
  // THEME UPDATES
  // ========================

  updateColor(colorKey: keyof Theme['colors'], event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.editorStateService.updateColor(colorKey, value);
    this.dataChanged.emit();
  }

  updateFont(fontKey: keyof Theme['fonts'], event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.editorStateService.updateFont(fontKey, value);
    this.dataChanged.emit();
  }

  // ========================
  // BLOCK TREE
  // ========================

  toggleBlock(blockId: string): void {
    if (this.expandedBlocks.has(blockId)) {
      this.expandedBlocks.delete(blockId);
    } else {
      this.expandedBlocks.add(blockId);
    }
  }

  isBlockExpanded(blockId: string): boolean {
    return this.expandedBlocks.has(blockId);
  }

  hasChildren(block: Block): boolean {
    return !!block.children && block.children.length > 0;
  }

  getBlockIcon(blockType: string): string {
    const icons: Record<string, string> = {
      // v1 blocks
      navigation: '🧭',
      hero: '🎯',
      invitation_card: '💌',
      countdown: '⏰',
      couple_section: '👫',
      person_bio: '👤',
      faq_section: '❓',
      accordion_item: '📋',
      rsvp_form: '📝',
      // v2+ blocks
      text_section: '📝',
      button: '🔘',
      form_custom: '📋',
      faq_custom: '❓',
      divider: '➖'
    };
    return icons[blockType] || '📦';
  }

  getBlockLabel(blockType: string): string {
    const labels: Record<string, string> = {
      // v1 blocks
      navigation: 'Navigation',
      hero: 'Hero Section',
      invitation_card: 'Carte d\'Invitation',
      countdown: 'Compte à Rebours',
      couple_section: 'Section Couple',
      person_bio: 'Bio Personne',
      faq_section: 'Section FAQ',
      accordion_item: 'Item FAQ',
      rsvp_form: 'Formulaire RSVP',
      // v2+ blocks
      text_section: 'Section Texte',
      button: 'Bouton',
      form_custom: 'Formulaire Personnalisé',
      faq_custom: 'FAQ Personnalisée',
      divider: 'Séparateur'
    };
    return labels[blockType] || blockType;
  }

  // ========================
  // BLOCK LIBRARY
  // ========================

  onBlockSelected(blockTemplate: BlockTemplate): void {
    console.log('Block selected:', blockTemplate);

    // Create a new block from the template
    const newBlock = this.blockLibraryService.createBlockFromTemplate(blockTemplate.type);
    console.log('New block created:', newBlock);

    // Add block to the current template
    this.editorStateService.addBlockToTemplate(newBlock);
    console.log('Block added to template structure');

    // Emit dataChanged to trigger save
    this.dataChanged.emit();
  }
}
