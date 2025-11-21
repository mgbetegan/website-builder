// ✏️ BLOCK EDITOR MODAL - Edit block properties inline

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Block, BlockTemplate } from '../models';
import { ImageUploadComponent } from './image-upload.component';
import { BlockLibraryService } from '../services/block-library.service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-block-editor-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageUploadComponent, DragDropModule],
  template: `
    <div class="modal-backdrop" (click)="close()" *ngIf="block">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>✏️ Éditer le Bloc</h3>
          <button class="btn-close" (click)="close()" type="button">✕</button>
        </div>

        <div class="modal-body">
          <div class="block-info">
            <strong>Type:</strong> {{ block.type }}
          </div>

          <div class="properties-editor">
            <h4>Propriétés</h4>

            <div class="property-group" *ngFor="let prop of getEditableProperties()">
              <label [for]="'prop-' + prop.key">{{ getPropertyLabel(prop.key) }}</label>

              <!-- Text Input -->
              <input
                *ngIf="prop.type === 'text'"
                [id]="'prop-' + prop.key"
                type="text"
                [(ngModel)]="block.properties[prop.key]"
                class="form-input"
                [placeholder]="getPropertyLabel(prop.key)"
              />

              <!-- Textarea -->
              <textarea
                *ngIf="prop.type === 'textarea'"
                [id]="'prop-' + prop.key"
                [(ngModel)]="block.properties[prop.key]"
                class="form-textarea"
                [placeholder]="getPropertyLabel(prop.key)"
                rows="4">
              </textarea>

              <!-- URL Input -->
              <input
                *ngIf="prop.type === 'url'"
                [id]="'prop-' + prop.key"
                type="url"
                [(ngModel)]="block.properties[prop.key]"
                class="form-input"
                [placeholder]="getPropertyLabel(prop.key)"
              />

              <!-- Image Upload -->
              <app-image-upload
                *ngIf="prop.type === 'image'"
                [label]="getPropertyLabel(prop.key)"
                [imageUrl]="block.properties[prop.key]"
                (imageUrlChange)="block.properties[prop.key] = $event"
                [allowUrlInput]="true">
              </app-image-upload>

              <!-- Number Input -->
              <input
                *ngIf="prop.type === 'number'"
                [id]="'prop-' + prop.key"
                type="number"
                [(ngModel)]="block.properties[prop.key]"
                class="form-input"
              />

              <!-- Color Picker -->
              <input
                *ngIf="prop.type === 'color'"
                [id]="'prop-' + prop.key"
                type="color"
                [(ngModel)]="block.properties[prop.key]"
                class="form-color"
              />
            </div>
          </div>

          <!-- Children Editor for Container Blocks -->
          <div class="children-editor" *ngIf="canHaveChildren()">
            <h4>📦 Éléments Enfants</h4>

            <div class="children-list"
                 cdkDropList
                 [id]="'children-drop-' + block.id"
                 [cdkDropListConnectedTo]="['block-library-list']"
                 (cdkDropListDropped)="onChildBlockDrop($event)">
              <div class="child-block" *ngFor="let child of block.children; let i = index">
                <span class="child-icon">📄</span>
                <span class="child-type">{{ child.type }}</span>
                <button class="btn-remove-child"
                        (click)="removeChild(i)"
                        type="button"
                        title="Supprimer">
                  🗑️
                </button>
              </div>

              <div class="drop-hint" *ngIf="!block.children || block.children.length === 0">
                Glissez-déposez des blocs ici ou utilisez le bouton ci-dessous
              </div>
            </div>

            <button class="btn-add-child" (click)="showAddChildDialog = !showAddChildDialog" type="button">
              ➕ Ajouter un élément
            </button>

            <!-- Add Child Dialog -->
            <div class="add-child-dialog" *ngIf="showAddChildDialog">
              <p class="dialog-help">Glissez un bloc depuis la bibliothèque vers la zone ci-dessus</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="close()" type="button">
            Annuler
          </button>
          <button class="btn btn-primary" (click)="save()" type="button">
            💾 Enregistrer
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 600px;
      width: 90%;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #333;
    }

    .btn-close {
      background: transparent;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: #f0f0f0;
      color: #333;
    }

    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .block-info {
      padding: 0.75rem;
      background: #f5f5f5;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      color: #666;
    }

    .properties-editor h4 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }

    .property-group {
      margin-bottom: 1.25rem;
    }

    .property-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #555;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.625rem;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: inherit;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }

    .form-textarea {
      resize: vertical;
    }

    .form-color {
      width: 100px;
      height: 40px;
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      cursor: pointer;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .btn {
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .btn-primary {
      background: #2196f3;
      color: white;
    }

    .btn-primary:hover {
      background: #1976d2;
    }

    .children-editor {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e0e0e0;
    }

    .children-editor h4 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }

    .children-list {
      min-height: 100px;
      padding: 1rem;
      border: 2px dashed #d0d0d0;
      border-radius: 6px;
      margin-bottom: 1rem;
      transition: all 0.2s;
    }

    .children-list.cdk-drop-list-dragging {
      background: rgba(33, 150, 243, 0.05);
      border-color: #2196f3;
    }

    .child-block {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }

    .child-icon {
      font-size: 1.25rem;
    }

    .child-type {
      flex: 1;
      font-size: 0.875rem;
      color: #666;
    }

    .btn-remove-child {
      padding: 0.25rem 0.5rem;
      background: transparent;
      border: none;
      color: #dc3545;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .btn-remove-child:hover {
      transform: scale(1.2);
    }

    .drop-hint {
      text-align: center;
      padding: 2rem;
      color: #999;
      font-size: 0.875rem;
      font-style: italic;
    }

    .btn-add-child {
      width: 100%;
      padding: 0.75rem;
      background: #e3f2fd;
      border: 1px dashed #2196f3;
      border-radius: 4px;
      color: #2196f3;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-add-child:hover {
      background: #bbdefb;
    }

    .add-child-dialog {
      margin-top: 1rem;
      padding: 1rem;
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
    }

    .dialog-help {
      margin: 0;
      font-size: 0.875rem;
      color: #856404;
    }
  `]
})
export class BlockEditorModalComponent implements OnInit {
  @Input() block: Block | null = null;
  @Output() saved = new EventEmitter<Block>();
  @Output() closed = new EventEmitter<void>();

  showAddChildDialog = false;

  constructor(private blockLibraryService: BlockLibraryService) {}

  ngOnInit(): void {
    // Clone the block to avoid mutating the original during editing
    if (this.block) {
      this.block = JSON.parse(JSON.stringify(this.block));
    }
  }

  getEditableProperties(): Array<{key: string, type: string}> {
    if (!this.block) return [];

    const properties: Array<{key: string, type: string}> = [];

    for (const key in this.block.properties) {
      if (key === 'children') continue; // Skip children

      const value = this.block.properties[key];
      let type = 'text';

      // Determine type based on key name and value
      if (key.includes('url') || key.includes('link') || key.includes('href')) {
        type = 'url';
      } else if (key.includes('image') || key.includes('photo') || key.includes('picture')) {
        type = 'image';
      } else if (key.includes('color') || key.includes('colour')) {
        type = 'color';
      } else if (key.includes('description') || key.includes('bio') || key.includes('content')) {
        type = 'textarea';
      } else if (typeof value === 'number') {
        type = 'number';
      }

      properties.push({ key, type });
    }

    return properties;
  }

  getPropertyLabel(key: string): string {
    // Convert camelCase or snake_case to readable label
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  canHaveChildren(): boolean {
    if (!this.block) return false;
    return this.blockLibraryService.canHaveChildren(this.block.type);
  }

  onChildBlockDrop(event: any): void {
    if (!this.block) return;

    // Get the dropped block template
    const blockTemplate = event.item.data as BlockTemplate;
    console.log('Child block dropped:', blockTemplate);

    // Create a new block from the template
    const newBlock = this.blockLibraryService.createBlockFromTemplate(blockTemplate.type);

    // Initialize children array if it doesn't exist
    if (!this.block.children) {
      this.block.children = [];
    }

    // Add the new block to children
    this.block.children.push(newBlock);

    // Close the add child dialog
    this.showAddChildDialog = false;
  }

  removeChild(index: number): void {
    if (!this.block || !this.block.children) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      this.block.children.splice(index, 1);
    }
  }

  save(): void {
    if (this.block) {
      this.saved.emit(this.block);
    }
  }

  close(): void {
    this.closed.emit();
  }
}
