const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

class ProjectGeneratorService {
  constructor() {
    this.generatedDir = path.join(__dirname, '../../generated-projects');
    fs.ensureDirSync(this.generatedDir);
  }

  /**
   * Generate HTML from elements
   */
  generateHTML(project) {
    let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <style>
    body { margin: 0; padding: 0; position: relative; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; }
`;

    // Add styles for each element
    project.elements.forEach(element => {
      html += `    #${element.id} {\n`;
      Object.entries(element.styles).forEach(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        html += `      ${cssKey}: ${value};\n`;
      });
      html += '    }\n';
    });

    html += `  </style>
</head>
<body>
`;

    // Add elements
    project.elements.forEach(element => {
      html += this.elementToHTML(element);
    });

    html += `</body>
</html>`;

    return html;
  }

  /**
   * Convert element to HTML
   */
  elementToHTML(element) {
    let html = '';
    const attrs = element.formAttributes;

    switch (element.type) {
      case 'text':
        html = `  <div id="${element.id}">${element.content || ''}</div>\n`;
        break;
      case 'button':
        html = `  <button id="${element.id}">${element.content || ''}</button>\n`;
        break;
      case 'image':
        html = `  <img id="${element.id}" src="${element.content || ''}" alt="Image" />\n`;
        break;
      case 'container':
      case 'form':
        const tag = element.type === 'form' ? 'form' : 'div';
        html = `  <${tag} id="${element.id}">`;
        if (element.children && element.children.length > 0) {
          element.children.forEach(child => {
            html += this.elementToHTML(child);
          });
        }
        html += `</${tag}>\n`;
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
        html += `/> ${element.content || ''}</label>\n`;
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
        html += `>${element.content || ''}</label>\n`;
        break;
    }

    return html;
  }

  /**
   * Generate Angular component from project
   */
  async generateAngularProject(project) {
    const projectPath = path.join(this.generatedDir, `project-${project.id}`);

    try {
      // Clean up if exists
      await fs.remove(projectPath);
      await fs.ensureDir(projectPath);

      // Create a simple Angular structure
      const srcPath = path.join(projectPath, 'src');
      const appPath = path.join(srcPath, 'app');

      await fs.ensureDir(appPath);

      // Generate component HTML
      const componentHTML = this.generateComponentHTML(project.elements);

      // Generate component TypeScript
      const componentTS = this.generateComponentTS(project);

      // Generate component CSS
      const componentCSS = this.generateComponentCSS(project.elements);

      // Write files
      await fs.writeFile(path.join(appPath, 'app.component.html'), componentHTML);
      await fs.writeFile(path.join(appPath, 'app.component.ts'), componentTS);
      await fs.writeFile(path.join(appPath, 'app.component.scss'), componentCSS);

      // Generate package.json
      const packageJson = this.generatePackageJson(project);
      await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

      // Generate README
      const readme = this.generateReadme(project);
      await fs.writeFile(path.join(projectPath, 'README.md'), readme);

      return projectPath;
    } catch (error) {
      console.error('Error generating Angular project:', error);
      throw error;
    }
  }

  generateComponentHTML(elements) {
    let html = '<div class="generated-page">\n';
    elements.forEach(element => {
      html += this.elementToAngularHTML(element, '  ');
    });
    html += '</div>\n';
    return html;
  }

  elementToAngularHTML(element, indent = '') {
    let html = '';
    const attrs = element.formAttributes;
    const styleBinding = `[ngStyle]="styles['${element.id}']"`;

    switch (element.type) {
      case 'text':
        html = `${indent}<div id="${element.id}" ${styleBinding}>${element.content || ''}</div>\n`;
        break;
      case 'button':
        html = `${indent}<button id="${element.id}" ${styleBinding}>${element.content || ''}</button>\n`;
        break;
      case 'image':
        html = `${indent}<img id="${element.id}" src="${element.content || ''}" alt="Image" ${styleBinding} />\n`;
        break;
      case 'container':
      case 'form':
        const tag = element.type === 'form' ? 'form' : 'div';
        html = `${indent}<${tag} id="${element.id}" ${styleBinding}>`;
        if (element.children && element.children.length > 0) {
          html += '\n';
          element.children.forEach(child => {
            html += this.elementToAngularHTML(child, indent + '  ');
          });
          html += indent;
        }
        html += `</${tag}>\n`;
        break;
      case 'input':
        html = `${indent}<input id="${element.id}" ${styleBinding} type="${attrs?.inputType || 'text'}" `;
        if (attrs?.name) html += `name="${attrs.name}" `;
        if (attrs?.placeholder) html += `placeholder="${attrs.placeholder}" `;
        if (attrs?.required) html += `required `;
        html += `/>\n`;
        break;
      case 'textarea':
        html = `${indent}<textarea id="${element.id}" ${styleBinding} `;
        if (attrs?.name) html += `name="${attrs.name}" `;
        if (attrs?.placeholder) html += `placeholder="${attrs.placeholder}" `;
        if (attrs?.rows) html += `rows="${attrs.rows}" `;
        html += `></textarea>\n`;
        break;
      case 'select':
        html = `${indent}<select id="${element.id}" ${styleBinding}>\n`;
        if (attrs?.options) {
          attrs.options.forEach(opt => {
            html += `${indent}  <option value="${opt.value}">${opt.label}</option>\n`;
          });
        }
        html += `${indent}</select>\n`;
        break;
      case 'checkbox':
        html = `${indent}<label ${styleBinding}><input type="checkbox" id="${element.id}" /> ${element.content || ''}</label>\n`;
        break;
      case 'label':
        html = `${indent}<label id="${element.id}" ${styleBinding}>${element.content || ''}</label>\n`;
        break;
    }

    return html;
  }

  generateComponentTS(project) {
    const stylesObj = {};
    project.elements.forEach(element => {
      stylesObj[element.id] = element.styles;
    });

    return `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '${project.name}';

  styles = ${JSON.stringify(stylesObj, null, 4)};
}
`;
  }

  generateComponentCSS(elements) {
    let css = `.generated-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

`;
    // Additional global styles can be added here
    return css;
  }

  generatePackageJson(project) {
    return {
      name: project.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: project.description || 'Generated website project',
      scripts: {
        start: 'ng serve',
        build: 'ng build'
      },
      dependencies: {
        '@angular/common': '^20.0.0',
        '@angular/core': '^20.0.0',
        '@angular/platform-browser': '^20.0.0',
        'rxjs': '^7.8.0',
        'tslib': '^2.6.0',
        'zone.js': '^0.15.0'
      }
    };
  }

  generateReadme(project) {
    return `# ${project.name}

${project.description}

## Description

Ce projet a été généré automatiquement par Website Builder.

## Installation

\`\`\`bash
npm install
\`\`\`

## Développement

\`\`\`bash
npm start
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

---

Créé le: ${new Date(project.createdAt).toLocaleDateString('fr-FR')}
Dernière modification: ${new Date(project.updatedAt).toLocaleDateString('fr-FR')}
`;
  }

  /**
   * Create ZIP archive of the generated project
   */
  async createProjectArchive(projectPath) {
    return new Promise((resolve, reject) => {
      const zipPath = `${projectPath}.zip`;
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve(zipPath));
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(projectPath, path.basename(projectPath));
      archive.finalize();
    });
  }
}

module.exports = new ProjectGeneratorService();
