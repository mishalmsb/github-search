import { Routes } from '@angular/router';
import { CATEGORIES } from './config/categories.config';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'search/:query',
    loadComponent: () => import('./pages/search/search').then((m) => m.SearchComponent),
  },
  ...CATEGORIES.map((cat) => ({
    path: cat.slug,
    loadComponent: () => import('./pages/search/search').then((m) => m.SearchComponent),
    data: { query: cat.slug, isCategory: true, categoryLabel: cat.label },
  })),
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutComponent),
  },
  { path: '**', redirectTo: '' },
];
