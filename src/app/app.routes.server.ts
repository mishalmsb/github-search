import { RenderMode, ServerRoute } from '@angular/ssr';
import { CATEGORIES } from './config/categories.config';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'search/:query', renderMode: RenderMode.Server },
  ...CATEGORIES.map((cat): ServerRoute => ({
    path: cat.slug,
    renderMode: RenderMode.Server,
  })),
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender },
];
