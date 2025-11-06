import { Component } from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolbarComponent, CanvasComponent, PropertiesPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Website Builder';
}
