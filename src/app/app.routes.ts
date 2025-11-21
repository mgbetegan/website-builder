import { Routes } from '@angular/router';

export const routes: Routes = [
  // Site Builder Editor Route (lazy loaded module)
  {
    path: 'editor/:siteId',
    loadChildren: () => import('./site-builder-editor/site-builder.module').then(m => m.SiteBuilderModule)
  }
];
