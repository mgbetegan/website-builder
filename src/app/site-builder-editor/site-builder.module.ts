// 📦 SITE BUILDER MODULE - Main module that assembles everything

import { NgModule } from '@angular/core';

// Routing
import { SiteBuilderRoutingModule } from './site-builder-routing.module';

// Services
import { EditorStateService } from './services/editor-state.service';
import { TemplateService } from './services/template.service';
import { SiteService } from './services/site.service';
import { TemplateMergeService } from './services/template-merge.service';
import { PageService } from './services/page.service';
import { BlockLibraryService } from './services/block-library.service';
import { NavigationService } from './services/navigation.service';

// Main Standalone Component
import { SiteEditorComponent } from './components/site-editor.component';

@NgModule({
  imports: [
    SiteBuilderRoutingModule,
    SiteEditorComponent  // Import standalone component
  ],
  providers: [
    EditorStateService,
    TemplateService,
    SiteService,
    TemplateMergeService,
    PageService,
    BlockLibraryService,
    NavigationService
  ],
  exports: [
    SiteEditorComponent
  ]
})
export class SiteBuilderModule { }
