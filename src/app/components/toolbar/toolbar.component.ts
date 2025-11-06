import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderService } from '../../services/builder.service';
import { ComponentTemplate } from '../../models/builder-element.model';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  componentTemplates: ComponentTemplate[];

  constructor(public builderService: BuilderService) {
    this.componentTemplates = builderService.componentTemplates;
  }

  get basicComponents(): ComponentTemplate[] {
    return this.componentTemplates.filter(t => t.category === 'basic');
  }

  get formComponents(): ComponentTemplate[] {
    return this.componentTemplates.filter(t => t.category === 'form');
  }

  onDragStart(event: DragEvent, template: ComponentTemplate): void {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('component-template', JSON.stringify(template));
    }
  }

  clearCanvas(): void {
    if (confirm('Êtes-vous sûr de vouloir effacer tout le canvas ?')) {
      this.builderService.clearCanvas();
    }
  }

  saveDesign(): void {
    const json = this.builderService.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  loadDesign(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        this.builderService.importFromJSON(content);
      };
      reader.readAsText(file);
    }
  }

  exportHTML(): void {
    const html = this.builderService.exportToHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'page.html';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput?.click();
  }
}
