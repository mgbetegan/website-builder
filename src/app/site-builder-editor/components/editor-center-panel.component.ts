// 👁️ CENTER PANEL - Live Preview

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditorStateService } from '../services/editor-state.service';
import { TemplateMergeService } from '../services/template-merge.service';
import { BlockLibraryService } from '../services/block-library.service';
import { Site, Template, MergedSite, Theme, CoupleData, BlockTemplate, Block } from '../models';
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
  @Output() blockSelected = new EventEmitter<Block>();

  mergedSite: MergedSite | null = null;
  isRendering = false;
  selectedBlockId: string | null = null;

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

  onBlockDrop(event: CdkDragDrop<any>): void {
    // Check if this is a reorder within the same list
    if (event.previousContainer === event.container) {
      // This is a reorder operation
      console.log('Reordering block from', event.previousIndex, 'to', event.currentIndex);

      // Get the current structure
      const structure = event.container.data as Block[];

      // Reorder the blocks
      this.editorStateService.reorderBlocks(event.previousIndex, event.currentIndex);

      // Emit data changed to trigger save
      this.dataChanged.emit();
    } else {
      // This is adding a new block from the library
      const blockTemplate = event.item.data as BlockTemplate;
      console.log('Block dropped:', blockTemplate);

      // Create a new block from the template
      const newBlock = this.blockLibraryService.createBlockFromTemplate(blockTemplate.type);

      // Add block to the template at the specified index
      this.editorStateService.addBlockToTemplate(newBlock, event.currentIndex);

      // Emit data changed to trigger save
      this.dataChanged.emit();
    }
  }

  // ========================
  // BLOCK SELECTION & EDITING
  // ========================

  selectBlock(block: Block): void {
    this.selectedBlockId = block.id;
    this.blockSelected.emit(block);
    console.log('Block selected:', block);
  }

  deleteBlock(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bloc ?')) {
      this.editorStateService.deleteBlock(index);
      this.selectedBlockId = null;
      this.dataChanged.emit();
    }
  }

  // ========================
  // GETTERS
  // ========================

  get viewportClass(): string {
    return this.previewMode === 'mobile' ? 'viewport-mobile' : 'viewport-desktop';
  }
}
