import { Routes } from '@angular/router';
import { NG_DOC_ROUTING } from '@ng-doc/generated';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'docs',
    loadComponent: () => import('./layouts/docs-layout.component').then(m => m.DocsLayoutComponent),
    children: NG_DOC_ROUTING
  }
];
