// 📋 FORM CUSTOM BLOCK (v2+ customizable forms)

import { Component, Input } from '@angular/core';
import { Block, Theme, FormField } from '../models';

@Component({
  selector: 'app-form-custom-block',
  template: `
    <section class="form-custom-section">
      <div class="form-container">
        <h2 class="form-title" [style.color]="theme.colors.primary">
          {{ block.properties.title || 'Formulaire' }}
        </h2>

        <form class="custom-form" (submit)="onSubmit($event)" *ngIf="!submitted">
          <div class="form-field" *ngFor="let field of block.properties.fields || []">
            <!-- Text, Email, Tel -->
            <div *ngIf="['text', 'email', 'tel'].includes(field.type)">
              <label [for]="field.name" [style.color]="theme.colors.text">
                {{ field.label }}
                <span class="required" *ngIf="field.required">*</span>
              </label>
              <input
                [id]="field.name"
                [type]="field.type"
                [name]="field.name"
                [required]="field.required"
                [placeholder]="field.placeholder || ''"
                [style.border-color]="theme.colors.primary"
              />
            </div>

            <!-- Textarea -->
            <div *ngIf="field.type === 'textarea'">
              <label [for]="field.name" [style.color]="theme.colors.text">
                {{ field.label }}
                <span class="required" *ngIf="field.required">*</span>
              </label>
              <textarea
                [id]="field.name"
                [name]="field.name"
                [required]="field.required"
                [placeholder]="field.placeholder || ''"
                rows="4"
                [style.border-color]="theme.colors.primary">
              </textarea>
            </div>

            <!-- Select -->
            <div *ngIf="field.type === 'select'">
              <label [for]="field.name" [style.color]="theme.colors.text">
                {{ field.label }}
                <span class="required" *ngIf="field.required">*</span>
              </label>
              <select
                [id]="field.name"
                [name]="field.name"
                [required]="field.required"
                [style.border-color]="theme.colors.primary">
                <option value="">-- Sélectionnez --</option>
                <option *ngFor="let option of field.options" [value]="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- Radio -->
            <div *ngIf="field.type === 'radio'" class="radio-group">
              <label [style.color]="theme.colors.text">
                {{ field.label }}
                <span class="required" *ngIf="field.required">*</span>
              </label>
              <div class="radio-options">
                <label *ngFor="let option of field.options" class="radio-option">
                  <input
                    type="radio"
                    [name]="field.name"
                    [value]="option.value"
                    [required]="field.required"
                  />
                  {{ option.label }}
                </label>
              </div>
            </div>

            <!-- Checkbox -->
            <div *ngIf="field.type === 'checkbox'" class="checkbox-group">
              <label [style.color]="theme.colors.text">
                {{ field.label }}
                <span class="required" *ngIf="field.required">*</span>
              </label>
              <div class="checkbox-options">
                <label *ngFor="let option of field.options" class="checkbox-option">
                  <input
                    type="checkbox"
                    [name]="field.name + '[]'"
                    [value]="option.value"
                  />
                  {{ option.label }}
                </label>
              </div>
            </div>

            <!-- Number -->
            <div *ngIf="field.type === 'number'">
              <label [for]="field.name" [style.color]="theme.colors.text">
                {{ field.label }}
                <span class="required" *ngIf="field.required">*</span>
              </label>
              <input
                [id]="field.name"
                type="number"
                [name]="field.name"
                [required]="field.required"
                [placeholder]="field.placeholder || ''"
                [style.border-color]="theme.colors.primary"
              />
            </div>

            <!-- Date -->
            <div *ngIf="field.type === 'date'">
              <label [for]="field.name" [style.color]="theme.colors.text">
                {{ field.label }}
                <span class="required" *ngIf="field.required">*</span>
              </label>
              <input
                [id]="field.name"
                type="date"
                [name]="field.name"
                [required]="field.required"
                [style.border-color]="theme.colors.primary"
              />
            </div>
          </div>

          <button
            type="submit"
            class="submit-button"
            [style.background-color]="theme.colors.primary"
            [style.color]="theme.colors.background">
            Envoyer
          </button>
        </form>

        <div class="success-message" *ngIf="submitted" [style.color]="theme.colors.primary">
          ✓ {{ block.properties.successMessage || 'Merci ! Votre réponse a été enregistrée.' }}
        </div>
      </div>
    </section>
  `,
  styles: [`
    .form-custom-section {
      padding: 4rem 2rem;
      background: #f9f9f9;
    }

    .form-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .form-title {
      font-family: var(--font-heading);
      font-size: 2rem;
      text-align: center;
      margin: 0 0 2rem 0;
    }

    .custom-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .required {
      color: #f44336;
    }

    .form-field input,
    .form-field textarea,
    .form-field select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid;
      border-radius: 6px;
      font-family: inherit;
      font-size: 1rem;
    }

    .radio-group,
    .checkbox-group {
      margin-bottom: 1rem;
    }

    .radio-options,
    .checkbox-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .radio-option,
    .checkbox-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .submit-button {
      padding: 1rem 2rem;
      border: none;
      border-radius: 6px;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: opacity 0.2s;
    }

    .submit-button:hover {
      opacity: 0.9;
    }

    .success-message {
      padding: 1.5rem;
      background: #e8f5e9;
      border-radius: 6px;
      text-align: center;
      font-weight: 600;
      font-size: 1.125rem;
    }
  `]
})
export class FormCustomBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;

  submitted = false;

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log('Custom form submitted');

    // TODO: Submit to backend
    this.submitted = true;

    setTimeout(() => {
      this.submitted = false;
    }, 5000);
  }
}
