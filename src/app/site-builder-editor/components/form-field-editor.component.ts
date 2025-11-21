// 📋 FORM FIELD EDITOR - Edit form fields with options for select/radio/checkbox

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormField, FormFieldOption } from '../models';

@Component({
  selector: 'app-form-field-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-field-editor">
      <h4>Éditer les Champs du Formulaire</h4>

      <!-- Fields List -->
      <div class="fields-list">
        <div *ngFor="let field of fields; let i = index" class="field-item">
          <div class="field-header">
            <span class="field-number">Champ #{{ i + 1 }}</span>
            <button class="btn-remove" (click)="removeField(i)" type="button">
              🗑️ Supprimer
            </button>
          </div>

          <div class="field-form">
            <!-- Field Label -->
            <div class="form-group">
              <label>Label</label>
              <input
                type="text"
                [(ngModel)]="field.label"
                (ngModelChange)="onFieldsChange()"
                placeholder="Nom du champ"
                class="form-input"
              />
            </div>

            <!-- Field Name -->
            <div class="form-group">
              <label>Nom (ID)</label>
              <input
                type="text"
                [(ngModel)]="field.name"
                (ngModelChange)="onFieldsChange()"
                placeholder="nom_champ"
                class="form-input"
              />
            </div>

            <!-- Field Type -->
            <div class="form-group">
              <label>Type</label>
              <select
                [(ngModel)]="field.type"
                (ngModelChange)="onFieldTypeChange(field)"
                class="form-select">
                <option value="text">Texte</option>
                <option value="email">Email</option>
                <option value="tel">Téléphone</option>
                <option value="number">Nombre</option>
                <option value="date">Date</option>
                <option value="textarea">Zone de texte</option>
                <option value="select">Liste déroulante</option>
                <option value="radio">Boutons radio</option>
                <option value="checkbox">Cases à cocher</option>
              </select>
            </div>

            <!-- Required Checkbox -->
            <div class="form-group form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="field.required"
                  (ngModelChange)="onFieldsChange()"
                />
                <span>Champ obligatoire</span>
              </label>
            </div>

            <!-- Placeholder (for text-based fields) -->
            <div class="form-group" *ngIf="needsPlaceholder(field.type)">
              <label>Placeholder</label>
              <input
                type="text"
                [(ngModel)]="field.placeholder"
                (ngModelChange)="onFieldsChange()"
                placeholder="Texte d'aide..."
                class="form-input"
              />
            </div>

            <!-- Options Editor (for select, radio, checkbox) -->
            <div class="options-editor" *ngIf="needsOptions(field.type)">
              <label class="options-label">Options</label>

              <div class="options-list">
                <div *ngFor="let option of field.options; let j = index" class="option-item">
                  <input
                    type="text"
                    [(ngModel)]="option.value"
                    (ngModelChange)="onFieldsChange()"
                    placeholder="valeur"
                    class="option-input option-value"
                  />
                  <input
                    type="text"
                    [(ngModel)]="option.label"
                    (ngModelChange)="onFieldsChange()"
                    placeholder="Libellé"
                    class="option-input option-label"
                  />
                  <button
                    class="btn-remove-option"
                    (click)="removeOption(field, j)"
                    type="button"
                    title="Supprimer l'option">
                    ✕
                  </button>
                </div>
              </div>

              <button
                class="btn-add-option"
                (click)="addOption(field)"
                type="button">
                + Ajouter une option
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Field Button -->
      <button class="btn-add-field" (click)="addField()" type="button">
        + Ajouter un Champ
      </button>
    </div>
  `,
  styles: [`
    .form-field-editor {
      padding: 1rem;
    }

    h4 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }

    .fields-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .field-item {
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 1rem;
    }

    .field-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .field-number {
      font-weight: 600;
      color: #666;
      font-size: 0.875rem;
    }

    .btn-remove {
      padding: 0.375rem 0.75rem;
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-remove:hover {
      background: #fdd;
      border-color: #faa;
    }

    .field-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-group-checkbox {
      flex-direction: row;
      align-items: center;
    }

    .form-group-checkbox label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .form-group-checkbox input[type="checkbox"] {
      width: auto;
      margin: 0;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #555;
    }

    .form-input,
    .form-select {
      padding: 0.625rem;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 0.875rem;
      background: white;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #2196f3;
    }

    .options-editor {
      margin-top: 0.5rem;
      padding: 0.75rem;
      background: white;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
    }

    .options-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #555;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .option-item {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .option-input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .option-value {
      max-width: 120px;
    }

    .option-input:focus {
      outline: none;
      border-color: #2196f3;
    }

    .btn-remove-option {
      padding: 0.375rem 0.5rem;
      background: transparent;
      border: none;
      color: #dc3545;
      cursor: pointer;
      font-size: 1.125rem;
      line-height: 1;
      transition: all 0.2s;
    }

    .btn-remove-option:hover {
      color: #c82333;
      transform: scale(1.2);
    }

    .btn-add-option {
      width: 100%;
      padding: 0.5rem;
      background: #e3f2fd;
      border: 1px dashed #2196f3;
      border-radius: 4px;
      color: #2196f3;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-add-option:hover {
      background: #bbdefb;
    }

    .btn-add-field {
      width: 100%;
      padding: 0.75rem;
      background: #2196f3;
      border: none;
      border-radius: 6px;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-add-field:hover {
      background: #1976d2;
    }
  `]
})
export class FormFieldEditorComponent {
  @Input() fields: FormField[] = [];
  @Output() fieldsChange = new EventEmitter<FormField[]>();

  addField(): void {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: ''
    };
    this.fields.push(newField);
    this.onFieldsChange();
  }

  removeField(index: number): void {
    this.fields.splice(index, 1);
    this.onFieldsChange();
  }

  onFieldTypeChange(field: FormField): void {
    // Initialize options array if field type needs options
    if (this.needsOptions(field.type) && !field.options) {
      field.options = [];
    }
    this.onFieldsChange();
  }

  needsOptions(type: string): boolean {
    return type === 'select' || type === 'radio' || type === 'checkbox';
  }

  needsPlaceholder(type: string): boolean {
    return ['text', 'email', 'tel', 'number', 'textarea'].includes(type);
  }

  addOption(field: FormField): void {
    if (!field.options) {
      field.options = [];
    }
    field.options.push({
      value: '',
      label: ''
    });
    this.onFieldsChange();
  }

  removeOption(field: FormField, index: number): void {
    if (field.options) {
      field.options.splice(index, 1);
      this.onFieldsChange();
    }
  }

  onFieldsChange(): void {
    this.fieldsChange.emit(this.fields);
  }
}
