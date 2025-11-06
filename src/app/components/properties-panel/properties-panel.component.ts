import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuilderService } from '../../services/builder.service';
import { BuilderElement } from '../../models/builder-element.model';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss']
})
export class PropertiesPanelComponent implements OnInit {
  selectedElement: BuilderElement | null = null;

  constructor(private builderService: BuilderService) {}

  ngOnInit(): void {
    this.builderService.getSelectedElement().subscribe(element => {
      this.selectedElement = element;
    });
  }

  updateContent(content: string): void {
    if (this.selectedElement) {
      this.builderService.updateElement(this.selectedElement.id, { content });
    }
  }

  updateStyle(property: keyof BuilderElement['styles'], value: string): void {
    if (this.selectedElement) {
      this.builderService.updateElementStyles(this.selectedElement.id, {
        [property]: value
      });
    }
  }

  deleteElement(): void {
    if (this.selectedElement && confirm('Supprimer cet élément ?')) {
      this.builderService.deleteElement(this.selectedElement.id);
    }
  }

  get canEditContent(): boolean {
    return this.selectedElement?.type !== 'container';
  }
}
