import { Component, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { linkedSignal } from '@angular/core';
import { CATEGORIES } from '../../config/categories.config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  private readonly router = inject(Router);
  readonly categories = CATEGORIES;
  readonly mobileMenuOpen = signal(false);

  private readonly currentUrlQuery = toSignal(
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)),
    { initialValue: null },
  );

  readonly searchInput = linkedSignal(() => {
    this.currentUrlQuery();
    const url = this.router.url;
    const match = url.match(/^\/search\/([^?]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  });

  onSearch(): void {
    const q = this.searchInput().trim();
    if (!q) return;
    this.mobileMenuOpen.set(false);
    this.router.navigate(['/search', q]);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
