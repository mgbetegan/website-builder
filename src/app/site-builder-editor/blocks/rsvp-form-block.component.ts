// 📝 RSVP FORM BLOCK

import { Component, Input } from '@angular/core';
import { Block, Theme } from '../models';

@Component({
  selector: 'app-rsvp-form-block',
  template: `
    <section class="rsvp-section">
      <div class="rsvp-container">
        <h2 class="section-title" [style.color]="theme.colors.primary">
          {{ block.properties.title || 'Confirmez votre Présence' }}
        </h2>

        <form class="rsvp-form" (submit)="onSubmit($event)">
          <div class="form-field" *ngFor="let field of block.properties.fields || []">
            <!-- Text Input -->
            <div *ngIf="field.type === 'text' || field.type === 'email' || field.type === 'tel'">
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
                <option *ngFor="let option of field.options" [value]="option">
                  {{ option }}
                </option>
              </select>
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
          ✓ Merci ! Votre réponse a été enregistrée.
        </div>
      </div>
    </section>
  `,
  styles: [`
    .rsvp-section {
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
    }

    .rsvp-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      text-align: center;
      margin: 0 0 2rem 0;
    }

    .rsvp-form {
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
      transition: border-color 0.2s;
    }

    .form-field input:focus,
    .form-field textarea:focus,
    .form-field select:focus {
      outline: none;
      border-width: 3px;
    }

    .submit-button {
      padding: 1rem 2rem;
      border: none;
      border-radius: 6px;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .submit-button:hover {
      opacity: 0.9;
    }

    .success-message {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #e8f5e9;
      border-radius: 6px;
      text-align: center;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .section-title {
        font-size: 2rem;
      }
    }
  `]
})
export class RSVPFormBlockComponent {
  @Input() block!: Block;
  @Input() theme!: Theme;

  submitted = false;

  onSubmit(event: Event): void {
    event.preventDefault();

    // In a real app, submit to backend here
    console.log('RSVP Form submitted');

    this.submitted = true;

    // Reset after 5 seconds
    setTimeout(() => {
      this.submitted = false;
    }, 5000);
  }
}
