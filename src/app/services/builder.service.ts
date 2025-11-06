import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BuilderElement, ComponentTemplate } from '../models/builder-element.model';

@Injectable({
  providedIn: 'root'
})
export class BuilderService {
  private elements$ = new BehaviorSubject<BuilderElement[]>([]);
  private selectedElement$ = new BehaviorSubject<BuilderElement | null>(null);
  private nextId = 1;

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
}
