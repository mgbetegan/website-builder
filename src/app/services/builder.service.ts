import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime } from 'rxjs';
import { BuilderElement, ComponentTemplate } from '../models/builder-element.model';
import { ApiService, Project } from './api.service';

export enum SaveStatus {
  SAVED = 'saved',
  SAVING = 'saving',
  UNSAVED = 'unsaved',
  ERROR = 'error'
}

@Injectable({
  providedIn: 'root'
})
export class BuilderService {
  private apiService = inject(ApiService);

  private elements$ = new BehaviorSubject<BuilderElement[]>([]);
  private selectedElement$ = new BehaviorSubject<BuilderElement | null>(null);
  private saveStatus$ = new BehaviorSubject<SaveStatus>(SaveStatus.SAVED);
  private currentProject$ = new BehaviorSubject<Project | null>(null);

  private nextId = 1;
  private autoSaveSubject$ = new Subject<void>();
  private autoSaveEnabled = true;
  private readonly AUTO_SAVE_DELAY = 2000; // 2 seconds

  constructor() {
    // Setup auto-save with debounce
    this.autoSaveSubject$.pipe(
      debounceTime(this.AUTO_SAVE_DELAY)
    ).subscribe(() => {
      this.performAutoSave();
    });
  }

  readonly componentTemplates: ComponentTemplate[] = [
    // Basic components
    {
      type: 'text',
      label: 'Texte',
      icon: '📝',
      category: 'basic',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: 'auto',
        height: 'auto',
        fontSize: '16px',
        color: '#000000',
        padding: '10px'
      },
      defaultContent: 'Texte par défaut'
    },
    {
      type: 'button',
      label: 'Bouton',
      icon: '🔘',
      category: 'basic',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: '150px',
        height: '40px',
        backgroundColor: '#007bff',
        color: '#ffffff',
        fontSize: '14px',
        borderRadius: '4px',
        padding: '10px 20px',
        border: 'none'
      },
      defaultContent: 'Cliquez ici'
    },
    {
      type: 'image',
      label: 'Image',
      icon: '🖼️',
      category: 'basic',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: '200px',
        height: '150px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px'
      },
      defaultContent: 'https://via.placeholder.com/200x150'
    },
    {
      type: 'container',
      label: 'Container',
      icon: '📦',
      category: 'basic',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: '300px',
        height: '200px',
        backgroundColor: '#f5f5f5',
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }
    },
    // Form components
    {
      type: 'form',
      label: 'Formulaire',
      icon: '📋',
      category: 'form',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: '400px',
        height: 'auto',
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
      }
    },
    {
      type: 'input',
      label: 'Champ texte',
      icon: '✏️',
      category: 'form',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: '250px',
        height: '40px',
        padding: '8px 12px',
        fontSize: '14px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        backgroundColor: '#ffffff'
      },
      defaultFormAttributes: {
        name: 'input_field',
        placeholder: 'Entrez du texte...',
        inputType: 'text',
        required: false
      }
    },
    {
      type: 'textarea',
      label: 'Zone de texte',
      icon: '📄',
      category: 'form',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: '300px',
        height: '100px',
        padding: '8px 12px',
        fontSize: '14px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        backgroundColor: '#ffffff'
      },
      defaultFormAttributes: {
        name: 'textarea_field',
        placeholder: 'Entrez votre message...',
        rows: 4,
        required: false
      }
    },
    {
      type: 'select',
      label: 'Liste déroulante',
      icon: '📑',
      category: 'form',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: '250px',
        height: '40px',
        padding: '8px 12px',
        fontSize: '14px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        backgroundColor: '#ffffff'
      },
      defaultFormAttributes: {
        name: 'select_field',
        required: false,
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' }
        ]
      }
    },
    {
      type: 'checkbox',
      label: 'Case à cocher',
      icon: '☑️',
      category: 'form',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: 'auto',
        height: 'auto',
        padding: '10px'
      },
      defaultContent: "J'accepte les conditions",
      defaultFormAttributes: {
        name: 'checkbox_field',
        checked: false,
        required: false
      }
    },
    {
      type: 'radio',
      label: 'Bouton radio',
      icon: '🔘',
      category: 'form',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: 'auto',
        height: 'auto',
        padding: '10px'
      },
      defaultFormAttributes: {
        name: 'radio_group',
        checked: false,
        options: [
          { label: 'Choix 1', value: 'choice1' },
          { label: 'Choix 2', value: 'choice2' }
        ]
      }
    },
    {
      type: 'label',
      label: 'Label',
      icon: '🏷️',
      category: 'form',
      defaultStyles: {
        position: 'absolute',
        top: '50px',
        left: '50px',
        width: 'auto',
        height: 'auto',
        fontSize: '14px',
        color: '#495057',
        fontWeight: '500',
        padding: '5px'
      },
      defaultContent: 'Label du champ'
    }
  ];

  getElements(): Observable<BuilderElement[]> {
    return this.elements$.asObservable();
  }

  getSelectedElement(): Observable<BuilderElement | null> {
    return this.selectedElement$.asObservable();
  }

  addElement(template: ComponentTemplate, position?: { x: number; y: number }): BuilderElement {
    const newElement: BuilderElement = {
      id: `element-${this.nextId++}`,
      type: template.type,
      content: template.defaultContent,
      formAttributes: template.defaultFormAttributes,
      styles: {
        ...template.defaultStyles,
        ...(position && {
          top: `${position.y}px`,
          left: `${position.x}px`
        })
      } as BuilderElement['styles'],
      children: []
    };

    const currentElements = this.elements$.value;
    this.elements$.next([...currentElements, newElement]);
    this.selectElement(newElement);
    return newElement;
  }

  updateElement(elementId: string, updates: Partial<BuilderElement>): void {
    const elements = this.elements$.value.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    this.elements$.next(elements);

    // Update selected element if it's the one being updated
    if (this.selectedElement$.value?.id === elementId) {
      const updatedElement = elements.find(el => el.id === elementId);
      if (updatedElement) {
        this.selectedElement$.next(updatedElement);
      }
    }
  }

  updateElementStyles(elementId: string, styles: Partial<BuilderElement['styles']>): void {
    const elements = this.elements$.value.map(el =>
      el.id === elementId ? { ...el, styles: { ...el.styles, ...styles } } : el
    );
    this.elements$.next(elements);

    // Update selected element
    if (this.selectedElement$.value?.id === elementId) {
      const updatedElement = elements.find(el => el.id === elementId);
      if (updatedElement) {
        this.selectedElement$.next(updatedElement);
      }
    }
  }

  updateFormAttributes(elementId: string, attributes: Partial<BuilderElement['formAttributes']>): void {
    const elements = this.elements$.value.map(el =>
      el.id === elementId ? {
        ...el,
        formAttributes: { ...el.formAttributes, ...attributes }
      } : el
    );
    this.elements$.next(elements);

    // Update selected element
    if (this.selectedElement$.value?.id === elementId) {
      const updatedElement = elements.find(el => el.id === elementId);
      if (updatedElement) {
        this.selectedElement$.next(updatedElement);
      }
    }
  }

  deleteElement(elementId: string): void {
    const elements = this.elements$.value.filter(el => el.id !== elementId);
    this.elements$.next(elements);

    if (this.selectedElement$.value?.id === elementId) {
      this.selectedElement$.next(null);
    }
  }

  selectElement(element: BuilderElement | null): void {
    this.selectedElement$.next(element);
  }

  clearCanvas(): void {
    this.elements$.next([]);
    this.selectedElement$.next(null);
  }

  exportToJSON(): string {
    return JSON.stringify(this.elements$.value, null, 2);
  }

  importFromJSON(json: string): void {
    try {
      const elements = JSON.parse(json);
      this.elements$.next(elements);
      this.selectedElement$.next(null);
    } catch (error) {
      console.error('Failed to import JSON:', error);
    }
  }

  exportToHTML(): string {
    const elements = this.elements$.value;
    let html = '<!DOCTYPE html>\n<html lang="fr">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '  <title>Page générée</title>\n';
    html += '  <style>\n';
    html += '    body { margin: 0; padding: 0; position: relative; min-height: 100vh; }\n';

    elements.forEach(element => {
      html += `    #${element.id} {\n`;
      Object.entries(element.styles).forEach(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        html += `      ${cssKey}: ${value};\n`;
      });
      html += '    }\n';
    });

    html += '  </style>\n</head>\n<body>\n';

    elements.forEach(element => {
      html += this.elementToHTML(element);
    });

    html += '</body>\n</html>';
    return html;
  }

  private elementToHTML(element: BuilderElement): string {
    let html = '';
    const attrs = element.formAttributes;

    switch (element.type) {
      case 'text':
        html = `  <div id="${element.id}">${element.content}</div>\n`;
        break;
      case 'button':
        html = `  <button id="${element.id}">${element.content}</button>\n`;
        break;
      case 'image':
        html = `  <img id="${element.id}" src="${element.content}" alt="Image" />\n`;
        break;
      case 'container':
        html = `  <div id="${element.id}">`;
        if (element.children && element.children.length > 0) {
          element.children.forEach(child => {
            html += this.elementToHTML(child);
          });
        }
        html += `</div>\n`;
        break;
      case 'form':
        html = `  <form id="${element.id}">`;
        if (element.children && element.children.length > 0) {
          element.children.forEach(child => {
            html += this.elementToHTML(child);
          });
        }
        html += `</form>\n`;
        break;
      case 'input':
        html = `  <input id="${element.id}" type="${attrs?.inputType || 'text'}" `;
        if (attrs?.name) html += `name="${attrs.name}" `;
        if (attrs?.placeholder) html += `placeholder="${attrs.placeholder}" `;
        if (attrs?.required) html += `required `;
        if (attrs?.disabled) html += `disabled `;
        if (attrs?.readonly) html += `readonly `;
        if (attrs?.value) html += `value="${attrs.value}" `;
        html += `/>\n`;
        break;
      case 'textarea':
        html = `  <textarea id="${element.id}" `;
        if (attrs?.name) html += `name="${attrs.name}" `;
        if (attrs?.placeholder) html += `placeholder="${attrs.placeholder}" `;
        if (attrs?.required) html += `required `;
        if (attrs?.disabled) html += `disabled `;
        if (attrs?.readonly) html += `readonly `;
        if (attrs?.rows) html += `rows="${attrs.rows}" `;
        html += `>${attrs?.value || ''}</textarea>\n`;
        break;
      case 'select':
        html = `  <select id="${element.id}" `;
        if (attrs?.name) html += `name="${attrs.name}" `;
        if (attrs?.required) html += `required `;
        if (attrs?.disabled) html += `disabled `;
        html += `>\n`;
        if (attrs?.options) {
          attrs.options.forEach(opt => {
            html += `    <option value="${opt.value}">${opt.label}</option>\n`;
          });
        }
        html += `  </select>\n`;
        break;
      case 'checkbox':
        html = `  <label id="${element.id}-label">`;
        html += `<input type="checkbox" id="${element.id}" `;
        if (attrs?.name) html += `name="${attrs.name}" `;
        if (attrs?.checked) html += `checked `;
        if (attrs?.required) html += `required `;
        if (attrs?.disabled) html += `disabled `;
        html += `/> ${element.content}</label>\n`;
        break;
      case 'radio':
        html = `  <div id="${element.id}">`;
        if (attrs?.options) {
          attrs.options.forEach((opt, index) => {
            html += `<label><input type="radio" name="${attrs.name}" value="${opt.value}" `;
            if (index === 0 && attrs.checked) html += `checked `;
            html += `/> ${opt.label}</label>`;
          });
        }
        html += `</div>\n`;
        break;
      case 'label':
        html = `  <label id="${element.id}"`;
        if (attrs?.labelFor) html += ` for="${attrs.labelFor}"`;
        html += `>${element.content}</label>\n`;
        break;
    }

    return html;
  }

  // API Integration Methods

  getSaveStatus(): Observable<SaveStatus> {
    return this.saveStatus$.asObservable();
  }

  getCurrentProject(): Observable<Project | null> {
    return this.currentProject$.asObservable();
  }

  private triggerAutoSave(): void {
    if (this.autoSaveEnabled && this.currentProject$.value) {
      this.saveStatus$.next(SaveStatus.UNSAVED);
      this.autoSaveSubject$.next();
    }
  }

  private async performAutoSave(): Promise<void> {
    const project = this.currentProject$.value;
    if (!project || !project.id) {
      return;
    }

    try {
      this.saveStatus$.next(SaveStatus.SAVING);
      const elements = this.elements$.value;

      await this.apiService.autoSave(project.id, elements).toPromise();

      this.saveStatus$.next(SaveStatus.SAVED);
      console.log('Auto-saved successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
      this.saveStatus$.next(SaveStatus.ERROR);
    }
  }

  // Override methods to trigger auto-save
  override_addElement(template: ComponentTemplate, position?: { x: number; y: number }): BuilderElement {
    const element = this.addElement(template, position);
    this.triggerAutoSave();
    return element;
  }

  override_updateElement(elementId: string, updates: Partial<BuilderElement>): void {
    this.updateElement(elementId, updates);
    this.triggerAutoSave();
  }

  override_updateElementStyles(elementId: string, styles: Partial<BuilderElement['styles']>): void {
    this.updateElementStyles(elementId, styles);
    this.triggerAutoSave();
  }

  override_updateFormAttributes(elementId: string, attributes: Partial<BuilderElement['formAttributes']>): void {
    this.updateFormAttributes(elementId, attributes);
    this.triggerAutoSave();
  }

  override_deleteElement(elementId: string): void {
    this.deleteElement(elementId);
    this.triggerAutoSave();
  }

  // Project Management

  async createNewProject(name: string, description: string = ''): Promise<Project> {
    try {
      const project = await this.apiService.createProject({
        name,
        description,
        elements: []
      }).toPromise();

      if (project) {
        this.currentProject$.next(project);
        this.elements$.next([]);
        this.saveStatus$.next(SaveStatus.SAVED);
        return project;
      }
      throw new Error('Failed to create project');
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async loadProject(id: string): Promise<void> {
    try {
      const project = await this.apiService.getProject(id).toPromise();

      if (project) {
        this.currentProject$.next(project);
        this.elements$.next(project.elements || []);
        this.selectedElement$.next(null);
        this.saveStatus$.next(SaveStatus.SAVED);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      throw error;
    }
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      return await this.apiService.getAllProjects().toPromise() || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async updateProjectInfo(name: string, description: string): Promise<void> {
    const project = this.currentProject$.value;
    if (!project || !project.id) {
      throw new Error('No project loaded');
    }

    try {
      const updated = await this.apiService.updateProject(project.id, { name, description }).toPromise();
      if (updated) {
        this.currentProject$.next(updated);
      }
    } catch (error) {
      console.error('Error updating project info:', error);
      throw error;
    }
  }

  async deleteCurrentProject(): Promise<void> {
    const project = this.currentProject$.value;
    if (!project || !project.id) {
      throw new Error('No project loaded');
    }

    try {
      await this.apiService.deleteProject(project.id).toPromise();
      this.currentProject$.next(null);
      this.elements$.next([]);
      this.selectedElement$.next(null);
      this.saveStatus$.next(SaveStatus.SAVED);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async exportHTMLFromAPI(): Promise<void> {
    const project = this.currentProject$.value;
    if (!project || !project.id) {
      throw new Error('No project loaded');
    }

    try {
      const blob = await this.apiService.exportHTML(project.id).toPromise();
      if (blob) {
        this.downloadBlob(blob, `${project.name}.html`, 'text/html');
      }
    } catch (error) {
      console.error('Error exporting HTML:', error);
      throw error;
    }
  }

  async generateAngularProject(): Promise<void> {
    const project = this.currentProject$.value;
    if (!project || !project.id) {
      throw new Error('No project loaded');
    }

    try {
      const blob = await this.apiService.generateAngularProject(project.id).toPromise();
      if (blob) {
        this.downloadBlob(blob, `${project.name}.zip`, 'application/zip');
      }
    } catch (error) {
      console.error('Error generating Angular project:', error);
      throw error;
    }
  }

  private downloadBlob(blob: Blob, filename: string, mimeType: string): void {
    const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  setAutoSaveEnabled(enabled: boolean): void {
    this.autoSaveEnabled = enabled;
  }
}
