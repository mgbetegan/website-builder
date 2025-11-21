// 🖼️ IMAGE UPLOAD - Upload and manage images

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="image-upload">
      <label class="upload-label">{{ label }}</label>

      <!-- Preview -->
      <div class="image-preview" *ngIf="imageUrl">
        <img [src]="imageUrl" [alt]="label" />
        <button
          class="btn-remove-image"
          (click)="removeImage()"
          type="button"
          title="Supprimer l'image">
          🗑️
        </button>
      </div>

      <!-- Upload Area -->
      <div class="upload-area" *ngIf="!imageUrl">
        <input
          #fileInput
          type="file"
          accept="image/*"
          (change)="onFileSelected($event)"
          class="file-input"
          [id]="'file-input-' + inputId"
        />
        <label [for]="'file-input-' + inputId" class="upload-zone">
          <div class="upload-icon">📁</div>
          <div class="upload-text">
            <span class="upload-title">Cliquez pour choisir une image</span>
            <span class="upload-subtitle">ou glissez-déposez</span>
          </div>
        </label>
      </div>

      <!-- URL Input (alternative) -->
      <div class="url-input-section" *ngIf="allowUrlInput && !imageUrl">
        <div class="divider">
          <span>OU</span>
        </div>
        <div class="url-input-group">
          <input
            type="url"
            [(ngModel)]="urlInput"
            placeholder="https://example.com/image.jpg"
            class="url-input"
            (keyup.enter)="useUrl()"
          />
          <button
            class="btn-use-url"
            (click)="useUrl()"
            type="button"
            [disabled]="!urlInput">
            Utiliser
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .image-upload {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .upload-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #555;
    }

    .image-preview {
      position: relative;
      width: 100%;
      max-width: 300px;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid #e0e0e0;
    }

    .image-preview img {
      width: 100%;
      height: auto;
      display: block;
    }

    .btn-remove-image {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 0.5rem;
      background: rgba(220, 53, 69, 0.9);
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-remove-image:hover {
      background: rgba(200, 35, 51, 1);
      transform: scale(1.1);
    }

    .upload-area {
      width: 100%;
    }

    .file-input {
      display: none;
    }

    .upload-zone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
      border: 2px dashed #d0d0d0;
      border-radius: 8px;
      background: #fafafa;
      cursor: pointer;
      transition: all 0.2s;
    }

    .upload-zone:hover {
      border-color: #2196f3;
      background: #f0f8ff;
    }

    .upload-icon {
      font-size: 3rem;
      opacity: 0.5;
    }

    .upload-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      text-align: center;
    }

    .upload-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
    }

    .upload-subtitle {
      font-size: 0.75rem;
      color: #666;
    }

    .url-input-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 0.5rem 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #e0e0e0;
    }

    .divider span {
      padding: 0 0.75rem;
      font-size: 0.75rem;
      color: #999;
      font-weight: 500;
    }

    .url-input-group {
      display: flex;
      gap: 0.5rem;
    }

    .url-input {
      flex: 1;
      padding: 0.625rem;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .url-input:focus {
      outline: none;
      border-color: #2196f3;
    }

    .btn-use-url {
      padding: 0.625rem 1rem;
      background: #2196f3;
      border: none;
      border-radius: 4px;
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-use-url:hover:not(:disabled) {
      background: #1976d2;
    }

    .btn-use-url:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error-message {
      padding: 0.75rem;
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 4px;
      color: #c00;
      font-size: 0.875rem;
    }
  `]
})
export class ImageUploadComponent {
  @Input() label: string = 'Image';
  @Input() imageUrl: string | null = null;
  @Input() allowUrlInput: boolean = true;
  @Input() maxSizeMB: number = 5;

  @Output() imageUrlChange = new EventEmitter<string>();

  urlInput: string = '';
  errorMessage: string = '';
  inputId: string = `img-${Date.now()}-${Math.random()}`;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    this.errorMessage = '';

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Veuillez sélectionner un fichier image valide.';
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > this.maxSizeMB) {
      this.errorMessage = `L'image est trop grande. Taille maximale : ${this.maxSizeMB}MB.`;
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.imageUrl = e.target.result as string;
        this.imageUrlChange.emit(this.imageUrl);
      }
    };
    reader.onerror = () => {
      this.errorMessage = 'Erreur lors de la lecture du fichier.';
    };
    reader.readAsDataURL(file);
  }

  useUrl(): void {
    if (!this.urlInput) return;

    this.errorMessage = '';

    // Basic URL validation
    try {
      new URL(this.urlInput);
      this.imageUrl = this.urlInput;
      this.imageUrlChange.emit(this.imageUrl);
      this.urlInput = '';
    } catch (e) {
      this.errorMessage = 'URL invalide. Veuillez entrer une URL complète.';
    }
  }

  removeImage(): void {
    this.imageUrl = null;
    this.urlInput = '';
    this.errorMessage = '';
    this.imageUrlChange.emit('');
  }
}
