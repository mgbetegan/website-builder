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
    {
      type: 'text',
      label: 'Texte',
      icon: '📝',
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
    }

    return html;
  }
}
