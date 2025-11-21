// 🚦 SITE BUILDER ROUTING MODULE

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteEditorComponent } from './components/site-editor.component';

const routes: Routes = [
  {
    path: '',
    component: SiteEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteBuilderRoutingModule { }
