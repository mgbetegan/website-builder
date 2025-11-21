// 👁️ CENTER PANEL - Live Preview

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditorStateService } from '../services/editor-state.service';
import { TemplateMergeService } from '../services/template-merge.service';
import { BlockLibraryService } from '../services/block-library.service';
import { Site, Template, MergedSite, Theme, CoupleData, BlockTemplate } from '../models';
import { BlockRendererComponent } from './block-renderer.component';

@Component({
  selector: 'app-editor-center-panel',
  standalone: true,
  imports: [CommonModule, DragDropModule, BlockRendererComponent],
  templateUrl: './editor-center-panel.component.html',
  styleUrls: ['./editor-center-panel.component.scss']
})
export class EditorCenterPanelComponent implements OnInit, OnDestroy {
  @Input() site: Site | null = null;
  @Input() template: Template | null = null;
  @Input() previewMode: 'desktop' | 'mobile' = 'desktop';

  @Output() previewModeChanged = new EventEmitter<'desktop' | 'mobile'>();
  @Output() dataChanged = new EventEmitter<void>();

  mergedSite: MergedSite | null = null;
  isRendering = false;

  private destroy$ = new Subject<void>();

  constructor(
    private editorStateService: EditorStateService,
    private templateMergeService: TemplateMergeService,
    private blockLibraryService: BlockLibraryService
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
  // DRAG & DROP
  // ========================

  onBlockDrop(event: CdkDragDrop<BlockTemplate>): void {
    const blockTemplate = event.item.data as BlockTemplate;
    console.log('Block dropped:', blockTemplate);

    // Create a new block from the template
    const newBlock = this.blockLibraryService.createBlockFromTemplate(blockTemplate.type);

    // Add block to the template
    this.editorStateService.addBlockToTemplate(newBlock);

    // Emit data changed to trigger save
    this.dataChanged.emit();
  }

  // ========================
  // GETTERS
  // ========================

  get viewportClass(): string {
    return this.previewMode === 'mobile' ? 'viewport-mobile' : 'viewport-desktop';
  }
}
