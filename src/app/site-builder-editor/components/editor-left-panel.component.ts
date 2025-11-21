// 📝 LEFT PANEL - Form for editing couple data

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditorStateService } from '../services/editor-state.service';
import { Site, Template, CoupleData, FAQ, FieldDefinition } from '../models';

@Component({
  selector: 'app-editor-left-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editor-left-panel.component.html',
  styleUrls: ['./editor-left-panel.component.scss']
})
export class EditorLeftPanelComponent implements OnInit, OnDestroy {
  @Input() site: Site | null = null;
  @Input() template: Template | null = null;
  @Input() activeTab: 'content' | 'design' = 'content';

  @Output() tabChanged = new EventEmitter<'content' | 'design'>();
  @Output() dataChanged = new EventEmitter<void>();

  coupleData: CoupleData = {};
  expandedSections: Set<string> = new Set(['Informations du Couple']);

  private destroy$ = new Subject<void>();

  constructor(private editorStateService: EditorStateService) {}

  ngOnInit(): void {
    // Subscribe to couple data changes
    this.editorStateService.getCoupleData$().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.coupleData = data;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================
  // TAB SWITCHING
  // ========================

  switchTab(tab: 'content' | 'design'): void {
    this.tabChanged.emit(tab);
  }

  // ========================
  // SECTION MANAGEMENT
  // ========================

  toggleSection(sectionName: string): void {
    if (this.expandedSections.has(sectionName)) {
      this.expandedSections.delete(sectionName);
    } else {
      this.expandedSections.add(sectionName);
    }
  }

  isSectionExpanded(sectionName: string): boolean {
    return this.expandedSections.has(sectionName);
  }

  // ========================
  // FIELD UPDATES
  // ========================

  updateField(fieldName: string, value: any): void {
    this.editorStateService.updateCoupleDataField(fieldName, value);
    this.dataChanged.emit();
  }

  // ========================
  // FAQ MANAGEMENT
  // ========================

  addFAQ(): void {
    const currentFAQs = this.coupleData.faqs || [];
    const newFAQ: FAQ = {
      question: '',
      answer: '',
      open: false
    };
    this.editorStateService.updateCoupleDataField('faqs', [...currentFAQs, newFAQ]);
    this.dataChanged.emit();
  }

  removeFAQ(index: number): void {
    const currentFAQs = this.coupleData.faqs || [];
    const updatedFAQs = currentFAQs.filter((_, i) => i !== index);
    this.editorStateService.updateCoupleDataField('faqs', updatedFAQs);
    this.dataChanged.emit();
  }

  updateFAQ(index: number, field: 'question' | 'answer', value: string): void {
    const currentFAQs = [...(this.coupleData.faqs || [])];
    if (currentFAQs[index]) {
      currentFAQs[index] = {
        ...currentFAQs[index],
        [field]: value
      };
      this.editorStateService.updateCoupleDataField('faqs', currentFAQs);
      this.dataChanged.emit();
    }
  }

  // ========================
  // FIELD SECTIONS
  // ========================

  get fieldSections(): { [section: string]: FieldDefinition[] } {
    if (!this.template || !this.template.fieldDefinitions) {
      return {};
    }

    const sections: { [section: string]: FieldDefinition[] } = {};

    for (const field of this.template.fieldDefinitions) {
      const sectionName = field.section || 'Autres';
      if (!sections[sectionName]) {
        sections[sectionName] = [];
      }
      sections[sectionName].push(field);
    }

    return sections;
  }

  get sectionNames(): string[] {
    return Object.keys(this.fieldSections);
  }
}
