import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './about.html',
})
export class AboutComponent {
  readonly techStack = [
    { label: 'Angular 21', desc: 'Signals, linkedSignal, effect(), input(), standalone components' },
    { label: '@ngrx/signals 21', desc: 'signalStore, withState, withComputed, withMethods, rxMethod' },
    { label: 'Tailwind CSS v4', desc: '@theme directive, custom paper color palette' },
    { label: 'Angular SSR', desc: 'Server-side rendering with RenderMode.Server for search routes' },
    { label: 'GitHub REST API', desc: 'Public search API — 60 unauthenticated requests per hour' },
    { label: 'Cloudflare Pages', desc: 'Static/SSR hosting with Cache Rules keyed on ?page= only' },
  ];
}
