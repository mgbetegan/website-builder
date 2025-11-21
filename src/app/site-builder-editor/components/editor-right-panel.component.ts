// 🎨 RIGHT PANEL - Theme customization and block structure

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditorStateService } from '../services/editor-state.service';
import { Template, Theme, Block } from '../models';

@Component({
  selector: 'app-editor-right-panel',
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

  constructor(private editorStateService: EditorStateService) {}

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
      navigation: '🧭',
      hero: '🎯',
      invitation_card: '💌',
      countdown: '⏰',
      couple_section: '👫',
      person_bio: '👤',
      faq_section: '❓',
      accordion_item: '📋',
      rsvp_form: '📝'
    };
    return icons[blockType] || '📦';
  }

  getBlockLabel(blockType: string): string {
    const labels: Record<string, string> = {
      navigation: 'Navigation',
      hero: 'Hero Section',
      invitation_card: 'Carte d\'Invitation',
      countdown: 'Compte à Rebours',
      couple_section: 'Section Couple',
      person_bio: 'Bio Personne',
      faq_section: 'Section FAQ',
      accordion_item: 'Item FAQ',
      rsvp_form: 'Formulaire RSVP'
    };
    return labels[blockType] || blockType;
  }
}
