import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { BuilderService } from '../../services/builder.service';
import { BuilderElement } from '../../models/builder-element.model';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  elements: BuilderElement[] = [];
  selectedElementId: string | null = null;

  constructor(public builderService: BuilderService) {}

  ngOnInit(): void {
    this.builderService.getElements().subscribe(elements => {
      this.elements = elements;
    });

    this.builderService.getSelectedElement().subscribe(element => {
      this.selectedElementId = element?.id || null;
    });
  }

  onDragEnded(event: CdkDragEnd, element: BuilderElement): void {
    const position = event.source.getFreeDragPosition();
    const currentTop = parseFloat(element.styles.top) || 0;
    const currentLeft = parseFloat(element.styles.left) || 0;

    this.builderService.updateElementStyles(element.id, {
      top: `${currentTop + position.y}px`,
      left: `${currentLeft + position.x}px`
    });

    // Reset drag position
    event.source.reset();
  }

  selectElement(element: BuilderElement, event: Event): void {
    event.stopPropagation();
    this.builderService.selectElement(element);
  }

  deselectAll(): void {
    this.builderService.selectElement(null);
  }

  isSelected(elementId: string): boolean {
    return this.selectedElementId === elementId;
  }

  onCanvasDrop(event: DragEvent): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('component-template');

    if (data) {
      const template = JSON.parse(data);
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      this.builderService.addElement(template, position);
    }
  }

  onCanvasDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  deleteSelected(): void {
    if (this.selectedElementId) {
      this.builderService.deleteElement(this.selectedElementId);
    }
  }
}
