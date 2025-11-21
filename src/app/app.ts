import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';
import { GuestBookComponent } from './components/guestbook/guestbook.component';
import { BuilderService, SaveStatus } from './services/builder.service';
import { ViewService, ViewMode } from './services/view.service';
import { Project } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent, CanvasComponent, PropertiesPanelComponent, GuestBookComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  title = 'Website Builder';
  saveStatus: SaveStatus = SaveStatus.SAVED;
  currentProject: Project | null = null;
  currentView: ViewMode = ViewMode.BUILDER;
  SaveStatus = SaveStatus;
  ViewMode = ViewMode;

  constructor(
    private builderService: BuilderService,
    public viewService: ViewService
  ) {}

  ngOnInit(): void {
    // Subscribe to save status
    this.builderService.getSaveStatus().subscribe(status => {
      this.saveStatus = status;
    });

    // Subscribe to current project
    this.builderService.getCurrentProject().subscribe(project => {
      this.currentProject = project;
    });

    // Subscribe to current view
    this.viewService.getCurrentView().subscribe(view => {
      this.currentView = view;
    });

    // Create a default project on startup
    this.createDefaultProject();
  }

  private async createDefaultProject(): Promise<void> {
    try {
      await this.builderService.createNewProject('Mon Projet', 'Nouveau projet de site web');
    } catch (error) {
      console.error('Error creating default project:', error);
    }
  }

  get saveStatusText(): string {
    switch (this.saveStatus) {
      case SaveStatus.SAVED:
        return '✓ Sauvegardé';
      case SaveStatus.SAVING:
        return '⟳ Sauvegarde...';
      case SaveStatus.UNSAVED:
        return '● Non sauvegardé';
      case SaveStatus.ERROR:
        return '✗ Erreur';
      default:
        return '';
    }
  }

  get saveStatusClass(): string {
    return `save-status-${this.saveStatus}`;
  }
}
