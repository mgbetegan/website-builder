// 👁️ CENTER PANEL - Live Preview

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditorStateService } from '../services/editor-state.service';
import { TemplateMergeService } from '../services/template-merge.service';
import { Site, Template, MergedSite, Theme, CoupleData } from '../models';
import { BlockRendererComponent } from './block-renderer.component';

@Component({
  selector: 'app-editor-center-panel',
  standalone: true,
  imports: [CommonModule, BlockRendererComponent],
  templateUrl: './editor-center-panel.component.html',
  styleUrls: ['./editor-center-panel.component.scss']
})
export class EditorCenterPanelComponent implements OnInit, OnDestroy {
  @Input() site: Site | null = null;
  @Input() template: Template | null = null;
  @Input() previewMode: 'desktop' | 'mobile' = 'desktop';

  @Output() previewModeChanged = new EventEmitter<'desktop' | 'mobile'>();

  mergedSite: MergedSite | null = null;
  isRendering = false;

  private destroy$ = new Subject<void>();

  constructor(
    private editorStateService: EditorStateService,
    private templateMergeService: TemplateMergeService
  ) {}

  ngOnInit(): void {
    // Subscribe to state changes and re-render
    combineLatest([
      this.editorStateService.getTemplate$(),
      this.editorStateService.getCoupleData$(),
      this.editorStateService.getTheme$()
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([template, coupleData, theme]) => {
      if (template) {
        this.renderPreview(template, coupleData, theme);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================
  // PREVIEW RENDERING
  // ========================

  private renderPreview(template: Template, coupleData: CoupleData, theme: Theme): void {
    this.isRendering = true;

    try {
      this.mergedSite = this.templateMergeService.mergeTemplate(
        template,
        coupleData,
        theme
      );
      console.log('✅ Preview rendered', this.mergedSite);
    } catch (error) {
      console.error('❌ Preview render failed:', error);
      this.mergedSite = null;
    } finally {
      this.isRendering = false;
    }
  }

  // ========================
  // PREVIEW MODE
  // ========================

  switchPreviewMode(mode: 'desktop' | 'mobile'): void {
    this.previewModeChanged.emit(mode);
  }

  // ========================
  // GETTERS
  // ========================

  get viewportClass(): string {
    return this.previewMode === 'mobile' ? 'viewport-mobile' : 'viewport-desktop';
  }
}
