// 📦 SITE BUILDER MODULE - Main module that assembles everything

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

// Main Components
import { SiteEditorComponent } from './components/site-editor.component';
import { EditorLeftPanelComponent } from './components/editor-left-panel.component';
import { EditorCenterPanelComponent } from './components/editor-center-panel.component';
import { EditorRightPanelComponent } from './components/editor-right-panel.component';
import { BlockRendererComponent } from './components/block-renderer.component';

// Block Components (v1)
import { NavigationBlockComponent } from './blocks/navigation-block.component';
import { HeroBlockComponent } from './blocks/hero-block.component';
import { InvitationCardBlockComponent } from './blocks/invitation-card-block.component';
import { CountdownBlockComponent } from './blocks/countdown-block.component';
import { CoupleSectionBlockComponent } from './blocks/couple-section-block.component';
import { PersonBioBlockComponent } from './blocks/person-bio-block.component';
import { FAQSectionBlockComponent } from './blocks/faq-section-block.component';
import { AccordionItemBlockComponent } from './blocks/accordion-item-block.component';
import { RSVPFormBlockComponent } from './blocks/rsvp-form-block.component';

// Block Components (v2+)
import { TextSectionBlockComponent } from './blocks/text-section-block.component';
import { ButtonBlockComponent } from './blocks/button-block.component';
import { FormCustomBlockComponent } from './blocks/form-custom-block.component';
import { FaqCustomBlockComponent } from './blocks/faq-custom-block.component';
import { DividerBlockComponent } from './blocks/divider-block.component';

@NgModule({
  declarations: [
    // Main Components
    SiteEditorComponent,
    EditorLeftPanelComponent,
    EditorCenterPanelComponent,
    EditorRightPanelComponent,
    BlockRendererComponent,

    // Block Components (v1)
    NavigationBlockComponent,
    HeroBlockComponent,
    InvitationCardBlockComponent,
    CountdownBlockComponent,
    CoupleSectionBlockComponent,
    PersonBioBlockComponent,
    FAQSectionBlockComponent,
    AccordionItemBlockComponent,
    RSVPFormBlockComponent,

    // Block Components (v2+)
    TextSectionBlockComponent,
    ButtonBlockComponent,
    FormCustomBlockComponent,
    FaqCustomBlockComponent,
    DividerBlockComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SiteBuilderRoutingModule
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
