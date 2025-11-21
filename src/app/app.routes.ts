import { Routes } from '@angular/router';

export const routes: Routes = [
  // Blocks Showcase Route
  {
    path: 'blocks-showcase',
    loadComponent: () => import('./site-builder-editor/components/blocks-showcase.component').then(m => m.BlocksShowcaseComponent)
  },
  // Site Builder Editor Route (lazy loaded module)
  {
    path: 'editor/:siteId',
    loadChildren: () => import('./site-builder-editor/site-builder.module').then(m => m.SiteBuilderModule)
  }
];
